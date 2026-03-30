import type { WizardStep } from "@/lib/contracts/schemas";
import { wizardStepLabels, wizardStepOrder } from "@/lib/contracts/schemas";

type ContractStepProgressProps = {
  currentStep: WizardStep;
  note?: string;
};

export function ContractStepProgress({ currentStep, note }: ContractStepProgressProps) {
  const currentStepIndex = wizardStepOrder.indexOf(currentStep);
  const currentStepNumber = currentStepIndex + 1;
  const progressWidth = `${(currentStepNumber / wizardStepOrder.length) * 100}%`;

  return (
    <>
      <aside className="hidden w-80 flex-shrink-0 lg:block">
        <nav className="sticky top-8 space-y-4">
          <div className="rounded-[28px] border border-[color:var(--dashboard-border)] bg-white/82 p-5 shadow-[0_8px_24px_rgba(38,34,27,0.04)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dashboard-muted)]">
              Kroki generowania umowy
            </p>
            <p className="mt-3 text-sm leading-6 text-[color:var(--dashboard-muted)]">
              Poruszaj się po kolejnych sekcjach i pilnuj kompletności szkicu przed podglądem PDF.
            </p>
          </div>

          <div className="space-y-1">
            <ul className="space-y-2 rounded-[28px] border border-[color:var(--dashboard-border)] bg-white/82 p-4 shadow-[0_8px_24px_rgba(38,34,27,0.04)] backdrop-blur">
              {wizardStepOrder.map((step, index) => {
                const isCurrent = step === currentStep;
                const isComplete = index < currentStepIndex;

                return (
                  <li key={step}>
                    <div
                      className={[
                        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                        isCurrent
                          ? "border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-accent-soft)] text-[color:var(--dashboard-text)]"
                          : isComplete
                            ? "border border-transparent bg-white/70 text-[color:var(--dashboard-text)]"
                            : "border border-transparent text-[color:var(--dashboard-muted)]",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                          isCurrent
                            ? "bg-[color:var(--dashboard-accent)] text-white"
                            : isComplete
                              ? "bg-[color:var(--dashboard-text)] text-white"
                              : "border border-[color:var(--dashboard-border)] bg-white text-[color:var(--dashboard-muted)]",
                        ].join(" ")}
                      >
                        {index + 1}
                      </span>
                      {wizardStepLabels[step]}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {note ? (
            <div className="rounded-[28px] border border-[color:var(--dashboard-border)] bg-white/82 px-5 py-5 shadow-[0_8px_24px_rgba(38,34,27,0.04)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dashboard-muted)]">Wskazówka</p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--dashboard-muted)]">{note}</p>
            </div>
          ) : null}
        </nav>
      </aside>

      <div className="mb-6 rounded-[24px] border border-[color:var(--dashboard-border)] bg-white/82 p-4 shadow-[0_8px_24px_rgba(38,34,27,0.04)] backdrop-blur lg:hidden">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dashboard-muted)]">
            Krok {currentStepNumber} z {wizardStepOrder.length}
          </p>
          <p className="text-xs font-semibold text-[color:var(--dashboard-text)]">{wizardStepLabels[currentStep]}</p>
        </div>
        <div className="h-2 w-full rounded-full bg-[color:var(--dashboard-accent-soft)]">
          <div className="h-2 rounded-full bg-[color:var(--dashboard-accent)]" style={{ width: progressWidth }} />
        </div>
      </div>
    </>
  );
}