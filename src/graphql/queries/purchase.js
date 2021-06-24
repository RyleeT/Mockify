import { gql } from '@apollo/client/core';

export const GET_PURCHASE_PRICE = gql`
  query GetPurchasePrice($purchase: PriceAttributes!) {
    purchasePrice(purchase: $purchase) {
      subTotalCents
      promoDiscountCents
      twitchDiscountCents
      twitchDiscountPercent
      bulkDiscountCents
      feeCents
      creditsUsedCents
      totalCents
    }
  }
`;
