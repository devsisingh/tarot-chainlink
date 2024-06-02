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
import { AvalancheFuji } from "@thirdweb-dev/chains";

const clientid = process.env.NEXT_PUBLIC_THIRDWEB_CLIENTID

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
    activeChain={AvalancheFuji}
      supportedChains={[AvalancheFuji]}
      clientId={clientid}
    >
          {children}
          </ThirdwebProvider>
      </body>
    </html>
  )
}