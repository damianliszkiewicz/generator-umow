import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { NewContractForm } from "@/components/contracts/new-contract-form";

export default async function NewContractPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-zinc-100 p-6">
      <div className="mx-auto w-full max-w-5xl">
        <NewContractForm />
      </div>
    </main>
  );
}
