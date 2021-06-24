import { gql } from '@apollo/client/core';

export const COACH_LESSON_FIELDS = gql`
  fragment CoachLessonFields on CoachPurchasableUnit {
    id
    position
    title
    disabled
    type
    description
    duration
    amount
    baseRateCents
    bundles
    coachGame {
      id
    }
    game {
      id
      category
      slug
      title
      poster
      artwork
    }
  }
`;

export const COACH_LESSON_PLAN_FIELDS = gql`
  fragment CoachLessonPlanFields on CoachLessonPlan {
    id
    title
    priceCents
    position
    disabled
    description
    cover
    lessons {
      ...CoachLessonFields
    }
  }
  ${COACH_LESSON_FIELDS}
`;

export const COACH_PROFILE_FRAGMENT = gql`
  fragment CoachProfileFields on CoachProfile {
    id
    name
    slug
    bio
    summary
    socialAccounts
    title
    seoTitle
    cover
    gameCount
    twitchDiscountEnabled
    twitchDiscountPercent
    isTwitchSub
    lessonPlans {
      ...CoachLessonPlanFields
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
    coachAchievements {
      id
      type
      achievement
      tournamentTitle
      placement
      year
      position
      game {
        id
        slug
        title
        poster
      }
    }
    coachFaqs {
      id
      question
      answer
      position
    }
    coachAvailability {
      id
      afkMode
      hasAvailability
      maxDuration
    }
    account {
      id
      avatar
      languages
      disabled
      redirectUrl
      discord {
        id
      }
      twitch {
        id
        username
      }
    }
  }
  ${COACH_LESSON_PLAN_FIELDS}
  ${COACH_LESSON_FIELDS}
`;

export const GET_COACH_PROFILE = gql`
  query GetCoachProfile($slug: String!) {
    coachProfile(slug: $slug) {
      ...CoachProfileFields
    }
  }
  ${COACH_PROFILE_FRAGMENT}
`;

export const GET_AVAILABILITY = gql`
  query GetAvailability($id: ID!, $duration: Int = 1) {
    availability(id: $id, duration: $duration)
  }
`;

export const GET_COACH_QUESTIONS = gql`
  query GetCoachQuestions($coachId: ID!, $coachGameId: ID!) {
    coachQuestions(coachId: $coachId, coachGameId: $coachGameId) {
      id
      type
      question
    }
  }
`;
