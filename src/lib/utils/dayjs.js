import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';

import { dev } from '$app/env';
import { Toasts } from '../stores/index.js';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(calendar);

const originaltz = dayjs.tz;
dayjs.tz = function () {
  try {
    return originaltz(...arguments);
  } catch (error) {
    if (dev) {
      console.error(error);
    }
    Toasts.push({
      duration: 0,
      kind: 'error',
      content: 'Your time zone is considered invalid by your web browser.'
    });
    return dayjs();
  }
};
Object.keys(originaltz).forEach((key) => {
  dayjs.tz[key] = originaltz[key];
});

export { dayjs };
