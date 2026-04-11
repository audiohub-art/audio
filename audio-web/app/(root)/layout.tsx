import { Sidebar } from "@/components/side-bar";
import { getUser } from "@/services/user";
//import { Footer } from "@/components/footer"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  return (
    <>
      <Sidebar user={user} />
      {children}
    </>
  );
}
