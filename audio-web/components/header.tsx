"use client";
import type { User } from "@/types/user"
import Image from "next/image";
import Link from "next/link";
import { CircleUserRound } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { signOut } from "next-auth/react";

export const Header: React.FC<{ user: User | undefined; }> = ({ user }) => {

  return (
    <header className="text-primary-secondary py-2 px-2 sm:py-3 sm:px-6 flex items-center justify-between shadow-xl dark:border dark:border-zinc-800 select-none">
        <div className="flex items-center gap-2 sm:gap-4 p-1 sm:p-3">
          <Image src="/audio.svg" alt="AudioHub" width={50} height={50} />
          <Link href="/" className="text-white hover:text-primary">
            <h1 className="text-base sm:text-2xl font-bold -ml-1 sm:ml-0">AudioHub</h1>
          </Link>
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger >
            <div className="flex items-center gap-1.5">
              <CircleUserRound className="w-8 h-8 text-muted-forground" strokeWidth={1} />
          </div>
          </DropdownMenuTrigger>
        <DropdownMenuContent asChild>
          {user ? (
            <DropdownMenuItem onSelect={() => signOut({ redirectTo: "/" })}>Sign Out</DropdownMenuItem>
          ) : (
              <DropdownMenuItem asChild>
                <Link href={"/login"}>
                  Sign In
                </Link>
              </DropdownMenuItem>
          )}
          </DropdownMenuContent>
        </DropdownMenu>
    </header>
  )
}
