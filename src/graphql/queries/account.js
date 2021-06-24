import { gql } from '@apollo/client/core';
import { COACH_LESSON_PLAN_FIELDS, COACH_LESSON_FIELDS } from './coach_profile.js';

export const GET_SESSION_RAW = `
  query GetSession {
    session {
      id
      email
      name
      password
      roles
      timezone
      pusherToken
      intercomToken
      avatar
      balanceCents
      calendarCount
      teamCount
      languages
      totalPaidOut
      percentByRevenue
      pendingPayoutRequestsCents
      bookingCountAsStudent
      bookingCountAsCoach
      createdAt
      coachProfile {
        id
        slug
        name
        title
        cover
        bio
        summary
        achievementCount
        gameCount
        questionCount
        faqCount
        __typename
        coachAvailability {
          id
          hasAvailability
          __typename
        }
      }
      teamMemberships {
        id
        role
        team {
          id
          name
          memberCount
          balanceCents
          memberships {
            id
            account {
              id
              name
              avatar
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      discord {
        id
        __typename
      }
      twitch {
        id
        hasSubButton
        __typename
      }
      paypal {
        id
        __typename
      }
      __typename
    }
  }
`;

export const GET_SESSION = gql`
  ${GET_SESSION_RAW}
`;

export const GET_PAYPAL = gql`
  query GetPayPal {
    session {
      id
      paypal {
        id
        email
        createdAt
      }
    }
  }
`;

export const GET_STUDENTS = gql`
  query GetStudents($first: Int = 5, $after: String) {
    students(first: $first, after: $after) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          name
          avatar
          roles
          coachProfile {
            id
            slug
            name
            title
            coachAvailability {
              id
              afkMode
            }
            coachGames {
              id
              game {
                id
                slug
                title
                poster
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
      }
    }
  }
  ${COACH_LESSON_FIELDS}
`;

export const GET_COACHES = gql`
  query GetCoaches($teamId: ID, $first: Int = 5, $after: String) {
    coaches(teamId: $teamId, first: $first, after: $after) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
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
              game {
                id
                slug
                title
                poster
              }
            }
          }
        }
      }
    }
  }
`;

export const PACK_FIELDS = gql`
  fragment PackFields on AccountPackage {
    id
    total
    remaining
    redeemedCount
    lesson {
      ...CoachLessonFields
      coachGame {
        id
        account {
          id
          avatar
          name
          coachProfile {
            id
            name
            slug
          }
        }
        game {
          id
          slug
          poster
          title
        }
      }
    }
    team {
      id
      name
    }
  }
  ${COACH_LESSON_FIELDS}
`;

export const GET_PACKS = gql`
  query GetPacks($teamId: ID) {
    accountPackages(teamId: $teamId) {
      ...PackFields
    }
  }
  ${PACK_FIELDS}
`;

export const GET_PACK = gql`
  query GetPack($coachLessonId: ID!, $teamId: ID) {
    accountPackage(coachLessonId: $coachLessonId, teamId: $teamId) {
      ...PackFields
    }
  }
  ${PACK_FIELDS}
`;

export const GET_RECENT_COACHES = gql`
  query GetRecentCoaches {
    recentCoaches {
      id
      avatar
      coachProfile {
        id
        name
        slug
        title
        cover
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
    }
  }
`;
