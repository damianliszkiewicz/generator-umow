import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { EditContractWizard } from "@/components/contracts/edit-contract-wizard";

type EditContractPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ step?: string }>;
};

export default async function EditContractPage({ params, searchParams }: EditContractPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const { step } = await searchParams;

  return (
    <main className="min-h-screen bg-zinc-100 p-6">
      <div className="mx-auto w-full max-w-5xl">
        <EditContractWizard contractId={id} stepFromUrl={step} />
      </div>
    </main>
  );
}
