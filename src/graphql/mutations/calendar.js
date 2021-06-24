import { gql } from '@apollo/client/core';

export const EDIT_CALENDAR = gql`
  mutation EditCalendar($id: ID!, $calendar: EditCalendar!) {
    editCalendar(id: $id, calendar: $calendar) {
      status
      calendar {
        id
        email
        isCalendarLinked
        calendarAdd
        calendarConflicts
      }
    }
  }
`;
