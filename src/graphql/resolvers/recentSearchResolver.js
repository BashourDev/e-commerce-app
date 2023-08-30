import { GET_RECENT_SEARCH, SET_RECENT_SEARCH } from "../client/clientQueries";

function recentSearchResolver(_, args, { cache }) {
  let { search } = args;

  let recentSearchData = cache.readQuery({
    query: GET_RECENT_SEARCH,
  });

  let same = recentSearchData?.recentSearch
    .map((item) => item.title === search)
    .indexOf(true);

  same !== -1
    ? cache.writeQuery({
        query: GET_RECENT_SEARCH,
        data: {
          __typename: "RecentSearch",
          recentSearch: [
            ...(recentSearchData
              ? recentSearchData.recentSearch.filter(
                  (_, index) => index !== same
                )
              : []),
            {
              __typename: "SearchDetail",
              title: search,
            },
          ],
        },
      })
    : cache.writeQuery({
        query: GET_RECENT_SEARCH,
        data: {
          __typename: "RecentSearch",
          recentSearch: [
            ...(recentSearchData
              ? recentSearchData.recentSearch.length > 4
                ? recentSearchData.recentSearch.slice(
                    Math.max(recentSearchData.recentSearch.length - 4, 1)
                  )
                : recentSearchData.recentSearch
              : []),
            {
              __typename: "SearchDetail",
              title: search,
            },
          ],
        },
      });

  return null;
}

export { recentSearchResolver };
