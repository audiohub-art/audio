import { BackButton } from "@/components/back-button";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <BackButton />
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
