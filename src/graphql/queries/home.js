import { gql } from '@apollo/client/core';

export const HOME_PAGE = gql`
  query HomePage {
    announcement
    homeStats
    games {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          slug
          poster
          title
        }
      }
    }
    topGames {
      id
      slug
      artwork
      poster
      cutout
      logotype
      title
      category
      featuredCoachCount
    }
    recentBookings {
      id
      coach {
        id
        avatar
        coachProfile {
          id
          slug
          name
          coachGames {
            id
            position
            game {
              id
              slug
              title
              artwork
              logotype
            }
            lessons {
              id
              baseRateCents
            }
          }
        }
      }
      game {
        id
        slug
        title
        artwork
        logotype
      }
    }
  }
`;
