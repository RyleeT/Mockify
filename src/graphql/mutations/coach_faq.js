import { gql } from '@apollo/client/core';

export const ADD_COACH_FAQ = gql`
  mutation AddCoachFaq($coachFaq: AddCoachFaq!) {
    addCoachFaq(coachFaq: $coachFaq) {
      status
      coachFaq {
        id
        question
        answer
        position
      }
    }
  }
`;

export const EDIT_COACH_FAQ = gql`
  mutation EditCoachFaq($id: ID!, $coachFaq: EditCoachFaq!) {
    editCoachFaq(id: $id, coachFaq: $coachFaq) {
      status
      coachFaq {
        id
        question
        answer
        position
      }
    }
  }
`;

export const REMOVE_COACH_FAQ = gql`
  mutation RemoveCoachFaq($id: ID!) {
    removeCoachFaq(id: $id) {
      status
    }
  }
`;
