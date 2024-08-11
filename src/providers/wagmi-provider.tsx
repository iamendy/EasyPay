"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider as Wagmi } from "wagmi";
import { config } from "@/lib/wagmi";
const queryClient = new QueryClient();
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";

export default function WagmiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Wagmi config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </Wagmi>
  );
}
