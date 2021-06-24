import { gql } from '@apollo/client/core';
import { TRANSACTION_FIELDS, PACK_FIELDS } from '../queries';
import { LESSON_PLAN_FIELDS } from '../queries/lesson';

export const EDIT_ACCOUNT = gql`
  mutation EditAccount($account: EditAccount!) {
    editAccount(account: $account) {
      status
      account {
        id
        name
        fullName
        email
        password
        timezone
        emailSettings
        pushSettings
        discordSettings
        avatar
        languages
      }
    }
  }
`;

export const ADD_METAFY_CREDIT = gql`
  mutation AddMetafyCredit($chargeId: ID!, $teamId: ID) {
    addMetafyCredit(chargeId: $chargeId, teamId: $teamId) {
      status
      amount
      transaction {
        ...TransactionFields
      }
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const ADD_ACCOUNT_PACKAGE = gql`
  mutation AddAccountPackage($package: AddAccountPackage!, $teamId: ID) {
    addAccountPackage(package: $package, teamId: $teamId) {
      status
      package {
        ...PackFields
      }
      transaction {
        ...TransactionFields
      }
    }
  }
  ${TRANSACTION_FIELDS}
  ${PACK_FIELDS}
`;

export const ADD_PAYOUT_REQUEST = gql`
  mutation AddPayoutRequest($amount: Int!) {
    addPayoutRequest(amount: $amount) {
      status
      payoutRequest {
        id
        requestedAmountCents
      }
      transaction {
        ...TransactionFields
      }
    }
  }
  ${TRANSACTION_FIELDS}
`;

// export const ADD_LESSON_PLAN = gql`
//   mutation AddLessonPlan($coachLessonId: ID!, $studentId: ID, $teamId: ID) {
//     addLessonPlan(coachLessonId: $coachLessonId, studentId: $studentId, teamId: $teamId) {
//       status
//       lessonPlan {
//         ...LessonPlanFields
//       }
//     }
//   }
//   ${LESSON_PLAN_FIELDS}
// `;

export const EDIT_LESSON_PLAN = gql`
  mutation EditLessonPlan($lessonPlanId: ID!, $lessonPlan: EditLessonPlan!) {
    editLessonPlan(lessonPlanId: $lessonPlanId, lessonPlan: $lessonPlan) {
      status
      lessonPlan {
        ...LessonPlanFields
      }
    }
  }
  ${LESSON_PLAN_FIELDS}
`;
