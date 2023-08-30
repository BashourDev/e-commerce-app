import { useQuery } from "@apollo/client";

import { GET_LOCALIZATION } from "../../graphql/server/localization";

export default function useLocalization() {
  let { data, loading } = useQuery(GET_LOCALIZATION);

  return {
    data,
    loading,
  };
}
