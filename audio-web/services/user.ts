"use server"
import { createPublicApi } from "@/lib/api"
import { signIn, auth } from "./auth";

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
      accessTokenExpires: Date.now() + data.expiresIn * 1000,
      redirect: false
    })
    return true
  } catch {
    return false
  }
}

export async function getUser() {
  const session = await auth();
  if (!session?.user) return undefined;
  const user = session.user;
  return user
}
