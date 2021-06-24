import { gql } from '@apollo/client/core';
import { COACH_LESSON_PLAN_FIELDS, COACH_LESSON_FIELDS } from './coach_profile';

export const GET_NOTIFICATION_SETTINGS = gql`
  query GetNotificationSettings {
    session {
      id
      emailSettings
      pushSettings
      discordSettings
      discord {
        id
      }
    }
  }
`;

export const GET_CONNECTED_ACCOUNTS = gql`
  query GetConnectedAccounts {
    session {
      id
      discord {
        id
        username
        discriminator
      }
      twitch {
        id
        username
        permissionSync
      }
      apple {
        id
      }
      googles {
        id
        email
        isCalendarLinked
        calendarAdd
        calendarConflicts
      }
    }
  }
`;

export const GET_GENERAL_SETTINGS = gql`
  query GetGeneralSettings {
    session {
      id
      avatar
      fullName
      name
      email
      timezone
      languages
    }
  }
`;

export const GET_SECURITY_SETTINGS = gql`
  query GetSecuritySettings {
    session {
      id
      password
    }
  }
`;

export const GET_COACH_ABOUT_SETTINGS = gql`
  query GetCoachAboutSettings {
    session {
      id
      coachProfile {
        id
        name
        title
        summary
        bio
        cover
        socialAccounts
      }
    }
  }
`;

export const GET_COACH_FAQ_SETTINGS = gql`
  query GetCoachFaqSettings {
    session {
      id
      coachProfile {
        id
        coachFaqs {
          id
          question
          answer
          position
        }
      }
    }
  }
`;

export const GET_COACH_ACHIEVEMENT_SETTINGS = gql`
  query GetCoachAchievementSettings {
    session {
      id
      coachProfile {
        id
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
      }
    }
  }
`;

export const GET_COACH_AVAILABILITY_SETTINGS = gql`
  query GetCoachAvailabilitySettings {
    session {
      id
      googles {
        id
        email
        isCalendarLinked
        calendarAdd
        calendarConflicts
      }
      coachProfile {
        id
        coachGames {
          id
          lessons {
            id
            duration
          }
        }
        coachAvailability {
          id
          afkMode
          afkModeEndDate
          maxDuration
          availability
          bookingNotice
        }
      }
    }
  }
`;

export const GET_COACH_GAME_SETTINGS = gql`
  query GetCoachGameSettings {
    session {
      id
      twitch {
        id
        permissionSync
      }
      coachProfile {
        id
        twitchDiscountEnabled
        twitchDiscountPercent
        coachGames {
          id
          position
          game {
            id
            artwork
            category
            slug
            title
            poster
          }
          lessons {
            ...CoachLessonFields
          }
        }
        coachQuestions {
          id
          question
          type
          coachGames {
            id
            game {
              id
              slug
              poster
              title
            }
          }
        }
      }
    }
  }
  ${COACH_LESSON_FIELDS}
`;

export const GET_COACH_LESSON_PLAN_SETTINGS = gql`
  query GetCoachPlanSettings {
    session {
      id
      coachProfile {
        id
        gameCount
        coachAvailability {
          id
          maxDuration
        }
        lessonPlans {
          ...CoachLessonPlanFields
        }
      }
    }
  }
  ${COACH_LESSON_PLAN_FIELDS}
`;
