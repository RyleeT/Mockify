import { gql } from '@apollo/client/core';
import { COACH_LESSON_FIELDS } from './coach_profile';
import { TRANSACTION_FIELDS } from './wallet';

export const BOOKING_FIELDS = gql`
  fragment BookingFields on Booking {
    id
    scheduledAt
    expiresAt
    rescheduleSubmitted
    rescheduledMessage
    canceledMessage
    canceledById
    canceledPromoCode
    state
    type
    duration
    coachQuestionAnswers
    student {
      id
      name
      timezone
      avatar
      roles
      coachProfile {
        id
        name
        slug
        title
        coachAvailability {
          id
          afkMode
        }
        coachGames {
          id
          position
          game {
            id
            slug
            artwork
            poster
            cutout
            category
            title
          }
          lessons {
            ...CoachLessonFields
          }
        }
      }
      discord {
        id
        username
        discriminator
      }
    }
    coach {
      id
      timezone
      avatar
      roles
      coachProfile {
        id
        name
        slug
        title
        coachAvailability {
          id
          afkMode
        }
        coachGames {
          id
          position
          game {
            id
            slug
            artwork
            poster
            cutout
            category
            title
          }
          lessons {
            ...CoachLessonFields
          }
        }
      }
      discord {
        id
        username
        discriminator
      }
    }
    transaction {
      ...TransactionFields
    }
    game {
      id
      slug
      title
      poster
      artwork
    }
    team {
      id
      name
    }
    lesson {
      ...CoachLessonFields
    }
    lessonPlan {
      id
      title
      lessonCount
      lessons {
        id
        title
        booking {
          id
        }
      }
    }
  }
  ${TRANSACTION_FIELDS}
  ${COACH_LESSON_FIELDS}
`;

export const GET_RESCHEDULE_INFO = gql`
  query GetRescheduleInfo($id: ID!, $slug: String!) {
    coachProfile(slug: $slug) {
      id
      name
      slug
      title
      cover
      account {
        id
        avatar
        disabled
        redirectUrl
      }
      coachAvailability {
        id
        maxDuration
      }
      coachGames {
        id
        game {
          id
          slug
          title
          poster
        }
      }
    }
    booking(id: $id) {
      ...BookingFields
      coachGame {
        id
      }
    }
  }
  ${BOOKING_FIELDS}
`;

export const GET_BOOKING = gql`
  query GetBooking($id: ID!) {
    booking(id: $id) {
      ...BookingFields
    }
  }
  ${BOOKING_FIELDS}
`;

export const GET_BOOKINGS = gql`
  query GetBookings(
    $state: [String!]!
    $type: String!
    $teamId: ID
    $as: String = "all"
    $order: String = "asc"
    $after: String
  ) {
    bookings(state: $state, type: $type, teamId: $teamId, first: 20, as: $as, order: $order, after: $after) {
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
  }
  ${BOOKING_FIELDS}
`;
