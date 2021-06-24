<!--
  This component handles real time updates from Pusher. We handle these
  manually here instead of via GraphQL subscriptions because we want these updates
  to be global over the application, rather than just where those subscriptions
  may be.
-->
<script>
  import { onMount, getContext } from 'svelte';
  import { pusherChannel, pusherBeam, onlineUsers, authTokens, Toasts } from '@metafy/lib/stores';
  import { PUSHER_BEAM_INSTANCE, PUSHER_CHANNEL_KEY, API_URL } from '@metafy/lib/constants';
  import {
    CONVERSATION_FIELDS,
    CONVERSATION_MESSAGE_FIELDS,
    GET_CONVERSATION,
    GET_CONVERSATION_MESSAGE,
    GET_CONVERSATION_MESSAGES
  } from '@metafy/graphql/queries';
  import { client, cache } from '@metafy/lib/apollo';
  import Pusher from 'pusher-js';

  const { account, isAuthenticated } = getContext('app');
  let pusherClient = null;
  let beamClient = null;

  /**
   * Handles all realtime subscriptions to the presence channel.
   * This maintains our list of online users for chat functionality.
   */
  function handlePresenceSubscription() {
    const presence = pusherClient.subscribe('presence-mfy-chat');

    presence.bind('pusher:subscription_succeeded', function (members) {
      const ids = [];
      members.each((member) => ids.push(member.id));
      onlineUsers.set(ids);
    });

    presence.bind('pusher:member_added', function (member) {
      onlineUsers.update((ref) => [...ref, member.id]);
    });

    presence.bind('pusher:member_removed', function (member) {
      onlineUsers.update((ref) => ref.filter((id) => id !== member.id));
    });
  }

  /**
   * Handles all realtime subscriptions to our public channels.
   */
  function handlePublicSubscriptions() {
    const globalChannel = pusherClient.subscribe('metafy-global');
    // New version of Metafy available, we want to alert the user with a Toast
    // so they can cancel the refresh if wanted.
    globalChannel.bind('new_version', function (data) {
      const timerId = setTimeout(() => {
        window.location.reload();
      }, 30 * 1000);
      Toasts.push({
        kind: 'attention',
        content:
          'There is a new version of Metafy available. Your browser will refresh in 30 seconds.',
        placement: 'center',
        duration: 0,
        actions: [
          {
            content: 'Cancel',
            func: () => {
              clearTimeout(timerId);
            }
          }
        ]
      });
    });
  }

  /**
   * Handles all realtime subscriptions to the users private channel.
   */
  function handlePrivateSubscriptions() {
    // bind to the logged in users private channel
    const channel = pusherClient.subscribe(`private-user-${$account.data.session.id}`);

    // Change in account balance
    channel.bind('balance', function (data) {
      cache.modify({
        id: cache.identify($account.data.session),
        fields: {
          balanceCents() {
            return data.balance_cents;
          }
        }
      });
    });
    channel.bind('team_balance', function (data) {
      cache.modify({
        id: `Team:${data.team_id}`,
        fields: {
          balanceCents() {
            return data.balance_cents;
          }
        }
      });
    });

    // Conversations
    channel.bind('conversation', async function (data) {
      switch (data.operation) {
        case 'add':
        case 'update':
          if (data.id) {
            // Message was added but potentially the conversation needs to be handled as well
            const { data: messageResponse } = await client.query({
              query: GET_CONVERSATION_MESSAGE,
              variables: { id: data.id }
            });
            if (messageResponse?.conversationMessage) {
              // Add the convo to the cache
              cache.modify({
                fields: {
                  conversations(existing = {}, { readField }) {
                    const fragment = cache.writeFragment({
                      data: messageResponse.conversationMessage.conversation,
                      fragment: CONVERSATION_FIELDS,
                      fragmentName: 'ConversationFields'
                    });
                    return {
                      ...existing,
                      edges: [
                        { __typename: 'ConversationEdge', node: fragment },
                        ...(existing.edges || []).filter(
                          (edge) => readField('id', edge.node) !== data.conversation_id
                        )
                      ]
                    };
                  }
                }
              });
              // Add the new message to cache
              const result = cache.readQuery({
                query: GET_CONVERSATION_MESSAGES,
                variables: { id: data.conversation_id }
              });
              if (result?.conversationMessages) {
                cache.writeQuery({
                  query: GET_CONVERSATION_MESSAGES,
                  variables: { id: data.conversation_id },
                  data: {
                    conversationMessages: {
                      ...result.conversationMessages,
                      edges: [
                        {
                          node: messageResponse.conversationMessage,
                          __typename: 'ConversationMessageEdge'
                        },
                        ...result.conversationMessages.edges
                      ]
                    }
                  }
                });
              }
            }
          } else if (data.conversation_id) {
            // Conversation was added but with no message
            // TODO: This will eventually be removed when we start using system messages.
            const { data: conversationResponse } = await client.query({
              query: GET_CONVERSATION,
              variables: { id: data.conversation_id }
            });
            if (conversationResponse?.conversation) {
              cache.modify({
                fields: {
                  conversations(existing = {}) {
                    const fragment = cache.writeFragment({
                      data: conversationResponse.conversation,
                      fragment: CONVERSATION_FIELDS,
                      fragmentName: 'ConversationFields'
                    });
                    return {
                      ...existing,
                      edges: [
                        { __typename: 'ConversationEdge', node: fragment },
                        ...(existing.edges || [])
                      ]
                    };
                  }
                }
              });
            }
          }
          break;
        case 'delete':
          const result = cache.readQuery({
            query: GET_CONVERSATION_MESSAGES,
            variables: { id: data.conversation_id }
          });
          if (result.conversationMessages) {
            cache.writeQuery({
              query: GET_CONVERSATION_MESSAGES,
              variables: { id: data.conversation_id },
              data: {
                conversationMessages: {
                  ...result.conversationMessages,
                  edges: [
                    ...result.conversationMessages.edges.filter((node) => node.id !== data.id)
                  ]
                }
              }
            });
          }
          break;
        default:
          console.log('Handled unknown operation for conversation', { extra: { operation } });
      }
    });
  }

  async function initializePusherChannel() {
    try {
      // Initialize Pusher Channel (Realtime)
      if (Pusher && !pusherClient) {
        Pusher.logToConsole = process.env.NODE_ENV === 'development';
        pusherClient = new Pusher(PUSHER_CHANNEL_KEY, {
          cluster: 'us3',
          authEndpoint: `${API_URL}/pusher/auth`,
          auth: {
            headers: {
              authorization: `Bearer ${$authTokens.access_token}`
            }
          }
        });
        handlePublicSubscriptions();
        pusherChannel.set(pusherClient);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
      // It's okay! Pusher isn't required for our app to work.
    }
  }

  async function initializePusherBeam() {
    try {
      // Pusher web notifications don't support SSR import
      const PusherPushNotifications = await import('@pusher/push-notifications-web');
      if (PusherPushNotifications && !beamClient) {
        beamClient = new PusherPushNotifications.Client({
          instanceId: PUSHER_BEAM_INSTANCE
        });
        beamClient
          .start()
          .then(() => beamClient.getUserId())
          .then((userId) => {
            if (!userId) {
              beamClient.setUserId($account.data.session.id, {
                async fetchToken() {
                  return Promise.resolve({ token: $account.data.session.pusherToken });
                }
              });
            } else if (userId && userId !== $account.data.session.id) {
              beamClient.stop();
            }
          })
          .catch((error) => {
            if (process.env.NODE_ENV === 'development') {
              console.error(error);
            }
          });
        pusherBeam.set(beamClient);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
      // It's okay! Pusher isn't required for our app to work.
    }
  }

  let hasSubscribedToAuthenticatedChannels = false;
  $: if (pusherClient && isAuthenticated($account) && !hasSubscribedToAuthenticatedChannels) {
    pusherClient.config.auth.headers.authorization = `Bearer ${$authTokens.access_token}`;
    handlePresenceSubscription();
    handlePrivateSubscriptions();
    hasSubscribedToAuthenticatedChannels = true;
  }
  $: if (!beamClient && isAuthenticated($account)) {
    initializePusherBeam();
  }

  onMount(() => {
    initializePusherChannel();
    if (isAuthenticated($account)) {
      initializePusherBeam();
    }
    return () => {
      if (pusherClient) {
        pusherClient.disconnect();
      }
      if (beamClient) {
        beamClient.clearAllState();
      }
    };
  });
</script>
