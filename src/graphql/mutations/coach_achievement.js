import { gql } from '@apollo/client/core';

export const COACH_ACHIEVEMENT_MUTATION_FIELDS = gql`
  fragment CoachAchievementFields on CoachAchievement {
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
`;

export const ADD_COACH_ACHIEVEMENT = gql`
  mutation AddCoachAchievement($coachAchievement: AddCoachAchievement!) {
    addCoachAchievement(coachAchievement: $coachAchievement) {
      status
      coachAchievement {
        ...CoachAchievementFields
      }
    }
  }
  ${COACH_ACHIEVEMENT_MUTATION_FIELDS}
`;

export const EDIT_COACH_ACHIEVEMENT = gql`
  mutation EditCoachAchievement($id: ID!, $coachAchievement: EditCoachAchievement!) {
    editCoachAchievement(id: $id, coachAchievement: $coachAchievement) {
      status
      coachAchievement {
        ...CoachAchievementFields
      }
    }
  }
  ${COACH_ACHIEVEMENT_MUTATION_FIELDS}
`;

export const REMOVE_COACH_ACHIEVEMENT = gql`
  mutation RemoveCoachAchievement($id: ID!) {
    removeCoachAchievement(id: $id) {
      status
    }
  }
`;
