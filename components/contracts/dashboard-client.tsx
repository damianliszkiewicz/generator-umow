"use client";

import Link from "next/link";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function DashboardClient() {
  const contracts = useQuery(api.contracts.listMine);

  if (contracts === undefined) {
    return <p className="text-sm text-zinc-600">Ladowanie umow...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Panel umow</h1>
          <p className="text-sm text-zinc-600">Twoje szkice i gotowe umowy.</p>
        </div>
        <Link href="/umowy/nowa">
          <Button>Nowa umowa</Button>
        </Link>
      </div>

      {contracts.length === 0 ? (
        <Card>
          <p className="text-zinc-700">Brak zapisanych umow. Utworz pierwszy szkic.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {contracts.map((contract) => (
            <Card key={contract._id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{contract.title}</p>
                <p className="text-sm text-zinc-600">
                  Status: {contract.status} | Aktualizacja: {new Date(contract.updatedAt).toLocaleString("pl-PL")}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/umowy/${contract._id}/edytuj?step=sprzedajacy`}>
                  <Button variant="secondary" size="sm">
                    Edytuj
                  </Button>
                </Link>
                <Link href={`/umowy/${contract._id}/podglad`}>
                  <Button variant="outline" size="sm">
                    Podglad
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
