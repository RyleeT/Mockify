import { gql } from '@apollo/client/core';

export const GIFT_CARD_FIELDS = gql`
  fragment GiftCardFields on GiftCard {
    id
    gifterName
    recipientEmail
    recipientName
    title
    message
    valueCents
    sendDate
    redeemed
    style
  }
`;

export const GET_GIFT_CARD = gql`
  query GetGiftCard($id: ID!) {
    giftCard(id: $id) {
      ...GiftCardFields
    }
  }
  ${GIFT_CARD_FIELDS}
`;
