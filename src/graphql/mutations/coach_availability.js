import { gql } from '@apollo/client/core';

export const EDIT_COACH_AVAILABILITY = gql`
  mutation EditCoachAvailability($coachAvailability: EditCoachAvailability!) {
    editCoachAvailability(coachAvailability: $coachAvailability) {
      status
      coachAvailability {
        id
        afkMode
        afkModeEndDate
        maxDuration
        availability
        hasAvailability
        bookingNotice
      }
    }
  }
`;
