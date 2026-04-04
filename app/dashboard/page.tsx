import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { DashboardClient } from "@/components/contracts/dashboard-client";
import { AppHeader } from "@/components/layout/app-header";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(124,92,255,0.12),_transparent_28%),linear-gradient(180deg,_#fbf9f5_0%,_var(--dashboard-page)_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <AppHeader />
        <DashboardClient />
      </div>
    </main>
  );
}
