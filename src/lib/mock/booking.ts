export const booking = {
  booking: {
    id: '45927856-c689-4745-9641-b085d559cd55',
    scheduledAt: '2021-06-25T00:00:00Z',
    expiresAt: '2021-06-13T01:11:28Z',
    rescheduleSubmitted: false,
    rescheduledMessage: null,
    canceledMessage: null,
    canceledById: null,
    canceledPromoCode: null,
    state: 'confirmed',
    type: 'live',
    duration: 60,
    coachQuestionAnswers: [
      {
        answer:
          'Spending some time to check progress, build upon previously discussed ideas, and cover new characters/situations.',
        question: 'What are your goals for this session?'
      }
    ],
    lessonPlan: null,
    __typename: 'Booking',
    student: {
      id: '73f79d0e-7d54-4db4-8723-ddcec970cc48',
      name: 'starRy',
      timezone: 'America/New_York',
      avatar: null,
      roles: ['standard'],
      coachProfile: null,
      __typename: 'Account',
      discord: {
        id: '8463d4ab-5651-4d44-bb3d-eb825e3f50cb',
        username: 'Rylee',
        discriminator: '4082',
        __typename: 'Discord'
      }
    },
    coach: {
      id: '286794a6-7a6e-4101-8bfe-55f7d8837058',
      timezone: 'America/New_York',
      avatar:
        'https://static.metafy.gg/uploads/store/account/286794a6-7a6e-4101-8bfe-55f7d8837058/avatar/f0c219f7c07c823d07321701d3a05423.jpg',
      roles: ['standard', 'coach'],
      __typename: 'Account',
      coachProfile: {
        id: '286794a6-7a6e-4101-8bfe-55f7d8837058',
        name: 'Rishi',
        slug: 'rishi',
        title: null,
        __typename: 'CoachProfile',
        coachAvailability: {
          id: '286794a6-7a6e-4101-8bfe-55f7d8837058',
          afkMode: false,
          __typename: 'CoachAvailability'
        },
        coachGames: [
          {
            id: 'b6899126-db88-4e87-a5bd-22735934335f',
            position: 9999,
            game: {
              id: '4849def1-ca06-4200-b02b-08f269cf7cf5',
              slug: 'super-smash-bros-melee',
              artwork:
                'https://static.metafy.gg/uploads/store/game/4849def1-ca06-4200-b02b-08f269cf7cf5/artwork/c7c0710f578050ab54b105b33589338c.jpg',
              poster:
                'https://static.metafy.gg/uploads/store/game/4849def1-ca06-4200-b02b-08f269cf7cf5/poster/eb0add41a55f3f25b3ba7b5725059a8e.jpg',
              cutout:
                'https://static.metafy.gg/uploads/store/game/4849def1-ca06-4200-b02b-08f269cf7cf5/cutout/bc5725cc08bc30f21fda30b37a77ba7e.png',
              category: 'Fighting',
              title: {
                en: 'Super Smash Bros. Melee'
              },
              __typename: 'Game'
            },
            __typename: 'CoachGame',
            lessons: [
              {
                id: 'e7192530-64f3-41e8-a03d-98cb72d8ffeb',
                position: 0,
                title: '1:1 live session',
                disabled: false,
                type: 'live',
                description: '1:1 live session',
                duration: 60,
                amount: null,
                baseRateCents: 6000,
                bundles: [],
                coachGame: {
                  id: 'b6899126-db88-4e87-a5bd-22735934335f',
                  __typename: 'CoachGame'
                },
                game: {
                  id: '4849def1-ca06-4200-b02b-08f269cf7cf5',
                  category: 'Fighting',
                  slug: 'super-smash-bros-melee',
                  title: {
                    en: 'Super Smash Bros. Melee'
                  },
                  poster:
                    'https://static.metafy.gg/uploads/store/game/4849def1-ca06-4200-b02b-08f269cf7cf5/poster/eb0add41a55f3f25b3ba7b5725059a8e.jpg',
                  artwork:
                    'https://static.metafy.gg/uploads/store/game/4849def1-ca06-4200-b02b-08f269cf7cf5/artwork/c7c0710f578050ab54b105b33589338c.jpg',
                  __typename: 'Game'
                },
                __typename: 'CoachPurchasableUnit'
              }
            ]
          }
        ]
      },
      discord: {
        id: 'd9eb3259-b466-4744-991e-f1960a58fc2b',
        username: 'SmashG0D',
        discriminator: '8075',
        __typename: 'Discord'
      }
    },
    transaction: {
      id: '36574ab1-127f-48e8-ac45-ae32ee98ed60',
      source: 'booking',
      status: 'completed',
      totalCents: 6000,
      createdAt: '2021-06-11T01:11:28Z',
      __typename: 'Transaction'
    },
    game: {
      id: '4849def1-ca06-4200-b02b-08f269cf7cf5',
      slug: 'super-smash-bros-melee',
      title: {
        en: 'Super Smash Bros. Melee'
      },
      poster:
        'https://static.metafy.gg/uploads/store/game/4849def1-ca06-4200-b02b-08f269cf7cf5/poster/eb0add41a55f3f25b3ba7b5725059a8e.jpg',
      artwork:
        'https://static.metafy.gg/uploads/store/game/4849def1-ca06-4200-b02b-08f269cf7cf5/artwork/c7c0710f578050ab54b105b33589338c.jpg',
      __typename: 'Game'
    },
    team: null,
    lesson: {
      id: 'e7192530-64f3-41e8-a03d-98cb72d8ffeb',
      position: 0,
      title: '1:1 live session',
      disabled: false,
      type: 'live',
      description: '1:1 live session',
      duration: 60,
      amount: null,
      baseRateCents: 6000,
      bundles: [],
      game: {
        id: '4849def1-ca06-4200-b02b-08f269cf7cf5',
        category: 'Fighting',
        slug: 'super-smash-bros-melee',
        title: {
          en: 'Super Smash Bros. Melee'
        },
        poster:
          'https://static.metafy.gg/uploads/store/game/4849def1-ca06-4200-b02b-08f269cf7cf5/poster/eb0add41a55f3f25b3ba7b5725059a8e.jpg',
        artwork:
          'https://static.metafy.gg/uploads/store/game/4849def1-ca06-4200-b02b-08f269cf7cf5/artwork/c7c0710f578050ab54b105b33589338c.jpg',
        __typename: 'Game'
      },
      __typename: 'CoachPurchasableUnit',
      coachGame: {
        id: 'b6899126-db88-4e87-a5bd-22735934335f',
        __typename: 'CoachGame'
      }
    }
  }
};
