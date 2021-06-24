import { InMemoryCache } from '@apollo/client/core';
import { relayStylePagination } from '@apollo/client/utilities';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        students: relayStylePagination(),
        coaches: relayStylePagination(['teamId']),
        games: relayStylePagination(),
        bookings: relayStylePagination(['type', 'state', 'teamId', 'as', 'order']),
        lessons: relayStylePagination(['state', 'teamId', 'as', 'order']),
        transactions: relayStylePagination(),
        conversations: relayStylePagination(),
        conversationMessages: relayStylePagination(['id']),
      },
    },
    Account: {
      fields: {
        roles: {
          merge: false,
        },
        googles: {
          merge: false,
        },
        emailSettings: {
          merge: false,
        },
        pushSettings: {
          merge: false,
        },
        discordSettings: {
          merge: false,
        },
      },
    },
    Booking: {
      fields: {
        coachQuestionAnswers: {
          merge: false,
        },
      },
    },
    CoachAvailability: {
      fields: {
        availability: {
          merge: false,
        },
      },
    },
    CoachGame: {
      fields: {
        livePacks: {
          merge: false,
        },
        replayPacks: {
          merge: false,
        },
      },
    },
    CoachProfile: {
      fields: {
        socialAccounts: {
          merge: false,
        },
        seoTitle: {
          merge: false,
        },
      },
    },
    Conversation: {
      fields: {
        participants: {
          merge: false,
        },
      },
    },
    ConversationMessage: {
      fields: {
        delta: {
          merge: false,
        },
      },
    },
    Game: {
      keyFields: ['slug'],
      fields: {
        title: {
          merge: false,
        },
        seoTitle: {
          merge: false,
        },
      },
    },
    Price: {
      keyFields: [],
    },
  },
});

export default cache;
