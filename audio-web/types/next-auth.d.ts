import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
    }
    accessToken: string;
    error?: "RefreshAccessTokenError";
  }

  interface User {
    id: string;
    name: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: "RefreshAccessTokenError";
  }
}
