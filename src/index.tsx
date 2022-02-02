import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App/App";
import "./index.scss";
import Web3ContextProvider from "./shared/Web3Context";

declare var window: Window;

const appInit = () => {
  ReactDOM.render(
    <Web3ContextProvider>
      <App />
    </Web3ContextProvider>,
    document.getElementById("root")
  );
};

appInit();
