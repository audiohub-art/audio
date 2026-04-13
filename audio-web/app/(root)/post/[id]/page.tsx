import { getPost, getAllPosts } from "@/services/post";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { PostList } from "@/components/post/list";

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: PostPageProps) {
  const { id } = await params;
  const [{ data, error }, { data: posts }] = await Promise.all([
     getPost(id),
     getAllPosts(),
   ])
  console.log(error)
  if (error || !data) {
    return (
      <Empty>
            <EmptyHeader>
              <EmptyTitle>404 - Not Found</EmptyTitle>
              <EmptyDescription>
                The page you&apos;re looking for doesn&apos;t exist. Try searching for
                what you need below.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
    )
  }
  const otherPosts = posts?.filter((p) => p.id !== data.id) ?? []
  return (
    <div className="w-19/20">
      <PostList posts={otherPosts} featuredPost={data}/>
    </div>
  )
}
