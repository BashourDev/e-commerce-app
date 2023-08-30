import { useMutation, useQuery } from "@apollo/client";

import {
  GET_AUTHENTICATED_USER,
  SET_AUTHENTICATED_USER,
} from "../../graphql/client/clientQueries";
import { INITIATE_PASSWORD_RESET } from "../../graphql/server/auth";

function useSetAuthenticatedUser(options) {
  let [setUser, { loading }] = useMutation(SET_AUTHENTICATED_USER, {
    ...options,
  });

  return { setUser, loading };
}

function useGetAuthenticatedUser(options) {
  let { data, error, loading, refetch } = useQuery(GET_AUTHENTICATED_USER, {
    fetchPolicy: "cache-only",
    notifyOnNetworkStatusChange: true,
    ...options,
  });
  console.log("====================================");
  console.log("ProfileScene:", loading, error, data);
  console.log("====================================");
  return { data, error, loading, refetch };
}

function useForgotPasswordMutation(options) {
  let [resetPassword, { loading }] = useMutation(INITIATE_PASSWORD_RESET, {
    ...options,
  });

  return { resetPassword, loading };
}

export {
  useSetAuthenticatedUser,
  useGetAuthenticatedUser,
  useForgotPasswordMutation,
};
