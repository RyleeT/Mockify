import { gql } from '@apollo/client/core';
import { COACH_LESSON_PLAN_FIELDS, COACH_LESSON_FIELDS } from '../queries';

export const ADD_COACH_LESSON_PLAN = gql`
  mutation AddCoachLessonPlan($coachLessonPlan: AddCoachLessonPlan!) {
    addCoachLessonPlan(coachLessonPlan: $coachLessonPlan) {
      status
      coachLessonPlan {
        ...CoachLessonPlanFields
      }
    }
  }
  ${COACH_LESSON_PLAN_FIELDS}
`;

export const REMOVE_COACH_LESSON_PLAN = gql`
  mutation RemoveCoachLessonPlan($id: ID!) {
    removeCoachLessonPlan(id: $id) {
      status
    }
  }
`;

export const EDIT_COACH_LESSON_PLAN = gql`
  mutation EditCoachLessonPlan($id: ID!, $coachLessonPlan: EditCoachLessonPlan!) {
    editCoachLessonPlan(id: $id, coachLessonPlan: $coachLessonPlan) {
      status
      coachLessonPlan {
        ...CoachLessonPlanFields
      }
    }
  }
  ${COACH_LESSON_PLAN_FIELDS}
`;

export const ADD_COACH_LESSON = gql`
  mutation AddCoachLesson($coachLesson: AddCoachLesson!) {
    addCoachLesson(coachLesson: $coachLesson) {
      status
      coachLesson {
        coachGame {
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
        ...CoachLessonFields
      }
    }
  }
  ${COACH_LESSON_FIELDS}
`;

export const ADD_COACH_LESSON_TO_PLAN = gql`
  mutation AddCoachLessonToPlan($coachLessonPlanId: ID!, $coachLesson: AddCoachLesson!) {
    addCoachLesson(coachLessonPlanId: $coachLessonPlanId, coachLesson: $coachLesson) {
      status
      coachLesson {
        ...CoachLessonFields
      }
    }
  }
  ${COACH_LESSON_FIELDS}
`;

export const EDIT_COACH_LESSON = gql`
  mutation EditCoachLesson($coachLessonId: ID!, $coachLesson: EditCoachLesson!) {
    editCoachLesson(coachLessonId: $coachLessonId, coachLesson: $coachLesson) {
      status
      coachLesson {
        ...CoachLessonFields
      }
    }
  }
  ${COACH_LESSON_FIELDS}
`;

export const EDIT_COACH_LESSON_IN_PLAN = gql`
  mutation EditCoachLesson($coachLessonPlanId: ID!, $coachLessonId: ID!, $coachLesson: EditCoachLesson!) {
    editCoachLesson(coachLessonPlanId: $coachLessonPlanId, coachLessonId: $coachLessonId, coachLesson: $coachLesson) {
      status
      coachLesson {
        ...CoachLessonFields
      }
    }
  }
  ${COACH_LESSON_FIELDS}
`;

export const REMOVE_COACH_LESSON = gql`
  mutation RemoveCoachLesson($id: ID!) {
    removeCoachLesson(id: $id) {
      status
    }
  }
`;
