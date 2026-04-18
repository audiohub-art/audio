"use server"
import { createPrivateApi, createPublicApi } from "@/lib/api"
import { ServiceResponse } from "@/types/response";
import type { Post } from "@/types/post";

export async function getAllPosts(): Promise<ServiceResponse<Post[]>> {
  try {
    const api = await createPublicApi();

    const data = await api.get("/posts");

    return { data: data.data, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to get all posts",
    }
  }
}

export async function getPost(id: string): Promise<ServiceResponse<Post>> {
  try {
    const api = await createPublicApi();

    const data = await api.get(`/posts/${id}`);

    return { data: data.data, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to get post",
    }
  }
}

export async function updatePost(id: string, title: string, description: string): Promise<ServiceResponse<undefined>> {
  try {
    const api = await createPrivateApi();

    const res = await api.put(`/posts/modify/${id}`, { title, description });
    console.log("res : ", res)
    return { data: undefined, error: null }
  } catch (error) {
    console.log("error : ", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to create post",
    }
  }
}
