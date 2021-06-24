import { gql } from '@apollo/client/core';
import { BOOKING_FIELDS, TRANSACTION_FIELDS } from '../queries';

export const ADD_BOOKING = gql`
  mutation AddBooking($studentId: ID, $teamId: ID, $lessonModuleId: ID, $booking: AddBooking!) {
    addBooking(studentId: $studentId, teamId: $teamId, lessonModuleId: $lessonModuleId, booking: $booking) {
      status
      booking {
        ...BookingFields
      }
      transaction {
        ...TransactionFields
      }
    }
  }
  ${BOOKING_FIELDS}
  ${TRANSACTION_FIELDS}
`;

export const EDIT_BOOKING = gql`
  mutation EditBooking($bookingId: ID!, $booking: EditBooking!) {
    editBooking(bookingId: $bookingId, booking: $booking) {
      status
      booking {
        ...BookingFields
      }
    }
  }
  ${BOOKING_FIELDS}
`;
