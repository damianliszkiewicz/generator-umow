import { auth } from "@clerk/nextjs/server";
import { FileText, Info } from "lucide-react";
import { redirect } from "next/navigation";

import { ContractWorkspaceShell } from "@/components/contracts/contract-workspace-shell";
import { NewContractForm } from "@/components/contracts/new-contract-form";

export default async function NewContractPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(124,92,255,0.12),_transparent_28%),linear-gradient(180deg,_#fbf9f5_0%,_var(--dashboard-page)_100%)]">
      <ContractWorkspaceShell
        currentStep="sprzedajacy"
        note="Wprowadzone dane zapiszą się jako szkic po przejściu do kolejnego kroku. Przed kontynuowaniem sprawdź zgodność danych z dokumentem tożsamości."
      >
        <NewContractForm />

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-[color:var(--dashboard-border)] bg-white/88 p-5 shadow-[0_8px_24px_rgba(38,34,27,0.04)]">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-[color:var(--dashboard-accent-soft)] p-2.5">
                <FileText className="h-5 w-5 text-[color:var(--dashboard-accent)]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[color:var(--dashboard-text)]">Dokumenty tożsamości</h2>
                <p className="mt-1 text-sm leading-6 text-[color:var(--dashboard-muted)]">
                  Upewnij się, że dane sprzedającego są zgodne z dowodem osobistym lub paszportem.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-[color:var(--dashboard-border)] bg-white/88 p-5 shadow-[0_8px_24px_rgba(38,34,27,0.04)]">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-[color:var(--dashboard-accent-soft)] p-2.5">
                <Info className="h-5 w-5 text-[color:var(--dashboard-accent)]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[color:var(--dashboard-text)]">Jak przebiega dalej proces</h2>
                <p className="mt-1 text-sm leading-6 text-[color:var(--dashboard-muted)]">
                  W kolejnym kroku uzupełnisz dane kupującego, a potem informacje o pojeździe, warunkach sprzedaży i oświadczeniach stron.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ContractWorkspaceShell>
    </main>
  );
}
