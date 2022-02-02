import React, { useEffect, useMemo, useState } from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { Window } from "../react-app-env";

declare var window: Window;

export interface Web3ContextValues {
  web3: Web3 | null;
  setWeb3: (web3: Web3) => void;
  accounts: string[];
  setAccounts: (accounts: string[]) => void;
  account: string | null;
  setAccount: (account: string) => void;
  networkType: string | null;
  setNetworkType: (network: string) => void;
}

const web3ContextDefault: Web3ContextValues = {
  web3: null,
  setWeb3: () => {},
  accounts: [],
  setAccounts: () => {},
  account: null,
  setAccount: () => {},
  networkType: null,
  setNetworkType: () => {},
};

const Web3Context = React.createContext(web3ContextDefault);

export const useWeb3Context = () => {
  const web3Context = React.useContext(Web3Context);
  return web3Context;
};

export default function Web3ContextProvider({
  children,
}: {
  children: React.ReactChild;
}) {
  const [web3, setWeb3] = useState<Web3 | null>(web3ContextDefault.web3);
  const [account, setAccount] = useState<string | null>(
    web3ContextDefault.account
  );
  const [accounts, setAccounts] = useState<string[]>(
    web3ContextDefault.accounts
  );
  const [networkType, setNetworkType] = useState<string | null>(
    web3ContextDefault.networkType
  );

  const loadBlockchainData = async () => {
    // if (window.ethereum) {
    //   const web3Provider = window.ethereum;
    //   // Request account access if needed
    //   const _accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    //   const _web3 = new Web3(window.ethereum);
    //   const _account = _accounts[0];
    //   const _networkType = await _web3.eth.net.getNetworkType();
    //   // Acccounts now exposed
    //   // _web3.eth.sendTransaction({ from: _account })
    //   setAccount(_account);
    //   setAccounts(_accounts);
    //   setWeb3(_web3);
    //   setNetworkType(_networkType);
    //   const _todoList = new _web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);
    //   setTodoList(_todoList);
    // }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return useMemo(
    () => (
      <Web3Context.Provider
        value={{
          web3: web3,
          setWeb3: setWeb3,
          account: account,
          setAccount: setAccount,
          accounts: accounts,
          setAccounts: setAccounts,
          networkType: networkType,
          setNetworkType: setNetworkType,
        }}
      >
        {children}
      </Web3Context.Provider>
    ),
    [children, web3, account, accounts, networkType]
  );
}
