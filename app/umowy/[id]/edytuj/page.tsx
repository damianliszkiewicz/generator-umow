import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ContractWorkspaceShell } from "@/components/contracts/contract-workspace-shell";
import { EditContractWizard } from "@/components/contracts/edit-contract-wizard";
import { normalizeStep } from "@/lib/contracts/schemas";

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
  const currentStep = normalizeStep(step);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(124,92,255,0.12),_transparent_28%),linear-gradient(180deg,_#fbf9f5_0%,_var(--dashboard-page)_100%)]">
      <ContractWorkspaceShell
        currentStep={currentStep}
        note="Każdy krok zapisuje dane szkicu. Po uzupełnieniu sekcji przejdź dalej, aby sprawdzić podgląd i wygenerować PDF."
      >
        <EditContractWizard contractId={id} stepFromUrl={step} />
      </ContractWorkspaceShell>
    </main>
  );
}
