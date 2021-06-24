import { gql } from '@apollo/client/core';

const COACH_CARD_FRAGMENT = gql`
  fragment CoachCardFields on CoachProfile {
    id
    name
    slug
    summary
    recentBookingAt
    account {
      id
      avatar
      name
    }
    coachGames {
      id
      game {
        id
        slug
        title
        poster
      }
      lessons {
        id
        baseRateCents
      }
    }
    coachAchievements {
      id
      type
      achievement
      tournamentTitle
      placement
      year
      position
    }
  }
`;

export const GET_GAME_PAGE = gql`
  query GetGamePage($slug: ID!, $collectionSlug: String, $tagSlug: String) {
    game(slug: $slug) {
      id
      slug
      title
      seoTitle
      poster
      artwork
      cutout
      logotype
      category
      coachSeoBlurb
      featuredCoachProfiles {
        ...CoachCardFields
      }
      collections(slug: $collectionSlug) {
        id
        position
        title
        slug
        displayTitle
        seoDescription
        designVariation
        tags(slug: $tagSlug) {
          id
          position
          title
          slug
          pageTitle
          seoDescription
          imageTagPage
          imageGamePage
          coaches {
            ...CoachCardFields
          }
        }
      }
      relatedGames {
        id
        slug
        poster
        title
      }
    }
    recentBookings(slug: $slug) {
      id
      duration
      transaction {
        id
        totalCents
      }
      coach {
        id
        avatar
        coachProfile {
          id
          slug
          name
        }
      }
    }
  }
  ${COACH_CARD_FRAGMENT}
`;

export const FOOTER_GAMES = gql`
  query FooterGames {
    topGames(limit: 4) {
      id
      slug
      title
    }
  }
`;

export const GET_POPULAR_GAMES = gql`
  query GetPopularGames($limit: Int = 5) {
    popularGames(limit: $limit) {
      id
      slug
      title
      poster
    }
  }
`;
