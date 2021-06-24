import { gql } from '@apollo/client/core';

export const EDIT_TEAM = gql`
  mutation EditTeam($id: ID!, $team: EditTeam!) {
    editTeam(id: $id, team: $team) {
      status
      team {
        id
        name
      }
    }
  }
`;

export const ADD_TEAM_INVITE = gql`
  mutation AddTeamInvite($id: ID!, $email: String!) {
    addTeamInvite(id: $id, email: $email) {
      status
      invite {
        id
        email
      }
    }
  }
`;

export const REMOVE_TEAM_INVITE = gql`
  mutation RemoveTeamInvite($id: ID!, $teamId: ID!) {
    removeTeamInvite(id: $id, teamId: $teamId) {
      status
    }
  }
`;

export const REMOVE_TEAM_MEMBERSHIP = gql`
  mutation RemoveTeamMembership($id: ID!, $teamId: ID!) {
    removeTeamMembership(id: $id, teamId: $teamId) {
      status
    }
  }
`;

export const ACCEPT_INVITE = gql`
  mutation AcceptInvite($teamId: ID!, $token: String!) {
    acceptInvite(teamId: $teamId, token: $token) {
      status
    }
  }
`;
