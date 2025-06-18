'use client';

import { PrivyProvider as BasePrivyProvider } from "@privy-io/react-auth";
import { hardhat, monadTestnet } from 'viem/chains';

export default function PrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <BasePrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        embeddedWallets: {
          createOnLogin: "all-users",
        },
        defaultChain: monadTestnet,
        supportedChains: [hardhat, monadTestnet]
      }}
    >
      {children}
    </BasePrivyProvider>
  )
}