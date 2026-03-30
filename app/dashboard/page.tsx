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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(124,92,255,0.12),_transparent_28%),linear-gradient(180deg,_#fbf9f5_0%,_var(--dashboard-page)_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex items-center justify-between rounded-2xl border border-[color:var(--dashboard-border)] bg-white/70 px-4 py-3 shadow-[0_1px_2px_rgba(38,34,27,0.04)] backdrop-blur sm:px-5">
          <Link href="/" className="text-sm font-medium text-[color:var(--dashboard-muted)] transition-colors hover:text-[color:var(--dashboard-text)]">
            Generator umow
          </Link>
          <UserButton afterSignOutUrl="/" />
        </header>
        <DashboardClient />
      </div>
    </main>
  );
}
