export const bookings = [
  {
    bookings: {
      totalCount: 2,
      pageInfo: {
        hasNextPage: false,
        endCursor: 'Mg',
        __typename: 'PageInfo'
      },
      edges: [
        {
          node: {
            id: '8642e077-a646-46c3-8c35-0f9d204138d9',
            scheduledAt: '2021-06-11T00:00:00Z',
            expiresAt: '2021-06-07T15:35:38Z',
            rescheduleSubmitted: false,
            rescheduledMessage: null,
            canceledMessage: null,
            canceledById: null,
            canceledPromoCode: null,
            state: 'completed',
            type: 'live',
            duration: 60,
            coachQuestionAnswers: [
              {
                answer:
                  'Develop an improvement plan and start developing specific game plans per match up.',
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
              id: '3b8d811c-e308-4228-b0db-0b4646af2de0',
              source: 'booking',
              status: 'completed',
              totalCents: 6000,
              createdAt: '2021-06-05T15:35:38Z',
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
          },
          __typename: 'BookingEdge'
        },
        {
          node: {
            id: 'd7ce0e3b-284a-41ff-b2d7-663dd6cb1b50',
            scheduledAt: '2021-05-22T18:00:00Z',
            expiresAt: '2021-05-20T03:21:25Z',
            rescheduleSubmitted: false,
            rescheduledMessage: null,
            canceledMessage: null,
            canceledById: null,
            canceledPromoCode: null,
            state: 'completed',
            type: 'live',
            duration: 60,
            coachQuestionAnswers: [
              {
                answer:
                  'I want to better understand playing neutral as Marth and form game plans for individual matchups.',
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
              id: 'eefa5f15-21c4-48f4-ad34-8eb46a0cf694',
              timezone: 'America/New_York',
              avatar:
                'https://static.metafy.gg/uploads/store/account/eefa5f15-21c4-48f4-ad34-8eb46a0cf694/avatar/706aef556a286a061986e40a992177f5.jpg',
              roles: ['standard', 'coach'],
              __typename: 'Account',
              coachProfile: {
                id: 'eefa5f15-21c4-48f4-ad34-8eb46a0cf694',
                name: 'Mew2King',
                slug: 'mew2king',
                title: 'Super Smash Bros. (series) coach',
                __typename: 'CoachProfile',
                coachAvailability: {
                  id: 'eefa5f15-21c4-48f4-ad34-8eb46a0cf694',
                  afkMode: false,
                  __typename: 'CoachAvailability'
                },
                coachGames: [
                  {
                    id: '62389551-199b-4dbf-87e7-880a207dc111',
                    position: 0,
                    __typename: 'CoachGame',
                    game: {
                      id: '21c1b417-0a53-4ef0-8d03-bded528d0fe9',
                      slug: 'super-smash-bros-ultimate',
                      artwork:
                        'https://static.metafy.gg/uploads/store/game/21c1b417-0a53-4ef0-8d03-bded528d0fe9/artwork/94c4050d5571921b12774eec2f09ec79.png',
                      poster:
                        'https://static.metafy.gg/uploads/store/game/21c1b417-0a53-4ef0-8d03-bded528d0fe9/poster/fe91d6791816ebb68e349fd762e80e9c.jpg',
                      cutout:
                        'https://static.metafy.gg/uploads/store/game/21c1b417-0a53-4ef0-8d03-bded528d0fe9/cutout/15a47fe821f502a2f6bbef96e91d4252.png',
                      category: 'Fighting',
                      title: {
                        en: 'Super Smash Bros. Ultimate'
                      },
                      __typename: 'Game'
                    },
                    lessons: [
                      {
                        id: 'dee65aaf-ed9e-4ac3-ab31-8d060a3e12d5',
                        position: 0,
                        title: '1:1 live session (1 on 1 Coaching with Mew2king, Ultimate)',
                        disabled: false,
                        type: 'live',
                        description:
                          "1 on 1 Coaching with Mew2king.\n\nWith this option, I'm going to do my best to make you a better and more knowledgeable player.  Usually this is done through a Discord call, usually us playing online (but not required), where I try to teach you anything I notice you could use to improve yourself (and explain why), matchup knowledge, answering questions, reviewing VoDs, or other types of useful information, depending on which type of approaches you prefer.\n\nIf you aren't sure what to book at first, I recommend trying this.  So far, I have had overwhelming positivity on clients' experiences overall up to this point, over a sample size of several months. I am very confident in my ability to help people improve and learn a lot, regardless of your current skill level. ",
                        duration: 60,
                        amount: null,
                        baseRateCents: 7000,
                        bundles: [
                          {
                            quantity: 2,
                            percentOff: 5
                          },
                          {
                            quantity: 3,
                            percentOff: 10
                          },
                          {
                            quantity: 5,
                            percentOff: 20
                          },
                          {
                            quantity: 10,
                            percentOff: 25
                          }
                        ],
                        game: {
                          id: '21c1b417-0a53-4ef0-8d03-bded528d0fe9',
                          category: 'Fighting',
                          slug: 'super-smash-bros-ultimate',
                          title: {
                            en: 'Super Smash Bros. Ultimate'
                          },
                          poster:
                            'https://static.metafy.gg/uploads/store/game/21c1b417-0a53-4ef0-8d03-bded528d0fe9/poster/fe91d6791816ebb68e349fd762e80e9c.jpg',
                          artwork:
                            'https://static.metafy.gg/uploads/store/game/21c1b417-0a53-4ef0-8d03-bded528d0fe9/artwork/94c4050d5571921b12774eec2f09ec79.png',
                          __typename: 'Game'
                        },
                        __typename: 'CoachPurchasableUnit',
                        coachGame: {
                          id: '62389551-199b-4dbf-87e7-880a207dc111',
                          __typename: 'CoachGame'
                        }
                      },
                      {
                        id: '821836f2-3a43-4fc9-b593-150f1d6e5e54',
                        position: 1,
                        title: 'Private practice/training with M2K, Ultimate',
                        disabled: false,
                        type: 'live',
                        description:
                          'Practice/train with me, this is more focused on simply playing together and me trying my best to beat you (probably by taking note of and punishing your bad habits) rather than me being focused on constantly talking/teaching about the game which 1 on 1 coaching does.  Thus, this option is cheaper, but I can provide great practice with a very wide variety of characters and have a lot of experience helping people improve in this way.\n\nThis could be a great option to book after 1 on 1 coaching.\n',
                        duration: 60,
                        amount: null,
                        baseRateCents: 6000,
                        bundles: [
                          {
                            quantity: 2,
                            percentOff: 5
                          },
                          {
                            quantity: 3,
                            percentOff: 10
                          },
                          {
                            quantity: 5,
                            percentOff: 20
                          },
                          {
                            quantity: 10,
                            percentOff: 25
                          }
                        ],
                        game: {
                          id: '21c1b417-0a53-4ef0-8d03-bded528d0fe9',
                          category: 'Fighting',
                          slug: 'super-smash-bros-ultimate',
                          title: {
                            en: 'Super Smash Bros. Ultimate'
                          },
                          poster:
                            'https://static.metafy.gg/uploads/store/game/21c1b417-0a53-4ef0-8d03-bded528d0fe9/poster/fe91d6791816ebb68e349fd762e80e9c.jpg',
                          artwork:
                            'https://static.metafy.gg/uploads/store/game/21c1b417-0a53-4ef0-8d03-bded528d0fe9/artwork/94c4050d5571921b12774eec2f09ec79.png',
                          __typename: 'Game'
                        },
                        __typename: 'CoachPurchasableUnit',
                        coachGame: {
                          id: '62389551-199b-4dbf-87e7-880a207dc111',
                          __typename: 'CoachGame'
                        }
                      },
                      {
                        id: '71da68e0-923f-471c-99c8-6e1243947884',
                        position: 9999,
                        title: 'Hangout with M2K (any game)',
                        disabled: false,
                        type: 'live',
                        description:
                          'We can play ANY GAME (Brawl/P+/DarkSouls/Bomberman/Mario Kart/etc) for however long you book for! \n\nThis could be a large arena in Ultimate, Melee Doubles online, talking about anything, birthday parties, etc!  Just to have fun!',
                        duration: 60,
                        amount: null,
                        baseRateCents: 4500,
                        bundles: [
                          {
                            quantity: 2,
                            percentOff: 5
                          },
                          {
                            quantity: 3,
                            percentOff: 10
                          },
                          {
                            quantity: 5,
                            percentOff: 15
                          },
                          {
                            quantity: 10,
                            percentOff: 20
                          }
                        ],
                        game: {
                          id: '21c1b417-0a53-4ef0-8d03-bded528d0fe9',
                          category: 'Fighting',
                          slug: 'super-smash-bros-ultimate',
                          title: {
                            en: 'Super Smash Bros. Ultimate'
                          },
                          poster:
                            'https://static.metafy.gg/uploads/store/game/21c1b417-0a53-4ef0-8d03-bded528d0fe9/poster/fe91d6791816ebb68e349fd762e80e9c.jpg',
                          artwork:
                            'https://static.metafy.gg/uploads/store/game/21c1b417-0a53-4ef0-8d03-bded528d0fe9/artwork/94c4050d5571921b12774eec2f09ec79.png',
                          __typename: 'Game'
                        },
                        __typename: 'CoachPurchasableUnit',
                        coachGame: {
                          id: '62389551-199b-4dbf-87e7-880a207dc111',
                          __typename: 'CoachGame'
                        }
                      }
                    ]
                  },
                  {
                    id: '5e9f646d-d994-4879-9fae-c7c03c8664a7',
                    position: 1,
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
                        id: 'e8ae3bf4-782f-4704-8b28-d2d6e89f9022',
                        position: 0,
                        title: '1:1 live session (1 on 1 Coaching with Mew2king, Melee)',
                        disabled: false,
                        type: 'live',
                        description:
                          "1 on 1 Coaching with Mew2king.\n\nWith this option, I'm going to do my best to make you a better and more knowledgeable player.  Usually this is done through a Discord call, usually us playing online (but not required), where I try to teach you anything I notice you could use to improve yourself (and explain why), matchup knowledge, answering questions, reviewing VoDs, or other types of useful information, depending on which type of approaches you prefer.\n\nIf you aren't sure what to book at first, I recommend trying this.  So far, I have had overwhelming positivity on clients' experiences overall up to this point, over a sample size of several months. I am very confident in my ability to help people improve and learn a lot, regardless of your current skill level. ",
                        duration: 60,
                        amount: null,
                        baseRateCents: 6900,
                        bundles: [
                          {
                            quantity: 2,
                            percentOff: 5
                          },
                          {
                            quantity: 3,
                            percentOff: 10
                          },
                          {
                            quantity: 5,
                            percentOff: 20
                          },
                          {
                            quantity: 10,
                            percentOff: 30
                          }
                        ],
                        coachGame: {
                          id: '5e9f646d-d994-4879-9fae-c7c03c8664a7',
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
                      },
                      {
                        id: 'fc277255-7b5d-4e2e-84fa-8e1441f2bbc2',
                        position: 1,
                        title: 'Private practice with M2k in Melee',
                        disabled: false,
                        type: 'live',
                        description:
                          'Practice/train with me, this is more focused on simply playing together and me trying my best to beat you (probably by taking note of and punishing your bad habits) rather than me being focused on constantly talking/teaching about the game which 1 on 1 coaching does.  Thus, this option is cheaper, but I can provide great practice with a very wide variety of characters and have a lot of experience helping people improve in this way.\n\nThis could be a great option to book after 1 on 1 coaching.',
                        duration: 60,
                        amount: null,
                        baseRateCents: 5900,
                        bundles: [
                          {
                            quantity: 2,
                            percentOff: 5
                          },
                          {
                            quantity: 3,
                            percentOff: 10
                          },
                          {
                            quantity: 5,
                            percentOff: 20
                          },
                          {
                            quantity: 10,
                            percentOff: 30
                          }
                        ],
                        coachGame: {
                          id: '5e9f646d-d994-4879-9fae-c7c03c8664a7',
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
                      },
                      {
                        id: '4b58a710-3c04-442d-87e4-eb37270af8a0',
                        position: 9999,
                        title: 'Hangout with M2k (ANY GAME)',
                        disabled: false,
                        type: 'live',
                        description:
                          'We can play ANY GAME (Brawl/P+/DarkSouls/Bomberman/Mario Kart/etc) for however long you book for! \n\nThis could be a large arena in Ultimate, Melee Doubles online, talking about anything, birthday parties, etc!  Just to have fun!',
                        duration: 60,
                        amount: null,
                        baseRateCents: 4500,
                        bundles: [
                          {
                            quantity: 2,
                            percentOff: 5
                          },
                          {
                            quantity: 3,
                            percentOff: 10
                          },
                          {
                            quantity: 5,
                            percentOff: 15
                          },
                          {
                            quantity: 10,
                            percentOff: 20
                          }
                        ],
                        coachGame: {
                          id: '5e9f646d-d994-4879-9fae-c7c03c8664a7',
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
                  },
                  {
                    id: 'c1754122-1e83-4552-bc07-f2aa77ef9482',
                    position: 2,
                    __typename: 'CoachGame',
                    game: {
                      id: '3a4dd0c7-6f37-4da6-b0dd-d16856c08676',
                      slug: 'super-smash-bros-brawl',
                      artwork:
                        'https://static.metafy.gg/uploads/store/game/3a4dd0c7-6f37-4da6-b0dd-d16856c08676/artwork/0d4499e87facd9fc048d1ac153206ddd.jpg',
                      poster:
                        'https://static.metafy.gg/uploads/store/game/3a4dd0c7-6f37-4da6-b0dd-d16856c08676/poster/f395a41c7cea42ef40dd43646b29064c.jpg',
                      cutout:
                        'https://static.metafy.gg/uploads/store/game/3a4dd0c7-6f37-4da6-b0dd-d16856c08676/cutout/3334b6df5770111f42277d6d63c6bd15.png',
                      category: 'Fighting',
                      title: {
                        en: 'Super Smash Bros. Brawl'
                      },
                      __typename: 'Game'
                    },
                    lessons: [
                      {
                        id: 'd0b07794-9261-4a4a-8691-066191f8b7a2',
                        position: 0,
                        title: 'Hangout with M2K (ANY GAME)',
                        disabled: false,
                        type: 'live',
                        description:
                          'We can play ANY GAME (Brawl/P+/DarkSouls/Bomberman/Mario Kart/etc) for however long you book for! \n\nThis could be a large arena in Ultimate, Melee Doubles online, talking about anything, birthday parties, etc!  Just to have fun!',
                        duration: 60,
                        amount: null,
                        baseRateCents: 4500,
                        bundles: [
                          {
                            quantity: 2,
                            percentOff: 5
                          },
                          {
                            quantity: 3,
                            percentOff: 10
                          },
                          {
                            quantity: 5,
                            percentOff: 20
                          },
                          {
                            quantity: 10,
                            percentOff: 25
                          }
                        ],
                        game: {
                          id: '3a4dd0c7-6f37-4da6-b0dd-d16856c08676',
                          category: 'Fighting',
                          slug: 'super-smash-bros-brawl',
                          title: {
                            en: 'Super Smash Bros. Brawl'
                          },
                          poster:
                            'https://static.metafy.gg/uploads/store/game/3a4dd0c7-6f37-4da6-b0dd-d16856c08676/poster/f395a41c7cea42ef40dd43646b29064c.jpg',
                          artwork:
                            'https://static.metafy.gg/uploads/store/game/3a4dd0c7-6f37-4da6-b0dd-d16856c08676/artwork/0d4499e87facd9fc048d1ac153206ddd.jpg',
                          __typename: 'Game'
                        },
                        __typename: 'CoachPurchasableUnit',
                        coachGame: {
                          id: 'c1754122-1e83-4552-bc07-f2aa77ef9482',
                          __typename: 'CoachGame'
                        }
                      }
                    ]
                  },
                  {
                    id: 'c0c448ce-e2d6-4481-837d-c17907f5efae',
                    position: 3,
                    __typename: 'CoachGame',
                    game: {
                      id: '3743f6c1-27fe-4f0b-9e15-137486a342d3',
                      slug: 'project-plus',
                      artwork:
                        'https://static.metafy.gg/uploads/store/game/3743f6c1-27fe-4f0b-9e15-137486a342d3/artwork/d824d7d8176093813c9fcffd95473bbb.jpg',
                      poster:
                        'https://static.metafy.gg/uploads/store/game/3743f6c1-27fe-4f0b-9e15-137486a342d3/poster/ec85dcd6bc009306f212a701b69f043d.jpg',
                      cutout:
                        'https://static.metafy.gg/uploads/store/game/3743f6c1-27fe-4f0b-9e15-137486a342d3/cutout/6c8b82dae72bb12e040c328b78883bb0.png',
                      category: 'Fighting',
                      title: {
                        en: 'Project +'
                      },
                      __typename: 'Game'
                    },
                    lessons: [
                      {
                        id: 'c28c2994-51bd-4e8b-b634-00415eb7720c',
                        position: 0,
                        title: '1:1 live session',
                        disabled: false,
                        type: 'live',
                        description: '1:1 live session',
                        duration: 60,
                        amount: null,
                        baseRateCents: 4500,
                        bundles: [
                          {
                            quantity: 2,
                            percentOff: 5
                          },
                          {
                            quantity: 3,
                            percentOff: 10
                          },
                          {
                            quantity: 5,
                            percentOff: 20
                          },
                          {
                            quantity: 10,
                            percentOff: 25
                          }
                        ],
                        game: {
                          id: '3743f6c1-27fe-4f0b-9e15-137486a342d3',
                          category: 'Fighting',
                          slug: 'project-plus',
                          title: {
                            en: 'Project +'
                          },
                          poster:
                            'https://static.metafy.gg/uploads/store/game/3743f6c1-27fe-4f0b-9e15-137486a342d3/poster/ec85dcd6bc009306f212a701b69f043d.jpg',
                          artwork:
                            'https://static.metafy.gg/uploads/store/game/3743f6c1-27fe-4f0b-9e15-137486a342d3/artwork/d824d7d8176093813c9fcffd95473bbb.jpg',
                          __typename: 'Game'
                        },
                        __typename: 'CoachPurchasableUnit',
                        coachGame: {
                          id: 'c0c448ce-e2d6-4481-837d-c17907f5efae',
                          __typename: 'CoachGame'
                        }
                      }
                    ]
                  },
                  {
                    id: '1fea1e24-99fd-49e0-8cd2-686b0f3a3fa0',
                    position: 4,
                    __typename: 'CoachGame',
                    game: {
                      id: 'e66b7ea1-a7f6-428e-95b1-86a3aa5abcf8',
                      slug: 'project-m',
                      artwork:
                        'https://static.metafy.gg/uploads/store/game/e66b7ea1-a7f6-428e-95b1-86a3aa5abcf8/artwork/bddbd9a9544ebb7df372dc41e009aae1.png',
                      poster:
                        'https://static.metafy.gg/uploads/store/game/e66b7ea1-a7f6-428e-95b1-86a3aa5abcf8/poster/29892fd3bd553e66b35bbd3b84eacf28.jpg',
                      cutout:
                        'https://static.metafy.gg/uploads/store/game/e66b7ea1-a7f6-428e-95b1-86a3aa5abcf8/cutout/c8b60ab5303b8feaff16c90a7948924e.png',
                      category: 'Fighting',
                      title: {
                        en: 'Project M'
                      },
                      __typename: 'Game'
                    },
                    lessons: []
                  }
                ]
              },
              discord: {
                id: '41dde413-4ffd-4708-a1bd-17cf360b2a8c',
                username: 'Mew2king',
                discriminator: '8542',
                __typename: 'Discord'
              }
            },
            transaction: {
              id: 'd40b0f0c-7195-4596-a607-80e0ad55497c',
              source: 'booking',
              status: 'completed',
              totalCents: 6900,
              createdAt: '2021-05-18T03:21:25Z',
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
              id: 'e8ae3bf4-782f-4704-8b28-d2d6e89f9022',
              position: 0,
              title: '1:1 live session (1 on 1 Coaching with Mew2king, Melee)',
              disabled: false,
              type: 'live',
              description:
                "1 on 1 Coaching with Mew2king.\n\nWith this option, I'm going to do my best to make you a better and more knowledgeable player.  Usually this is done through a Discord call, usually us playing online (but not required), where I try to teach you anything I notice you could use to improve yourself (and explain why), matchup knowledge, answering questions, reviewing VoDs, or other types of useful information, depending on which type of approaches you prefer.\n\nIf you aren't sure what to book at first, I recommend trying this.  So far, I have had overwhelming positivity on clients' experiences overall up to this point, over a sample size of several months. I am very confident in my ability to help people improve and learn a lot, regardless of your current skill level. ",
              duration: 60,
              amount: null,
              baseRateCents: 6900,
              bundles: [
                {
                  quantity: 2,
                  percentOff: 5
                },
                {
                  quantity: 3,
                  percentOff: 10
                },
                {
                  quantity: 5,
                  percentOff: 20
                },
                {
                  quantity: 10,
                  percentOff: 30
                }
              ],
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
                id: '5e9f646d-d994-4879-9fae-c7c03c8664a7',
                __typename: 'CoachGame'
              }
            }
          },
          __typename: 'BookingEdge'
        }
      ],
      __typename: 'BookingConnection'
    }
  }
];
