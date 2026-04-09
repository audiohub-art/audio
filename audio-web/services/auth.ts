import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from "next-auth/jwt"
import axios from "axios"

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export const { handlers, signIn, signOut, auth }  = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        accessToken: { label: "accessToken", type: "text" },
        refreshToken: { label: "refreshToken", type: "text" },
        name: { label: "name", type: "text" },
        id: { label: "id", type: "text" },
        accessTokenExpires: { label: "accessTokenExpires", type: "number" },
      },
      async authorize(credentials) {
        if (!credentials?.accessToken) return null;

        return {
          id: credentials.id as string,
          name: credentials.name as string,
          accessToken: credentials.accessToken as string,
          refreshToken: credentials.refreshToken as string,
          accessTokenExpires: Number(credentials.accessTokenExpires),
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires
        }
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
      const res = await refreshAccessToken(token);
      return res
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.accessToken = token.accessToken;
        session.error = token.error;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  }
})

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const { data } = await axios.post(
      `${process.env.BACKEND_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token.refreshToken}`,
        }
      }
    )

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTokenExpires: Date.now() + data.expiresIn * 1000,
      error: undefined
    };
  } catch {
    return {
      ...token,
      error: "RefreshAccessTokenError" as const
    }
  }
}
