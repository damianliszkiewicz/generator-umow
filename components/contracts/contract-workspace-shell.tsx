import type { ReactNode } from "react";
import Link from "next/link";

import type { WizardStep } from "@/lib/contracts/schemas";
import { wizardStepLabels } from "@/lib/contracts/schemas";
import { AppHeader } from "@/components/layout/app-header";
import { ContractStepProgress } from "@/components/contracts/contract-step-progress";

type ContractWorkspaceShellProps = {
  currentStep: WizardStep;
  note?: string;
  children: ReactNode;
};

export function ContractWorkspaceShell({ currentStep, note, children }: ContractWorkspaceShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <AppHeader />

      <nav className="flex items-center gap-2 text-sm">
        <Link
          href="/dashboard"
          className="font-medium text-[color:var(--dashboard-muted)] transition-colors hover:text-[color:var(--dashboard-text)]"
        >
          ← Moje umowy
        </Link>
        <span className="text-[color:var(--dashboard-border)]">/</span>
        <span className="font-medium text-[color:var(--dashboard-text)]">{wizardStepLabels[currentStep]}</span>
      </nav>

      <div className="flex gap-6 lg:gap-8">
        <ContractStepProgress currentStep={currentStep} note={note} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
