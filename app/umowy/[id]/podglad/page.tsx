import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { PreviewClient } from "@/components/contracts/preview-client";

type PreviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { id } = await params;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(124,92,255,0.12),_transparent_28%),linear-gradient(180deg,_#fbf9f5_0%,_var(--dashboard-page)_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <PreviewClient contractId={id} />
    </main>
  );
}
