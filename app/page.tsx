import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(124,92,255,0.16),_transparent_28%),linear-gradient(180deg,_#fbf9f5_0%,_var(--dashboard-page)_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-7xl items-center gap-6 lg:grid-cols-[minmax(0,1.15fr)_380px]">
        <Card className="overflow-hidden rounded-[32px] border-[color:var(--dashboard-border)] bg-white/88 p-0 backdrop-blur">
          <div className="grid gap-8 p-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:p-10">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--dashboard-muted)]">Polska • MVP</p>
                <h1 className="max-w-xl text-4xl font-semibold tracking-[-0.04em] text-[color:var(--dashboard-text)] sm:text-5xl">
                  Generator umowy kupna-sprzedaży samochodu w spójnym workflow.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[color:var(--dashboard-muted)]">
                  Zbieraj dane stron, pojazdu i warunków sprzedaży, zapisuj szkice, sprawdzaj podgląd i generuj PDF bez ręcznego składania dokumentu.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/sign-in">
                  <Button className="px-6">Zaloguj się</Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="secondary" className="px-6">Utwórz konto</Button>
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <FeatureStat label="Kroki formularza" value="5" />
                <FeatureStat label="Zapis szkicu" value="Automatyczny" />
                <FeatureStat label="Eksport" value="PDF" />
              </div>
            </div>

            <div className="rounded-[28px] border border-[color:var(--dashboard-border)] bg-[linear-gradient(180deg,_rgba(255,255,255,0.9),_rgba(241,236,255,0.92))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-[color:var(--dashboard-border)] bg-white px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--dashboard-muted)]">Workflow</p>
                    <p className="text-sm font-semibold text-[color:var(--dashboard-text)]">Od szkicu do PDF</p>
                  </div>
                  <span className="rounded-full bg-[color:var(--dashboard-accent-soft)] px-2.5 py-1 text-xs font-semibold text-[color:var(--dashboard-accent)]">Gotowe</span>
                </div>
                <div className="space-y-3">
                  {[
                    "Dane sprzedającego i kupującego",
                    "Opis pojazdu z VIN i rejestracją",
                    "Warunki sprzedaży i przekazania",
                    "Podgląd zgodny z dokumentem PDF",
                  ].map((item, index) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-[color:var(--dashboard-border)] bg-white/80 px-4 py-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--dashboard-accent)] text-xs font-semibold text-white">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-6 text-[color:var(--dashboard-text)]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-4 rounded-[32px] border-[color:var(--dashboard-border)] bg-white/88 p-6 backdrop-blur">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--dashboard-muted)]">Dlaczego to działa</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--dashboard-text)]">Jedna aplikacja, jeden język wizualny.</h2>
          </div>
          <div className="space-y-3">
            <FeatureBullet text="Spójne formularze, dashboard i podgląd dokumentu." />
            <FeatureBullet text="Czytelny postęp kroków i szybki powrót do edycji." />
            <FeatureBullet text="Wyraźne priorytety akcji bez nadmiarowych elementów." />
          </div>
        </Card>
      </div>
    </main>
  );
}

function FeatureStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--dashboard-border)] bg-white/80 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--dashboard-muted)]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[color:var(--dashboard-text)]">{value}</p>
    </div>
  );
}

function FeatureBullet({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[color:var(--dashboard-border)] bg-white/80 px-4 py-3">
      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[color:var(--dashboard-accent)]" />
      <p className="text-sm leading-6 text-[color:var(--dashboard-text)]">{text}</p>
    </div>
  );
}
