import { gql } from '@apollo/client/core';
import { BOOKING_FIELDS } from './booking';
import { LESSON_PLAN_FIELDS } from './lesson';
import { TRANSACTION_FIELDS } from './wallet';

export const GET_DASHBOARD = gql`
  query GetDashboard(
    $liveStates: [String!] = ["pending", "upcoming", "completed", "canceled"]
    $as: String = "all"
    $teamId: ID
  ) {
    pendingBookings: bookings(first: 5, type: "live", state: ["pending"], teamId: $teamId, as: $as) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...BookingFields
        }
      }
    }
    pendingLessonPlans: lessonPlans(first: 5, state: ["pending"], teamId: $teamId, as: $as) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...LessonPlanFields
        }
      }
    }

    liveBookings: bookings(first: 3, type: "live", state: $liveStates, teamId: $teamId, as: $as) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...BookingFields
        }
      }
    }
    liveLessonPlans: lessonPlans(first: 3, state: $liveStates, teamId: $teamId, as: $as) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...LessonPlanFields
        }
      }
    }

    transactions(first: 5) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...TransactionFields
        }
      }
    }
  }
  ${BOOKING_FIELDS}
  ${LESSON_PLAN_FIELDS}
  ${TRANSACTION_FIELDS}
`;
