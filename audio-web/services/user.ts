"use server"
import { createPrivateApi, createPublicApi } from "@/lib/api"
import { signIn } from "./auth";

interface LoginResponse {
  user: {
    id: number;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export async function register(name: string, password: string) {
  try {
    const api = await createPublicApi();
    await api.post("/auth/register", { name, password });
    return true;
  } catch {
    return false
  }
}

export async function login(name: string, password: string) {
  try {
    const api = await createPublicApi();
    const { data } = await api.post("/auth/login", { name, password });
    await signIn("credentials", {
      id: data.user.id,
      name: data.user.name,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTokenExpires: data.accessTokenExpires,
      redirect: false
    })
    return true
  } catch {
    return false
  }
}
