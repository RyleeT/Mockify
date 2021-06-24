import { gql } from '@apollo/client/core';
import { PAYMENT_METHOD_FIELDS } from '../queries';

export const ADD_PAYMENT_METHOD = gql`
  mutation AddPaymentMethod($paymentMethodId: String!) {
    addPaymentMethod(paymentMethodId: $paymentMethodId) {
      status
      paymentMethod {
        ...PaymentMethodFields
      }
    }
  }
  ${PAYMENT_METHOD_FIELDS}
`;

export const REMOVE_PAYMENT_METHOD = gql`
  mutation RemovePaymentMethod($paymentMethodId: String!) {
    removePaymentMethod(paymentMethodId: $paymentMethodId) {
      status
    }
  }
`;

export const SET_PRIMARY_PAYMENT_METHOD = gql`
  mutation SetPrimaryPaymentMethod($paymentMethodId: String!) {
    setPrimaryPaymentMethod(paymentMethodId: $paymentMethodId) {
      status
      paymentMethod {
        ...PaymentMethodFields
      }
    }
  }
  ${PAYMENT_METHOD_FIELDS}
`;
