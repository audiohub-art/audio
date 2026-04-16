"use client"
import { FormPost } from "@/components/post/form";
import { Button } from "@/components/ui/button";
import { createPost } from "@/services/post";
import { toast } from "sonner";
import { AudioUpload } from "@/components/post/audio-upload";

export default function post() {
  const handleCreate = async (data: { title: string, description: string }) => {
    const res = await createPost(data.title, data.description)
    if (!res.error) {
      toast.success("Post publish successfully", { position: "top-right"})
    } else {
      toast.error("Failed to publish post, please try again", { position: "top-right"})
    }
  }

  return (
    <div className="">
      <div className="border-b border-border p-6 flex justify-between items-center">
        <h1>Create Post</h1>
        <Button type="submit" form="form-post" className="">Publish</Button>
      </div>
      <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="w-full">
          <AudioUpload />
        </div>
        <FormPost onSubmit={handleCreate} />
      </div>
    </div>
  );
}
