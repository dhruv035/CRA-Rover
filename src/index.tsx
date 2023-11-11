import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, Chain } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';

import {
  arbitrum,
  goerli,
  mainnet,
  optimism,
  polygon,
  base,
  zora,
  sepolia,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
const nordek: Chain = {
  id: 81041,
  name: 'Nordek',
  network: 'nordek',
  iconUrl:`https://pbs.twimg.com/profile_images/1721104975164751872/DTsj6Zth_400x400.jpg`,
  nativeCurrency: {
    decimals: 18,
    name: 'Nordek',
    symbol: 'NRK',
  },
  rpcUrls: {
    public: { http: ['https://mainnet-rpc.nordekscan.com'] },
    default: { http: ['https://mainnet-rpc.nordekscan.com'] },
  },
  blockExplorers: {
    default: { name: 'Nordekscan', url: 'https://nordekscan.com:443' },
  },
  testnet: false,
};
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    goerli,
    sepolia,
    nordek
  ],
  [
    publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  projectId: process.env.REACT_APP_PROJECT_ID?process.env.REACT_APP_PROJECT_ID:'YOUR_PROJECT_ID',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider chains={chains}>
    <App />
    </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
