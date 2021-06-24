import { gql } from '@apollo/client/core';
import { BOOKING_FIELDS } from './booking';

export const LESSON_PLAN_FIELDS = gql`
  fragment LessonPlanFields on AccountLessonPlan {
    id
    state
    expiresAt
    priceCents
    title
    description
    lessonsCompleted
    lessonCount
    canceledMessage
    canceledById
    canceledPromoCode
    student {
      id
      name
      avatar
    }
    coach {
      id
      avatar
      coachProfile {
        id
        name
        slug
        title
      }
    }
    team {
      id
    }
    lessons {
      id
      title
      description
      type
      duration
      position
      completed
      coachGame {
        id
        position
        game {
          id
          slug
          title
          poster
          artwork
        }
      }
      booking {
        ...BookingFields
      }
    }
  }
  ${BOOKING_FIELDS}
`;

export const GET_LESSON_PLANS = gql`
  query GetLessonPlans($state: [String!]!, $teamId: ID, $as: String = "all", $order: String = "asc", $after: String) {
    lessonPlans(state: $state, teamId: $teamId, as: $as, order: $order, first: 20, after: $after) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          ...LessonPlanFields
        }
      }
    }
  }
  ${LESSON_PLAN_FIELDS}
`;

export const GET_LESSON_PLAN = gql`
  query GetLessonPlan($id: ID!) {
    lessonPlan(id: $id) {
      id
      state
      expiresAt
      title
      description
      lessonCount
      lessonsCompleted
      priceCents
      student {
        id
        name
      }
      coach {
        id
        coachProfile {
          id
          name
          slug
        }
      }
      lessons {
        id
        position
        completed
        title
        description
        type
        duration
        coachGame {
          id
          position
          game {
            id
            title
            slug
            poster
            artwork
          }
        }
        booking {
          id
          state
          type
          duration
          scheduledAt
          rescheduleSubmitted
          coachQuestionAnswers
          student {
            id
            name
            timezone
            roles
            discord {
              id
              username
              discriminator
            }
          }
          coach {
            id
            timezone
            roles
            coachProfile {
              id
              name
              slug
              coachGames {
                id
                position
                game {
                  id
                  title
                  slug
                  artwork
                  poster
                }
                lessons {
                  id
                  position
                  title
                  type
                  featured
                  duration
                  baseRateCents
                  game {
                    id
                    title
                    slug
                    poster
                    artwork
                  }
                }
              }
              coachAvailability {
                id
                afkMode
              }
            }
          }
          transaction {
            id
            status
            source
            totalCents
            createdAt
          }
          game {
            id
            title
            slug
            poster
            artwork
          }
          lessonPlan {
            id
            title
            lessons {
              id
              title
              booking {
                id
              }
            }
          }
        }
      }
    }
  }
`;
