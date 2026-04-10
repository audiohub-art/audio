import { createPublicApi } from "@/lib/api"
import { ServiceResponse } from "@/types/response";
import type { Post } from "@/types/post";

export async function getAllPosts(): Promise<ServiceResponse<Post[]>> {
  try {
    const api = await createPublicApi();

    const data = await api.get("/posts");

    return { data: data.data, error: null }
  } catch (error) {
    console.error("Error fetching posts", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to get all posts",
    }
  }
}
