import { gql } from '@apollo/client/core';
import { CONVERSATION_FIELDS, CONVERSATION_MESSAGE_FIELDS } from '../queries/chat';

export const ADD_CONVERSATION_MESSAGE = gql`
  mutation AddConversationMessage($otherId: ID!, $message: AddConversationMessage!) {
    addConversationMessage(otherId: $otherId, message: $message) {
      status
      conversation {
        ...ConversationFields
      }
      conversationMessage {
        ...ConversationMessageFields
      }
    }
  }
  ${CONVERSATION_FIELDS}
  ${CONVERSATION_MESSAGE_FIELDS}
`;

export const EDIT_CONVERSATION_MESSAGE = gql`
  mutation EditConversationMessage($id: ID!, $message: EditConversationMessage!) {
    editConversationMessage(id: $id, message: $message) {
      status
      conversationMessage {
        ...ConversationMessageFields
      }
    }
  }
  ${CONVERSATION_MESSAGE_FIELDS}
`;

export const REMOVE_CONVERSATION_MESSAGE = gql`
  mutation RemoveConversationMessage($id: ID!) {
    removeConversationMessage(id: $id) {
      status
    }
  }
`;

export const MARK_CONVERSATION_SEEN = gql`
  mutation MarkConversationSeen($conversationId: ID!) {
    markConversationSeen(conversationId: $conversationId) {
      status
      conversation {
        id
        unreadMessageCount
      }
    }
  }
`;
