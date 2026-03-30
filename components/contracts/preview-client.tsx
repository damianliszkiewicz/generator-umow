"use client";

import { useEffect, useState } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import Link from "next/link";

import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { AgreementPreview } from "@/components/contracts/agreement-preview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mapContractToViewModel } from "@/lib/contracts/view-model";

export function PreviewClient({ contractId }: { contractId: string }) {
  const [hasMounted, setHasMounted] = useState(false);
  const { isLoading, isAuthenticated } = useConvexAuth();
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [generatedAtDisplay, setGeneratedAtDisplay] = useState("");
  const typedContractId = contractId as Id<"contracts">;
  const contract = useQuery(
    api.contracts.getById,
    hasMounted && isAuthenticated ? { contractId: typedContractId } : "skip",
  );

  useEffect(() => {
    setHasMounted(true);
    setGeneratedAtDisplay(
      new Intl.DateTimeFormat("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    );
  }, []);

  async function handlePdfDownload() {
    setIsDownloadingPdf(true);
    setDownloadError(null);

    try {
      const response = await fetch(`/api/umowy/${contractId}/pdf`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Nie udało się wygenerować dokumentu PDF.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${contractId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setDownloadError("Nie udało się wygenerować dokumentu do druku. Spróbuj ponownie.");
    } finally {
      setIsDownloadingPdf(false);
    }
  }

  if (!hasMounted || isLoading) {
    return <p className="text-sm text-[color:var(--dashboard-muted)]">Ładowanie sesji...</p>;
  }

  if (!isAuthenticated) {
    return <p className="text-sm text-[color:var(--dashboard-muted)]">Sesja nie jest jeszcze gotowa. Odśwież stronę za chwilę.</p>;
  }
  if (contract === undefined) {
    return <p className="text-sm text-[color:var(--dashboard-muted)]">Ładowanie podglądu...</p>;
  }

  if (!contract) {
    return <p className="text-sm text-[color:var(--dashboard-muted)]">Nie znaleziono umowy.</p>;
  }

  const viewModel = mapContractToViewModel(contract as Doc<"contracts">);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <Card className="rounded-[28px] border-[color:var(--dashboard-border)] bg-white/84 p-6 backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dashboard-muted)]">Podgląd umowy</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[color:var(--dashboard-text)]">{viewModel.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--dashboard-muted)]">
              Sprawdź układ dokumentu przed wygenerowaniem PDF. Widok korzysta z tej samej estetyki co dashboard i formularze, ale zachowuje formalny wygląd samego dokumentu.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/umowy/${contractId}/edytuj?step=oswiadczenia`}>
              <Button variant="secondary">Wróć do edycji</Button>
            </Link>
            <Button onClick={handlePdfDownload} disabled={isDownloadingPdf}>
              {isDownloadingPdf ? "Generuję dokument do druku..." : "Pobierz PDF"}
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-[color:var(--dashboard-accent-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--dashboard-accent)]">PDF</span>
          <span className="rounded-full border border-[color:var(--dashboard-border)] bg-white px-3 py-1 text-xs font-semibold text-[color:var(--dashboard-muted)]">Wygenerowano: {generatedAtDisplay}</span>
        </div>
        {downloadError ? <p className="mt-3 text-sm text-[color:var(--dashboard-danger)]">{downloadError}</p> : null}
      </Card>

      <AgreementPreview
        viewModel={viewModel}
        footerMetadata={{
          generatedAtDisplay,
          documentLabel: "Umowa kupna-sprzedaży pojazdu",
          pageIndicator: "Strona 1 / 1",
          documentBadge: "Podgląd",
        }}
      />
    </div>
  );
}
