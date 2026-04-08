import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from "next-auth/jwt"
import { Api, PrivateApi } from '@/lib/api/api';
import { login } from './user';



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
        name: { label: "name", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.name || !credentials?.password) return null;
        try {
          const data = await login(credentials.name as string, credentials.password as string);
          if (!data) return null
          return {
            id: data.user.id,
            name: data.user.name,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            accessTokenExpires: data.expiresIn,
          }
        } catch {
          return null;
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        return {
          ...token,
          id: user.id as number,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires
        }
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
    const data = await PrivateApi.post<RefreshResponse>(
      "/auth/refresh",
      { refreshAccessToken: token.refreshToken },
      undefined,
      token.refreshToken
    )

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTokenExpires: Date.now() + data.expiresIn * 1000,
    };
  } catch (error) {
    console.log("Failed to reload token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError"
    }
  }
}
