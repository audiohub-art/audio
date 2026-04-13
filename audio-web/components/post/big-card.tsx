import { Post } from "@/types/post";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";

export function BigPostCard({ post }: { post: Post }) {
  return (
    <Card className="w-full shadow-xl dark:border-zinc-800 transition-all hover:shadow-2xl">
          <div className="w-full h-72 bg-muted rounded-t-xl" />
          <CardHeader>
            <CardTitle className="text-2xl">{post.title}</CardTitle>
            <CardDescription>{post.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{post.description}</p>
          </CardContent>
        </Card>
  )
}
