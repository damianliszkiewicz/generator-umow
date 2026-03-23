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
    <main className="min-h-screen bg-zinc-100 p-6">
      <PreviewClient contractId={id} />
    </main>
  );
}
