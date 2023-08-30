import { GET_AUTHENTICATED_USER } from "../client/clientQueries";

function setAuthenticatedUserResolver(_, args, { cache }) {
  let { user } = args;

  cache.writeQuery({
    query: GET_AUTHENTICATED_USER,
    data: {
      authenticatedUser: {
        __typename: "AuthenticatedUser",
        ...user,
      },
    },
  });

  return null;
}

export { setAuthenticatedUserResolver };
