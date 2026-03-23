import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardClient } from "@/components/contracts/dashboard-client";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-zinc-100 p-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-sm text-zinc-600">
            Generator umow
          </Link>
          <UserButton afterSignOutUrl="/" />
        </header>
        <DashboardClient />
      </div>
    </main>
  );
}
