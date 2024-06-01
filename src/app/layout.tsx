"use client"
import './globals.css'
import { Inter } from 'next/font/google'
import { useState } from "react";
import React, { useEffect, useMemo } from 'react';
import {
  ThirdwebProvider,
  // metamaskWallet,
  coreWallet,
  // coinbaseWallet,
  // walletConnect,
} from "@thirdweb-dev/react";
import { Sepolia, BaseSepoliaTestnet } from "@thirdweb-dev/chains";

const clientid = process.env.NEXT_PUBLIC_THIRDWEB_CLIENTID

const activeChain = {
	...Sepolia,
	rpc: ["https://ethereum-sepolia-rpc.publicnode.com"], // Override the "rpc" field.
};

const PolygonCardona = {
  chainId: 2442,
  name: "Cardona Testnet",
  shortName: "cardona", // Display value shown in the wallet UI
  slug: "cardona",
  chain: "cardona",
  iconUrl:
    "https://c8.alamy.com/zooms/9/ca8385ccae4b473490b2f3c035cc6a9f/2g0r7je.jpg",
  iconBackground: "#fff",
  rpc: ["https://rpc.cardona.zkevm-rpc.com"],
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  blockExplorers: {
    default: {
      name: "PolygonScan",
      url: "https://cardona-zkevm.polygonscan.com",
      apiUrl: "https://cardona-zkevm.polygonscan.com/api",
    },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: "0x50354531544DBB8397E7f853B03540a0c13b1e45",
      blockCreated: 1816738,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body >
      <ThirdwebProvider
      supportedWallets={[
        // metamaskWallet({
        //   recommended: true,
        // }),
        coreWallet(
          {
            recommended: true,
          }
        ),
        // coinbaseWallet(),
        // walletConnect(),
      ]}
      // desiredChainId={11155111}
    // activeChain={activeChain}
    activeChain={Sepolia}
      supportedChains={[Sepolia, PolygonCardona]}
      clientId={clientid}
    >
          {children}
          </ThirdwebProvider>
      </body>
    </html>
  )
}