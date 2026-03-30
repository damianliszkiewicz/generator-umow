import type { AgreementViewModel } from "@/lib/contracts/view-model";
import type { AgreementPdfFooterMetadata } from "@/components/contracts/agreement-pdf-html-document";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AgreementPreviewProps = {
  viewModel: AgreementViewModel;
  footerMetadata?: AgreementPdfFooterMetadata;
};

export function AgreementPreview({ viewModel, footerMetadata }: AgreementPreviewProps) {
  const saleDetailItems = viewModel.saleDetails.filter(
    (item) => item.label !== "Cena sprzedaży" && item.label !== "Słownie",
  );
  const supplementarySectionStart = 5;

  return (
    <div className="mx-auto w-full max-w-[210mm]">
      <Card className="overflow-hidden border-zinc-200 bg-white p-0 shadow-sm print:border-none print:shadow-none">
        <div
          className="flex min-h-[297mm] flex-col px-4 py-4 text-zinc-900 sm:px-5 md:px-6"
          style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, "Segoe UI", sans-serif' }}
        >
          <div className="flex flex-col gap-2 border-b border-zinc-900 pb-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                Dokument prywatny
              </p>
              <h1 className="text-[1.05rem] font-extrabold uppercase tracking-[0.03em] text-zinc-950 sm:text-[1.15rem]">
                Umowa kupna-sprzedaży pojazdu
              </h1>
            </div>

            <div className="text-left sm:w-44 sm:text-right">
              <p className="text-sm font-bold text-zinc-900">{viewModel.documentLocationAndDateLine}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                {footerMetadata?.documentBadge ?? viewModel.title}
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            <DocumentSection index="§ 1" title="Strony umowy">
              <div className="grid gap-3 md:grid-cols-2">
                <PartyCard heading="Sprzedający" party={viewModel.sellerDetails} />
                <PartyCard heading="Kupujący" party={viewModel.buyerDetails} />
              </div>
            </DocumentSection>

            <DocumentSection index="§ 2" title="Przedmiot umowy">
              <div className="grid gap-x-3 gap-y-2 rounded-sm border border-zinc-300 p-3 sm:grid-cols-2 lg:grid-cols-4">
                {viewModel.vehicleDetails.map((item) => (
                  <DetailRow key={item.label} item={item} />
                ))}
              </div>
            </DocumentSection>

            <DocumentSection index="§ 3" title="Cena i płatność">
              <div className="flex flex-col gap-3 rounded-sm border border-zinc-900 p-3 text-zinc-900 lg:flex-row lg:items-start">
                <div className="lg:w-[38%]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    Cena sprzedaży
                  </p>
                  <p className="mt-1 text-[1.7rem] font-extrabold tracking-tight text-zinc-900">
                    {viewModel.priceDisplay}
                  </p>
                </div>

                <div className="flex-1">
                  <p className="text-[12px] italic leading-4 text-zinc-600">{viewModel.priceWords}</p>
                  <div className="mt-2 grid gap-1.5">
                    {saleDetailItems.map((item) => (
                      <SaleDetailRow key={item.label} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            </DocumentSection>

            <DocumentSection index="§ 4" title="Oświadczenia stron">
              <ol className="grid gap-1">
                {viewModel.declarations.map((item, index) => (
                  <li key={item.label} className="flex gap-2 text-[12px] leading-4.5 text-zinc-700">
                    <span className="min-w-3 font-extrabold text-zinc-900">
                      {index + 1}
                    </span>
                    <p className="min-w-0">
                      {item.label} <span className="font-bold text-zinc-900">({item.value})</span>
                    </p>
                  </li>
                ))}
              </ol>
            </DocumentSection>

            {viewModel.supplementarySections.map((section, index) => (
              <DocumentSection
                key={section.title}
                index={`§ ${supplementarySectionStart + index}`}
                title={section.title}
                className={section.title === "Postanowienia końcowe" ? undefined : "flex min-h-0 flex-col"}
              >
                <div className="flex min-h-0 flex-1 border border-zinc-300 p-3">
                  <p className="min-h-6 text-[12px] leading-4.5 text-zinc-800">{section.content}</p>
                </div>
              </DocumentSection>
            ))}
          </div>

          <div className="mt-3 flex flex-1 flex-col">
            <div className="mt-3">
              <section className="grid min-h-[5rem] grid-cols-1 items-end gap-8 md:grid-cols-2">
                <SignatureBox label="Czytelny podpis sprzedającego" />
                <SignatureBox label="Czytelny podpis kupującego" />
              </section>

              {footerMetadata ? <FooterMetadata footerMetadata={footerMetadata} /> : null}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function DocumentSection({
  index,
  title,
  children,
  className,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="inline-flex items-center justify-center border border-zinc-900 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-zinc-900">
          {index}
        </span>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function PartyCard({
  heading,
  party,
}: {
  heading: string;
  party: AgreementViewModel["sellerDetails"];
}) {
  return (
    <div className="rounded-sm border border-zinc-300 bg-white p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">{heading}</p>
      <div className="mt-1 space-y-0.5 text-[12px] leading-4.5 text-zinc-700">
        <p className="text-[14px] font-extrabold text-zinc-900">{party.fullName}</p>
        {party.details.map((item) => (
          <p key={item}>{item}</p>
        ))}
        <p>{party.addressLine}</p>
      </div>
    </div>
  );
}

function DetailRow({ item }: { item: AgreementViewModel["vehicleDetails"][number] }) {
  const spanClass = item.label === "Marka i model" || item.label === "Numer VIN" ? "lg:col-span-2" : undefined;

  return (
    <div className={cn("border-t border-zinc-100 pt-1", spanClass)}>
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-zinc-400">{compactVehicleLabel(item.label)}</p>
      <p className={item.mono ? "mt-0.5 font-mono text-[13px] font-extrabold tracking-tight text-zinc-900" : "mt-0.5 text-[13px] font-extrabold text-zinc-900"}>
        {item.value}
      </p>
    </div>
  );
}

function SaleDetailRow({ item }: { item: AgreementViewModel["saleDetails"][number] }) {
  return (
    <div className="flex items-start justify-between gap-3 border-t border-zinc-100 pt-1.5 text-[12px] leading-4.5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-zinc-400">{item.label}</p>
      <p className="text-right font-bold text-zinc-900">{item.value}</p>
    </div>
  );
}

function SignatureBox({ label }: { label: string }) {
  return (
    <div className="flex h-20 items-end">
      <div className="w-full border-t border-zinc-900 pt-2 text-center">
        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-900">{label}</p>
      </div>
    </div>
  );
}

function FooterMetadata({ footerMetadata }: { footerMetadata: AgreementPdfFooterMetadata }) {
  return (
    <footer className="grid gap-2 border-t border-zinc-200 pt-2 text-[10px] font-semibold text-zinc-500 sm:grid-cols-3 sm:items-center">
      <p>Wygenerowano: {footerMetadata.generatedAtDisplay}</p>
      <p className="uppercase tracking-[0.16em] text-zinc-500 sm:text-center">
        {footerMetadata.documentLabel}
      </p>
      <p className="sm:text-right">{footerMetadata.pageIndicator}</p>
    </footer>
  );
}

function compactVehicleLabel(label: string) {
  const compactLabels: Record<string, string> = {
    "Rok produkcji": "Rok prod.",
    "Nr rejestracyjny": "Rejestracja",
    "Data pierwszej rejestracji": "I rej.",
    "Numer karty pojazdu": "Karta poj.",
    "Pojemność silnika": "Pojemność",
    "Rodzaj paliwa": "Paliwo",
  };

  return compactLabels[label] ?? label;
}
