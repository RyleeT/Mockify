import { browser } from '$app/env';
import { uniqueBy } from './array';
import { STATIC_URL } from '../constants';
import { dayjs } from './dayjs';

/**
 * @returns {string} UUIDv4
 */
export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * @param {string} time - ISO8601 Time String
 * @returns {string} Formatted time, like "2:00 pm" or "7:35 am"
 */
export function formatTime(time, timezone = 'UTC') {
  const datetime = dayjs(time).tz(timezone);
  return formatTimeDatetime(datetime);
}

/**
 * @param {DateTime} datetime - dayjs DateTime object
 * @returns {string} Formatted time, like "2:00 pm" or "7:35 am"
 */
export function formatTimeDatetime(datetime) {
  return datetime.format('h:mm a');
}

/**
 * @param {number} duration
 * @returns {string} Formatted video duration
 */
export function formatVideoDuration(duration) {
  // Examples: "5:02", "47:34", "3:35:29"
  const durationObj = dayjs.duration(duration, 'seconds');
  return durationObj.format(durationObj.hours() > 1 ? 'H:mm:ss' : 'm:ss');
}

/**
 * @param {string} date - ISO8601 Time String
 * @param {*} timezone
 * @returns {string} Formatted date
 */
export function formatDate(date, timezone = 'UTC') {
  let dateTimeFormatted = '';
  const datetime = dayjs(date).tz(timezone);
  const diff = datetime.diff(dayjs().tz(timezone), 'day');
  // Date is either in the distant future, or in the past
  if (diff > 1 || diff < 0) {
    dateTimeFormatted += datetime.format('MMM DD');
    dateTimeFormatted + ' at ' + formatTime(date, timezone);
  } else {
    dateTimeFormatted = datetime.calendar();
  }
  return dateTimeFormatted;
}

/**
 * @param {string} date - ISO8601 Time String
 * @param {number} duration
 * @param {string} timezone
 * @returns {string} Formatted date - `Apr 30, 3:00 pm - 4:00 pm`
 */
export function formatDateWithRange(date, duration, timezone = 'UTC') {
  const datetime = dayjs(date).tz(timezone);
  return `${datetime.format('MMM D')}, ${formatTimeDatetime(
    datetime
  )} - ${formatTimeDatetime(datetime.add(duration, 'minutes'))}`;
}

/**
 * @param {number} month
 * @param {number} year
 * @returns {string} Formatted expiry of MM/YY
 */
export function formatCardExpiration(month, year) {
  return `${new String(month).padStart(2, '0')}/${new String(year).slice(2)}`;
}

/**
 * @param {number} duration - Duration in minutes
 * @returns {string} Human readable version of minutes
 */
export function humanizeDuration(duration) {
  switch (duration) {
    case 30:
      return '30 min';
    case 60:
      return '1 hour';
    case 90:
      return '1.5 hours';
    case 120:
      return '2 hours';
    case 150:
      return '2.5 hours';
    case 180:
      return '3 hours';
    case 210:
      return '3.5 hours';
    case 240:
      return '4 hours';
    case 270:
      return '4.5 hours';
    case 300:
      return '5 hours';
    default:
      if (browser) {
        console.error('Invalid duration passed into humanizeDuration.', {
          extra: { duration }
        });
      }
      return '';
  }
}

/**
 * @param {number} duration Duration in hours
 * @param {boolean} shortHand Display short hand string
 * @returns {string} The plural of the duration
 */
export function pluralizeDurationHours(duration, shortHand = false) {
  // Durations under 1 hour are displayed as minutes.
  if (duration < 1) {
    return shortHand ? 'mins' : 'minutes';
  }
  if (duration === 1) {
    return shortHand ? 'hr' : 'hour';
  }
  return shortHand ? 'hrs' : 'hours';
}

/**
 * @param {number} duration Duration in hours
 * @param {boolean} shortHand Display short hand string
 * @returns {string} Human readable version of hours
 */
export function humanizeDurationHours(duration, shortHand = false) {
  // Durations under 1 hour are displayed as minutes.
  return `${duration < 1 ? 60 * duration : duration} ${pluralizeDurationHours(
    duration,
    shortHand
  )}`;
}

/**
 * Returns the plural of a word by appending an 's' to the end.
 * @param {string} word
 * @param {number} count
 * @returns {string}
 */
