import { useQuery } from "@apollo/client";

import { GET_LOCALIZATION } from "../../graphql/server/localization";

export default function useLocalization(language = "EN") {
  let { data, loading } = useQuery(GET_LOCALIZATION, {
    variables: {
      language: language,
    },
  });

  return {
    data,
    loading,
  };
}
