import { gql } from '@apollo/client/core';

export const ADD_COACH_QUESTION = gql`
  mutation AddCoachQuestion($coachQuestion: AddCoachQuestion!) {
    addCoachQuestion(coachQuestion: $coachQuestion) {
      status
      coachQuestion {
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
`;

export const EDIT_COACH_QUESTION = gql`
  mutation EditCoachQuestion($id: ID!, $coachQuestion: EditCoachQuestion!) {
    editCoachQuestion(id: $id, coachQuestion: $coachQuestion) {
      status
      coachQuestion {
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
`;

export const REMOVE_COACH_QUESTION = gql`
  mutation RemoveCoachQuestion($id: ID!) {
    removeCoachQuestion(id: $id) {
      status
    }
  }
`;