export function pluralize(word, count, includeCount = true) {
  return (
    (includeCount ? count.toString() + ' ' : '') +
    word +
    (count !== 1 ? 's' : '')
  );
}

/**
 * @param {number} i - Number
 * @returns {string} Number with the correct ordinal suffix
 */
export function ordinalSuffix(i) {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) {
    return i + 'st';
  }
  if (j === 2 && k !== 12) {
    return i + 'nd';
  }
  if (j === 3 && k !== 13) {
    return i + 'rd';
  }
  return i + 'th';
}

const ICONS = {
  1: 'gold',
  2: 'silver',
  3: 'bronze'
};
/**
 * @param {object} a - Achievement
 * @returns {string} The Achievement icon URL
 */
export function getAchievementIconURL(a) {
  let icon = 'medal';
  if (a.type === 'tournament') {
    if (a.placement in ICONS) {
      icon = ICONS[a.placement];
    }
  } else if (a.type === 'season') {
    icon = 'season';
  } else {
    icon = 'other';
  }
  return `${STATIC_URL}/coach/achievement_${icon}.svg`;
}

/**
 * @param {object} plan - Plan object
 * @returns {string} {total} games | {game name}
 */
export function displayPlanGames(plan) {
  const uniqueGames = uniqueBy(
    plan.lessons
      .filter((l) => l.game || l.coachGame)
      .map((m) => (m.game ? m.game : m)),
    'id'
  );
  return displayUniqueGames(uniqueGames);
}

/**
 * @param {[object]} uniqueGames - A list of Game objects
 * @returns {string} {total} games | {game name}
 */
export function displayUniqueGames(uniqueGames) {
  if (uniqueGames.length === 0) {
    return '0 games';
  }
  return uniqueGames.length > 1
    ? `${uniqueGames.length} games`
    : uniqueGames[0].title.en;
}

/**
 * Returns a human friendly representation of a training plan state.
 * @param {'pending' | 'confirmed' | 'completed' | 'canceled' | 'disputed'} state
 * @returns {string} The human friendly display name
 */
export function displayPlanState(state) {
  switch (state) {
    case 'pending':
      return 'Pending';
    case 'confirmed':
      // Note: We show 'confirmed' as 'In Progress'
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'canceled':
      return 'Canceled';
    case 'disputed':
      return 'Disputed';
    default:
      return 'Unknown';
  }
}

/**
 * Returns a human friendly representation of a replay review state.
 * @param {'draft' | 'pending' | 'in-progress' | 'rejected' | 'expired' | 'completed' | 'closed'} state
 * @returns {string} The human friendly display name
 */
export function displayReviewState(state) {
  switch (state) {
    case 'draft':
      return 'Draft';
    case 'pending':
      return 'Pending';
    case 'in-progress':
      return 'In Progress';
    case 'rejected':
      return 'Rejected';
    case 'expired':
      return 'Expired';
    case 'completed':
      return 'Completed';
    case 'closed':
      return 'Closed';
    default:
      return 'Unknown';
  }
}

/**
 * Returns a human friendly representation of a live session's state.
 * @param {'pending' | 'rescheduling' | 'confirmed' | 'completed' | 'canceled' | 'disputed'} state
 * @returns {string} The human friendly display name
 */
export function displayLiveSessionState(state) {
  switch (state) {
    case 'pending':
      return 'Pending';
    case 'rescheduling':
      return 'Rescheduling';
    case 'confirmed':
      // Note: We show 'confirmed' as 'Upcoming'
      return 'Upcoming';
    case 'completed':
      return 'Completed';
    case 'canceled':
      return 'Canceled';
    case 'disputed':
      return 'Disputed';
    default:
      return 'Unknown';
  }
}

export function displayTransactionSource(source, type) {
  switch (source) {
    case 'team_balance':
    case 'balance':
      return 'Metafy Credit';
    case 'package':
      return 'Live Session Package';
    case 'lesson':
      return 'Training Plan';
    case 'booking':
      return 'Live Session Booking';
    case 'payout':
      return 'Payout Request';
    case 'gift_card':
      return type === 'debit' ? 'Gift Card Purchase' : 'Gift Card Credit';
    case 'payment':
      return 'Coach Purchase';
    default:
      return '';
  }
}

/**
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
