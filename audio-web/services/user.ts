"use server"

import { Api } from "@/lib/api/api";

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
  await Api.post("/auth/register", { name: name, password: password });
  return true
}

export async function login(name: string, password: string) {
  const data = await Api.post<LoginResponse>("/auth/login", {
    name: name,
    password: password,
  });
  return data
}
