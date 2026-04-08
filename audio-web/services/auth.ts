import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from "next-auth/jwt"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3333";

export const handlers = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "name", type: "name" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.name || !credentials?.password) return null;
        const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: credentials?.name,
            password: credentials?.password,
          })
        })
        const data = await res.json();

        if (!res.ok || !data) return null

        return {
          id: data.user.id,
          name: data.user.name,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          accessTokenExpires: data.expiresIn,
        };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        return {
          ...token,
          id: user.id,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires
        } as JWT;
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
      return refreshAccessToken(token);
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
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const refreshedTokens = await response.json();
    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken,
      accessTokenExpires: Date.now() + refreshedTokens.expiresIn * 1000,
    };
  } catch (error) {
    console.log("Failed to reload token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError"
    }
  }
}
