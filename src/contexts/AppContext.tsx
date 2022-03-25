import React, {
  useEffect,
  useState,
  createContext,
  useCallback,
  useContext,
} from "react";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import { useEagerConnect } from "../hooks/useEagerConnect";
import { useInactiveListener } from "../hooks/useInactiveListener";
import { getTokenBalance } from "../utils/calls";
import {
  connectorsByName,
  resetWalletConnectConnector,
} from "../utils/web3React";
import { RefreshContext } from "./RefreshContext";

export interface GlobalAppContext {
  wallet: {
    active: boolean;
    balance: string;
    isConnecting: boolean;
    error: Error | undefined;
    retry: () => void;
  };
  triggerFetchTokens: () => void;
}

const defaultValues: GlobalAppContext = {
  wallet: {
    active: false,
    balance: "0",
    isConnecting: true,
    error: undefined,
    retry: () => {},
  },
  triggerFetchTokens: () => {},
};

export const GlobalAppContextProvider =
  createContext<GlobalAppContext>(defaultValues);

export default function AppContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { deactivate, active, error, account, library } = useActiveWeb3React();
  // get wallet balance in bnb
  const [balance, setBalance] = useState("0");

  /* A workaround, I use this state to trigger an update on this context and
  Refetch the tokenBalances when it changes. */
  const [trigger, setTrigger] = useState(false);
  const { fast, slow } = useContext(RefreshContext);

  useEffect(() => {
    if (active) {
      setIsConnecting(true);
    } else {
      setIsConnecting(false);
    }
  }, [active, error]);

  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);

  const handleRetry = () => {
    setIsConnecting(false);
    resetWalletConnectConnector(connectorsByName["walletconnect"]);
    deactivate();
  };

  useEffect(() => {
    (async () => {
      if (library && active && account) {
        // BUSD
        const bal = await getTokenBalance(
          "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
          account,
          18
        );
        setBalance(bal);
      }
    })();
    // also add the fast and slow vars from the refresh context
  }, [library, active, account, fast, slow, trigger]);

  const triggerFetchTokens = useCallback(() => setTrigger((p) => !p), []);

  return (
    <GlobalAppContextProvider.Provider
      value={{
        wallet: {
          active,
          balance,
          isConnecting,
          error,
          retry: handleRetry,
        },
        triggerFetchTokens,
      }}
    >
      {children}
    </GlobalAppContextProvider.Provider>
  );
}
