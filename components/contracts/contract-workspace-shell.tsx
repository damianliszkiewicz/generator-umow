import type { ReactNode } from "react";

import type { WizardStep } from "@/lib/contracts/schemas";

import { ContractStepProgress } from "@/components/contracts/contract-step-progress";

type ContractWorkspaceShellProps = {
  currentStep: WizardStep;
  note?: string;
  children: ReactNode;
};

export function ContractWorkspaceShell({ currentStep, note, children }: ContractWorkspaceShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1360px] gap-6 px-4 py-6 sm:px-6 lg:gap-8 lg:px-8 lg:py-8">
      <ContractStepProgress currentStep={currentStep} note={note} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}