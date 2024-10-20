import CredentialsProvider from "next-auth/providers/credentials";
import TwitterProvider from "next-auth/providers/twitter";
import { NextAuthOptions, getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import {
  type SIWESession,
  verifySignature,
  getChainIdFromMessage,
  getAddressFromMessage,
} from "@reown/appkit-siwe";
import { redirect } from "next/navigation";
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.message) {
            throw new Error("SiweMessage is undefined");
          }
          const { message, signature } = credentials;
          const address = getAddressFromMessage(message);
          const chainId = getChainIdFromMessage(message);
          const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!;

          const isValid = await verifySignature({
            address,
            message,
            signature,
            chainId,
            projectId,
          });

          if (isValid) {
            return {
              id: `${address}`,
            };
          }

          return null;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  theme: {
    colorScheme: "dark",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        token.twitter_token = undefined;
        return { ...token, ...session.user };
      }
      if (user) {
        token.wallet_address = user.name;
        return {
          ...token,
        };
      }
      return token;
    },

    async signIn({ user, account }) {
      if (!user) {
        return false;
      }

      user.name = user.id;
      return true;
    },

    async session({ session, token }) {
      if (token.wallet_address) {
        session.user.name = token.wallet_address;
      }

      if (token.twitter_token) {
        session.user.twitter_token = token.twitter_token;
      }
      return session;
    },
  },
  events: {
    async signOut() {
      redirect("/")
    },
  },
};

export default authOptions;
