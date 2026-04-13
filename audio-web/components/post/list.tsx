"use client";
import Masonry from "react-masonry-css"
import { Post } from "@/types/post"
import { PostCard } from "./card"
import { BlurFade } from "../ui/blur-fade";
import { BigPostCard } from "./big-card";

const breakpoints = {
  default: 4,
  1024: 3,
  640: 2,
  400: 1,
}

export function PostList({ posts, featuredPost }: { posts: Post[], featuredPost?: Post }) {

  const items = featuredPost
      ? [{ ...featuredPost, featured: true }, ...posts]
      : posts
  return (
    <Masonry
      breakpointCols={breakpoints}
      className="flex w-auto -ml-4"
      columnClassName="pl-4 bg-clip-padding flex flex-col gap-4"
    >
      {items.map((post, i) => (
        "featured" in post && post.featured ? (
          <div key={post.id} className="col-span-2">
            <BigPostCard post={post} />
          </div>
        ) :
        <BlurFade key={post.id} duration={0.25 + i * 0.01}>
        <div className="break-inside-avoid">
          <PostCard post={post} />
          </div>
        </BlurFade>
      ))}
    </Masonry>
  )
}
