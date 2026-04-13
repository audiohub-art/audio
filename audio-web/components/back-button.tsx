"use client"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"

export const BackButton: React.FC = () => {
  const router = useRouter()
  return (
    <aside className="w-1/2 lg:w-24 p-6 flex-col items-center md:flex sticky top-0 h-screen overflow-hidden">
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="p-4 rounded-xl transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent/50 [&_svg]:size-8"
      >
        <ArrowLeft />
      </Button>
    </aside>
  )
}
