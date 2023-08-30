import { useQuery } from "@apollo/client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { GET_SHOP } from "../graphql/server/shop";
export const NetworkStateEnum = {
  CONNECTED: "connected",
  CONNECTING: "connecting",
  NOT_CONNECTED: "notConnected",
};

let NetworkContext = createContext(undefined);

export function Provider({ children }) {
  let [isConnected, setIsConnected] = useState(NetworkStateEnum.NOT_CONNECTED);

  let { refetch, loading } = useQuery(GET_SHOP, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    onCompleted: () => setIsConnected(NetworkStateEnum.CONNECTED),
    onError: () => setIsConnected(NetworkStateEnum.NOT_CONNECTED),
  });

  let retryConnection = useCallback(() => refetch(), [refetch]);

  let context = useMemo(
    () => ({ isConnected, retryConnection }),
    [isConnected, retryConnection]
  );

  useEffect(() => {
    if (loading) {
      setIsConnected(NetworkStateEnum.CONNECTING);
    }
  }, [loading]);

  return (
    <NetworkContext.Provider value={context}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  let context = useContext(NetworkContext);

  if (context === undefined) {
    throw new Error("useNetwork must be inside the Provider");
  }

  return context;
}
