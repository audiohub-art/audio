import { getAllPosts } from "@/services/post";
import { SearchX } from "lucide-react";
import { PostList } from "@/components/post/list"

export default async function Home() {
  const { data, error } = await getAllPosts();
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black p-8">
      {data && data.length > 0 ? (
        <div className="w-full max-w-[2000px] mx-auto min-h-screen p-4 md:p-6 lg:p-8">
          <PostList posts={data} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-5">
            <SearchX className="h-8 w-8 text-muted-foreground"/>
          </div>
        </div>
      )
      }
    </div>
  );
}
