import { gql } from '@apollo/client/core';
import { GIFT_CARD_FIELDS } from '../queries/gift_card';
import { TRANSACTION_FIELDS } from '../queries/wallet';

export const ADD_GIFT_CARD = gql`
  mutation AddGiftCard($chargeId: ID!, $giftCard: AddGiftCard!) {
    addGiftCard(chargeId: $chargeId, giftCard: $giftCard) {
      status
      giftCard {
        ...GiftCardFields
      }
      transaction {
        ...TransactionFields
      }
    }
  }
  ${GIFT_CARD_FIELDS}
  ${TRANSACTION_FIELDS}
`;

export const REDEEM_GIFT_CARD = gql`
  mutation RedeemGiftCard($id: ID!) {
    redeemGiftCard(id: $id) {
      status
      transaction {
        ...TransactionFields
      }
    }
  }
  ${TRANSACTION_FIELDS}
`;
