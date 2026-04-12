"use client";
import type { User } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import {
  CircleUserRound,
  Bolt,
  Home,
  AudioLines,
  PlusSquare,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOut } from "next-auth/react";

export const Sidebar: React.FC<{ user: User | undefined }> = ({ user }) => {
  const path = usePathname();
  return (
    <aside className="w-1/3 lg:w-24 p-6 flex-col items-center border-r border-border h-screen sticky top-0 overflow-y-auto hidden md:flex">
      <div className="flex flex-col items-center gap-12 w-full">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Image src="/audio.svg" alt="AudioHub" width={46} height={46} />
        </Link>
        <nav className="flex flex-col items-center gap-6 mt-4">
          <Link
            href="/"
            className={`p-3 rounded-xl transition-all duration-200 ${
              path === "/"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            <Home className="w-7 h-7" strokeWidth={path === "/" ? 2.5 : 2} />
          </Link>
          <Link
            href="/post"
            className={`p-3 rounded-xl transition-all duration-200 ${
              path === "/post"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            <AudioLines
              className="w-7 h-7"
              strokeWidth={path === "/post" ? 2.5 : 2}
            />
          </Link>
          <Link
            href="/post/create"
            className={`p-3 rounded-xl transition-all duration-200 ${
              path === "/post/create"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            <PlusSquare
              className="w-7 h-7"
              strokeWidth={path === "/post/create" ? 2.5 : 2}
            />
          </Link>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none rounded-full focus-visible:ring-2 focus-visible:ring-ring">
              <div className="flex items-center justify-center transition-opacity hover:opacity-80">
                <CircleUserRound className="w-[40px] h-[40px] text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent asChild>
              {user ? (
                <DropdownMenuItem onSelect={() => signOut({ redirectTo: "/" })}>
                  Sign Out
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href={"/login"}>Sign In</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
      <div className="mt-auto w-full flex flex-col items-center">
        <Bolt className="w-[40px] h-[40px] text-accent-foreground" />
      </div>
    </aside>
  );
};
