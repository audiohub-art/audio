import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Post } from "@/types/post"
import Link from "next/link"

export function PostCard({ post }:{ post: Post }) {
  return (
    <Link href={`/post/${post.id}`}>
    <Card className="w-full h-max shadow-xl dark:border-zinc-800 transition-all hover:shadow-2xl">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>{post.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {post.description}
        </p>
      </CardContent>
      </Card>
    </Link>
  )
}
