import Image from "next/image";
import Link from "next/link";
import { getAccessToken } from "@/lib/session";

export default async function Home() {
  const token = await getAccessToken();

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black p-8">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-12 text-center bg-white dark:bg-zinc-950 p-12 rounded-3xl shadow-xl dark:border dark:border-zinc-800">
        <Image
          className="dark:invert mb-8"
          src="/next.svg"
          alt="Next.js logo"
          width={150}
          height={30}
          priority
        />

        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
          Audio App Auth
        </h1>

        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-lg">
          Welcome to the Next.js frontend with complete server-action based
          authentication integrating with NestJS.
        </p>

        <div className="flex gap-4 mt-8">
          {token ? (
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 bg-white text-zinc-900 border border-zinc-200 font-medium rounded-lg hover:bg-zinc-50 dark:bg-zinc-900 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-800 transition-colors shadow-sm"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
