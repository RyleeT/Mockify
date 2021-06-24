import { gql } from '@apollo/client/core';
import { GET_GIFT_CARD, GIFT_CARD_FIELDS } from './gift_card';

export const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on Transaction {
    id
    source
    status
    totalCents
    createdAt
  }
`;

export const GET_TRANSACTION_HISTORY = gql`
  query GetTransactionHistory($after: String) {
    transactions(first: 10, after: $after) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          ...TransactionFields
        }
      }
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const GET_WALLET = gql`
  query GetWallet($id: ID!, $after: String) {
    transactions(first: 10, after: $after) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          ...TransactionFields
        }
      }
    }
    giftCard(id: $id) {
      ...GiftCardFields
    }
  }
  ${TRANSACTION_FIELDS}
  ${GIFT_CARD_FIELDS}
`;
