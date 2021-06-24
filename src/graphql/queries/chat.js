import { gql } from '@apollo/client/core';

export const PARTICIPANT_COACH_FIELDS = gql`
  fragment ParticipantCoachFields on CoachProfile {
    id
    name
    slug
    title
    coachAvailability {
      id
      afkMode
    }
    coachGames {
      id
      game {
        id
        slug
        title
        poster
      }
      lessons {
        baseRateCents
      }
    }
  }
`;

export const PARTICIPANT_FIELDS = gql`
  fragment ParticipantFields on Account {
    id
    name
    avatar
    roles
    coachProfile {
      ...ParticipantCoachFields
    }
  }
  ${PARTICIPANT_COACH_FIELDS}
`;

export const CONVERSATION_FIELDS = gql`
  fragment ConversationFields on Conversation {
    id
    participants {
      ...ParticipantFields
    }
    unreadMessageCount
    latestMessage {
      id
      delta
      createdAt
      isSystem
      sender {
        id
      }
    }
  }
  ${PARTICIPANT_FIELDS}
`;

export const CONVERSATION_MESSAGE_FIELDS = gql`
  fragment ConversationMessageFields on ConversationMessage {
    id
    seen
    createdAt
    editedAt
    delta
    isSystem
    reported
    sender {
      id
      avatar
      name
      roles
    }
  }
`;

export const GET_CHAT_PARTICIPANT = gql`
  query GetChatParticipant($id: ID!) {
    account(id: $id) {
      ...ParticipantFields
    }
  }
  ${PARTICIPANT_FIELDS}
`;

export const GET_CONVERSATIONS = gql`
  query GetConversations($after: String) {
    conversations(first: 20, after: $after) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          ...ConversationFields
        }
      }
    }
  }
  ${CONVERSATION_FIELDS}
`;

export const GET_CONVERSATION = gql`
  query GetConversation($otherId: ID, $id: ID) {
    conversation(otherId: $otherId, id: $id) {
      ...ConversationFields
    }
  }
  ${CONVERSATION_FIELDS}
`;

export const GET_CONVERSATION_MESSAGES = gql`
  query GetConversationMessages($id: ID, $after: String) {
    conversationMessages(id: $id, first: 20, after: $after) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          ...ConversationMessageFields
        }
      }
    }
  }
  ${CONVERSATION_MESSAGE_FIELDS}
`;

export const GET_CONVERSATION_MESSAGE = gql`
  query GetConversationMessage($id: ID) {
    conversationMessage(id: $id) {
      ...ConversationMessageFields
      conversation {
        ...ConversationFields
      }
    }
  }
  ${CONVERSATION_FIELDS}
  ${CONVERSATION_MESSAGE_FIELDS}
`;
