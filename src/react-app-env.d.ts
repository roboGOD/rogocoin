import { AbstractProvider } from 'web3-core';

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
  }
}

interface Window {
  ethereum: AbstractProvider;
}
