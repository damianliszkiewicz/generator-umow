"use client";

import { useQuery } from "convex/react";
import Link from "next/link";

import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { AgreementPreview } from "@/components/contracts/agreement-preview";
import { Button } from "@/components/ui/button";
import { mapContractToViewModel } from "@/lib/contracts/view-model";

export function PreviewClient({ contractId }: { contractId: string }) {
  const typedContractId = contractId as Id<"contracts">;
  const contract = useQuery(api.contracts.getById, { contractId: typedContractId });

  if (contract === undefined) {
    return <p>Ladowanie podgladu...</p>;
  }

  if (!contract) {
    return <p>Nie znaleziono umowy.</p>;
  }

  const viewModel = mapContractToViewModel(contract as Doc<"contracts">);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <div className="flex flex-wrap gap-2">
        <Link href={`/umowy/${contractId}/edytuj?step=oswiadczenia`}>
          <Button variant="secondary">Wroc do edycji</Button>
        </Link>
        <a href={`/api/umowy/${contractId}/pdf`} target="_blank" rel="noreferrer">
          <Button>Pobierz PDF</Button>
        </a>
      </div>
      <AgreementPreview viewModel={viewModel} />
    </div>
  );
}
