import { Eye, FileText, Printer } from "lucide-react";

import { AgreementPdfDownloadButton } from "@/components/contracts/agreement-pdf-download-button";
import { AgreementPreview } from "@/components/contracts/agreement-preview";
import { PublicSiteShell } from "@/components/marketing/public-site-shell";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import {
  sampleAgreementGeneratedAtDisplay,
  sampleAgreementPdfFileName,
  sampleAgreementViewModel,
} from "@/lib/contracts/sample-contract";

export function PublicSampleAgreementPage() {
  return (
    <PublicSiteShell>
      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <Card className="rounded-[30px] border-[color:var(--dashboard-border)] bg-white/84 p-6 shadow-[0_18px_50px_rgba(38,34,27,0.05)] backdrop-blur">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--dashboard-muted)]">
                  Przykładowa umowa
                </p>
                <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-[color:var(--dashboard-text)] sm:text-4xl">
                  Publiczny podgląd końcowego dokumentu przed wydrukiem.
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-[color:var(--dashboard-muted)] sm:text-base">
                  Ten ekran pokazuje przykładowy efekt pracy w aplikacji. Ten sam szablon danych zasila podgląd i
                  generowanie PDF, więc możesz ocenić układ umowy jeszcze przed założeniem konta.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <LinkButton href="/" variant="secondary">
                  Wróć do strony głównej
                </LinkButton>
                <AgreementPdfDownloadButton
                  fileName={sampleAgreementPdfFileName}
                  idleLabel="Pobierz przykładowy PDF"
                  loadingLabel="Generuję przykładowy PDF..."
                  viewModel={sampleAgreementViewModel}
                  wrapperClassName="max-w-[15rem]"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <MetaBadge icon={Eye} label="Przykład publiczny" />
              <MetaBadge icon={FileText} label="Ta sama struktura co podgląd użytkownika" />
              <MetaBadge icon={Printer} label={`Wygenerowano: ${sampleAgreementGeneratedAtDisplay}`} />
            </div>
          </Card>

          <AgreementPreview
            footerMetadata={{
              documentBadge: "Przykład publiczny",
              documentLabel: "Umowa kupna-sprzedaży pojazdu",
              generatedAtDisplay: sampleAgreementGeneratedAtDisplay,
              pageIndicator: "Strona 1 / 1",
            }}
            viewModel={sampleAgreementViewModel}
          />
        </div>
      </section>
    </PublicSiteShell>
  );
}

function MetaBadge({ icon: Icon, label }: { icon: typeof Eye; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--dashboard-border)] bg-white px-3 py-1 text-xs font-semibold text-[color:var(--dashboard-muted)]">
      <Icon className="h-3.5 w-3.5 text-[color:var(--dashboard-accent)]" />
      {label}
    </span>
  );
}
