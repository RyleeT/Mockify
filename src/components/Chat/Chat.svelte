<script>
  import { getContext } from 'svelte';
  import { Toasts, chatState } from '@metafy/lib/stores';
  import { client } from '@metafy/lib/apollo';
  import { GET_CONVERSATION, GET_CHAT_PARTICIPANT } from '@metafy/graphql/queries';

  // import Hub from './Hub.svelte';
  import Conversation from './Conversation.svelte';

  // const { account } = getContext('app');
  let isLoadingConversation = false;

  // Make sure `participants.myself` always exists.
  // On the other hand, `participants.partner` only exists if there is an open conversation
  // $chatState.participants.myself = $account.data.session;

  //   export async function createConversation(detail) {
  //     isLoadingConversation = true;
  //     $chatState.conversation = {};
  //     try {
  //       const { data } = await client.query({
  //         query: GET_CONVERSATION,
  //         variables: { otherId: detail.id }
  //       });
  //       // Previous conversation exists
  //       if (data?.conversation) {
  //         $chatState.participants.partner = data.conversation.participants.find(
  //           (p) => p.id !== $chatState.participants.myself.id
  //         );
  //         $chatState.conversation = data.conversation;
  //       } else {
  //         // Converation doesn't exist so query relevant info for the target user
  //         const { data: accountData } = await client.query({
  //           query: GET_CHAT_PARTICIPANT,
  //           variables: { id: detail.id }
  //         });
  //         if (accountData?.account) {
  //           $chatState.participants.partner = accountData.account;
  //         } else {
  //           $chatState.conversation = null;
  //           $chatState.participants.partner = null;
  //         }
  //       }
  //     } catch (error) {
  //       $chatState.conversation = null;
  //       $chatState.participants.partner = null;
  //       console.error(error);
  //     } finally {
  //       isLoadingConversation = false;
  //     }
  //   }
</script>

<!-- <Hub
  on:select={({ detail }) => {
    $chatState.participants.partner = detail.participants.find(
      (p) => p.id !== $chatState.participants.myself.id
    );
    $chatState.conversation = detail;
  }}
  on:create={({ detail }) => createConversation(detail)}
/>

<Conversation
  conversation={$chatState.conversation}
  isLoading={isLoadingConversation}
  on:close={() => {
    $chatState.conversation = null;
    $chatState.participants.partner = null;
  }}
/> -->
