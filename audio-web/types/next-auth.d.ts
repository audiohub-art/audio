import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string;
    }
    accessToken: string;
    error?: "RefreshAccessTokenError";
  }

  interface User {
    id: number;
    name: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: number;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: "RefreshAccessTokenError";
  }
}
