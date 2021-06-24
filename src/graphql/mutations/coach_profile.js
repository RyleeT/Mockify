import { gql } from '@apollo/client/core';

export const EDIT_COACH_PROFILE = gql`
  mutation EditCoachProfile($coachProfile: EditCoachProfile!) {
    editCoachProfile(coachProfile: $coachProfile) {
      status
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
