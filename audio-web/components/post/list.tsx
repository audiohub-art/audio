"use client";
import Masonry from "react-masonry-css"
import { Post } from "@/types/post"
import { PostCard } from "./card"

const breakpoints = {
  default: 4,
  1024: 3,
  640: 2,
  400: 1,
}

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <Masonry
      breakpointCols={breakpoints}
      className="flex w-auto -ml-4"
      columnClassName="pl-4 bg-clip-padding flex flex-col gap-4"
    >
      {posts.map((post) => (
        <div key={post.id} className="break-inside-avoid">
          <PostCard post={post} />
        </div>
      ))}
    </Masonry>
  )
}
