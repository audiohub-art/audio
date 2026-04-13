import axios from "axios";
import { auth, signOut } from "@/services/auth"

export async function createPrivateApi() {
  const session = await auth()

  if (session?.error === "RefreshAccessTokenError") {
     await signOut({ redirectTo: "/login" });
    throw new Error("Unauthenticated");
  }

  return axios.create({
    baseURL: process.env.BACKEND_URL,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
      ...(session?.accessToken && {
        Authorization: `Bearer ${session.accessToken}`,
      }),
    },
  })
}

export async function createPublicApi() {
  return axios.create({
    baseURL: process.env.BACKEND_URL,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json"
    }
  })
}
