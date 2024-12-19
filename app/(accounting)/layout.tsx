import type { Metadata } from "next";
import Sidebar from "@/app/layout/Sidebar";
import { getUserData } from "../functions/getUserData";

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
        <div className="flex">
            <Sidebar session={session} />
            <main className="flex-1 md:ml-64 p-4">
                {children}
            </main>
        </div>
    );
}