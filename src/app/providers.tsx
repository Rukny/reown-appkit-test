"use client";
import { SessionProvider } from "next-auth/react";
import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { getCsrfToken, signIn, signOut, getSession } from "next-auth/react";

import { mainnet, skaleEuropa } from "@reown/appkit/networks";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { createAppKit } from "@reown/appkit/react";
import {
  createSIWEConfig,
  formatMessage,
  SIWECreateMessageArgs,
  SIWESession,
  SIWEVerifyMessageArgs,
} from "@reown/appkit-siwe";
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!;
const queryClient = new QueryClient();

const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    domain: typeof window !== "undefined" ? window.location.host : "",
    uri: typeof window !== "undefined" ? window.location.origin : "",
    statement: "Please sign with your account",
    chains: [2046399126],
  }),
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
    formatMessage(args, address),
  getNonce: async () => {
    const nonce = await getCsrfToken();
    if (!nonce) {
      throw new Error("Failed to get nonce!");
    }

    return nonce;
  },
  getSession: async () => {
    const session = await getSession();
    if (!session) {
      throw new Error("Failed to get session!");
    }

    const { address, chainId } = session as unknown as SIWESession;

    return { address, chainId };
  },
  verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
    try {
      const success = await signIn("credentials", {
        message,
        redirect: true,
        signature,
        callbackUrl: "/protected",
      });

      return Boolean(true);
    } catch (error) {
      return false;
    }
  },
  signOut: async () => {
    try {
      await signOut({
        redirect: false,
      });

      return true;
    } catch (error) {
      return false;
    }
  },
});

const metadata = {
  name: "Reown test",
  description: "Reown Test ",
  url: "https://google.com",
  icons: ["https://www.google.com/favicon.ico"],
};

// Create wagmiConfig
export const networks = [skaleEuropa];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});
export const config = wagmiAdapter.wagmiConfig;

createAppKit({
  adapters: [wagmiAdapter],
  projectId: projectId,
  networks: [skaleEuropa],
  defaultNetwork: skaleEuropa,
  metadata: metadata,
  siweConfig: siweConfig,
  features: {
    allWallets: false,
    email: false,
    socials: false,
  },
  themeMode: "dark",
  allWallets: "HIDE",
});
export function Providers({
  children,
  cookies,
}: {
  children: React.ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );
  return (
    <SessionProvider>
      <WagmiProvider
        config={wagmiAdapter.wagmiConfig as Config}
        initialState={initialState}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </SessionProvider>
  );
}
