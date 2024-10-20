import type { Metadata } from "next";
import "@/app/globals.css";
import Navbar from "@/app/layout/Navbar";
import 'react-toastify/dist/ReactToastify.css';
import { getUserData } from "@/app/functions/getUserData";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getUserData();
  return (
    <>
        <Navbar session={session} />
        {children}
    </>
  );
}