import { gql } from '@apollo/client/core';
import { TRANSACTION_FIELDS } from '../queries';

export const REDEEM_PURCHASE = gql`
  mutation RedeemPurchase($purchase: RedeemPurchase!) {
    redeemPurchase(purchase: $purchase) {
      status
      transaction {
        ...TransactionFields
      }
      lessonPlan {
        id
      }
      bookings {
        id
      }
      # package {
      #   ...
      # }
    }
  }
  ${TRANSACTION_FIELDS}
`;
