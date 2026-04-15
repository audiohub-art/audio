"use server"
import { createPrivateApi } from "@/lib/api"
import { ServiceResponse } from "@/types/response";
import type { Post } from "@/types/post";

export async function uploadAudio(formData: FormData): Promise<ServiceResponse<Post>> {
  try {
    const api = await createPrivateApi();
    const audio = formData.get('file') as File
    if (!audio) return { data: null, error: "No file provided" };

    const arrayBuffer = await audio.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const nodeFormData = new FormData();
    const blob = new Blob([buffer], { type: audio.type });
    nodeFormData.append("file", blob, audio.name);
    const data = await api.post("/audio/upload", nodeFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { data: data.data, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to upload audio",
    }
  }
}
