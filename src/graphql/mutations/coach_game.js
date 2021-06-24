import { gql } from '@apollo/client/core';

export const EDIT_COACH_GAME = gql`
  mutation EditCoachGame($id: ID!, $coachGame: EditCoachGame!) {
    editCoachGame(id: $id, coachGame: $coachGame) {
      status
      coachGame {
        id
        position
      }
    }
  }
`;
