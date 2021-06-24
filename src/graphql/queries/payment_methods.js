import { gql } from '@apollo/client/core';

export const PAYMENT_METHOD_FIELDS = gql`
  fragment PaymentMethodFields on CreditCard {
    id
    brand
    last4
    expMonth
    expYear
    isPrimary
  }
`;

export const GET_SAVED_PAYMENT_METHODS = gql`
  query GetSavedPaymentMethods {
    savedPaymentMethods {
      ...PaymentMethodFields
    }
  }
  ${PAYMENT_METHOD_FIELDS}
`;
