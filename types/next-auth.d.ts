import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt"
import { TokenData } from "./types";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      name: string;
      twitter_token: TokenData;
    };
  }
  interface User {
    name?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** wallet address */
    wallet_address?: string;
  }
}
