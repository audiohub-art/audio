import Image from "next/image";
import Link from "next/link";

export default async function Home() {

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


      </main>
    </div>
  );
}
