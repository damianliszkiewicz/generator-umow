import type { ReactNode } from "react";
import { ArrowRight, CheckCircle2, Clock3, FileText, FolderClock, PenSquare, Printer } from "lucide-react";

import { PublicSiteShell } from "@/components/marketing/public-site-shell";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import {
  sampleAgreementGeneratedAtDisplay,
  sampleAgreementViewModel,
} from "@/lib/contracts/sample-contract";

const navItems = [
  { href: "#podglad-pdf", label: "Podgląd PDF" },
  { href: "#jak-to-dziala", label: "Jak to działa" },
  { href: "#zalety", label: "Zalety" },
];

const steps = [
  {
    title: "Uzupełnij dane stron i pojazdu",
    description: "Formularz prowadzi przez dane sprzedającego, kupującego, pojazdu oraz warunki sprzedaży.",
    number: "01",
  },
  {
    title: "Zapisz szkic i wróć do niego później",
    description: "Możesz przerwać pracę i dokończyć umowę z poziomu dashboardu bez ponownego wpisywania danych.",
    number: "02",
  },
  {
    title: "Sprawdź podgląd i pobierz PDF",
    description: "Podgląd i plik do druku korzystają z tego samego źródła danych, więc końcowy dokument nie zaskakuje.",
    number: "03",
  },
];

const benefits = [
  {
    icon: PenSquare,
    title: "Jeden workflow dla całej umowy",
    description: "Od pierwszego pola do gotowego dokumentu poruszasz się po jednym, spójnym procesie zamiast kilku osobnych ekranów.",
  },
  {
    icon: FolderClock,
    title: "Szkice i historia dokumentów",
    description: "Aplikacja zapisuje umowy i pozwala wracać do nich później z poziomu dashboardu.",
  },
  {
    icon: FileText,
    title: "Podgląd zgodny z dokumentem",
    description: "To, co sprawdzasz przed pobraniem PDF, odpowiada temu samemu zestawowi danych i tej samej strukturze umowy.",
  },
  {
    icon: Printer,
    title: "PDF gotowy do druku",
    description: "Po zakończeniu edycji pobierasz dokument przygotowany do wydruku i podpisu przez obie strony.",
  },
];

const vehicleHighlights = sampleAgreementViewModel.vehicleDetails.slice(0, 4);
const saleHighlights = sampleAgreementViewModel.saleDetails.filter(
  (detail) => detail.label !== "Cena sprzedaży" && detail.label !== "Słownie",
);

export function PublicLandingPage() {
  return (
    <PublicSiteShell navItems={navItems}>
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="inline-flex items-center gap-2 border border-[color:var(--dashboard-accent)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-[color:var(--dashboard-accent)]">
                Polska • sprzedaż prywatna • PDF do druku
              </p>
              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.05em] text-[color:var(--dashboard-text)] sm:text-5xl lg:text-6xl">
                Specjalistyczna umowa kupna-sprzedaży samochodu bez zgadywania układu dokumentu.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[color:var(--dashboard-muted)]">
                Wprowadzasz dane stron, pojazdu i warunków sprzedaży, zapisujesz szkic, sprawdzasz finalny
                podgląd, a potem pobierasz dokument PDF przygotowany do wydruku.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <LinkButton className="h-12 px-6 text-base font-semibold" href="/sign-up">
                Załóż konto i przygotuj umowę
              </LinkButton>
              <LinkButton
                className="h-12 px-6 text-base font-semibold"
                href="/przykladowa-umowa"
                variant="secondary"
              >
                Zobacz przykładową umowę
              </LinkButton>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <SignalCard label="Zakres MVP" value="Polska, osoba prywatna" />
              <SignalCard label="Przebieg pracy" value="Szkic → podgląd → PDF" />
              <SignalCard label="Cel końcowy" value="Dokument do podpisu" />
            </div>

            <div className="grid gap-4">
              {steps.map((step) => (
                <Card
                  key={step.number}
                  className="relative overflow-hidden rounded-[28px] border-[color:var(--dashboard-border)] bg-white/82 p-6 shadow-[0_16px_40px_rgba(38,34,27,0.05)]"
                >
                  <span className="pointer-events-none absolute -right-3 -top-5 text-6xl font-extrabold tracking-[-0.08em] text-[color:var(--dashboard-accent-soft)] sm:text-7xl">
                    {step.number}
                  </span>
                  <div className="relative flex items-start gap-4">
                    <span className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-sm bg-[color:var(--dashboard-accent-soft)] text-[color:var(--dashboard-accent)]">
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                    <div className="space-y-1">
                      <h2 className="text-lg font-extrabold tracking-[-0.02em] text-[color:var(--dashboard-text)]">
                        {step.title}
                      </h2>
                      <p className="max-w-xl text-sm leading-6 text-[color:var(--dashboard-muted)]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-5" id="podglad-pdf">
            <Card className="overflow-hidden rounded-[34px] border-[color:var(--dashboard-border)] bg-white/88 p-4 shadow-[0_28px_70px_rgba(38,34,27,0.08)] sm:p-6">
              <div className="flex flex-col gap-4 border-b border-[color:var(--dashboard-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--dashboard-muted)]">
                    Podgląd dokumentu
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[color:var(--dashboard-text)]">
                    Ten sam typ danych, ten sam finalny układ.
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-[color:var(--dashboard-accent-soft)] px-3 py-1 text-[color:var(--dashboard-accent)]">
                    Przykład publiczny
                  </span>
                  <span className="rounded-full border border-[color:var(--dashboard-border)] bg-white px-3 py-1 text-[color:var(--dashboard-muted)]">
                    Wygenerowano: {sampleAgreementGeneratedAtDisplay}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-[28px] border border-[color:var(--dashboard-border)] bg-[linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(241,236,255,0.55))] p-3 sm:p-5">
                <LandingAgreementPreviewShowcase />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <MetaCallout
                  description="Przed pobraniem PDF możesz sprawdzić, jak układają się sekcje, dane stron i podpisy."
                  icon={Clock3}
                  title="Najpierw podgląd, potem druk"
                />
                <MetaCallout
                  description="Publiczny przykład pozwala zobaczyć efekt końcowy, zanim rozpoczniesz tworzenie własnej umowy."
                  icon={ArrowRight}
                  title="Przykład bez logowania"
                />
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-y border-[color:var(--dashboard-border)] bg-white/70 px-4 py-16 sm:px-6 lg:px-8" id="jak-to-dziala">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--dashboard-muted)]">
              Jak to działa
            </p>
            <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-[color:var(--dashboard-text)] sm:text-4xl">
              Proces ułożony wokół jednej umowy, a nie wokół przypadkowych formularzy.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-[color:var(--dashboard-muted)]">
              Produkt prowadzi przez prywatną sprzedaż jednego pojazdu w Polsce: zbierasz dane, zapisujesz szkic,
              wracasz do edycji i dopiero na końcu generujesz dokument do druku.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <Card
                key={step.title}
                className="rounded-[28px] border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-page)] p-6 shadow-[0_10px_24px_rgba(38,34,27,0.03)]"
              >
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[color:var(--dashboard-accent)]">
                  {step.number}
                </p>
                <h3 className="mt-4 text-lg font-extrabold tracking-[-0.02em] text-[color:var(--dashboard-text)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--dashboard-muted)]">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8" id="zalety">
        <div className="mx-auto w-full max-w-7xl space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--dashboard-muted)]">
              Zalety aplikacji
            </p>
            <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-[color:var(--dashboard-text)] sm:text-4xl">
              Najważniejsze korzyści skupione wokół realnego efektu: gotowej umowy PDF.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <Card
                  key={benefit.title}
                  className="rounded-[30px] border-[color:var(--dashboard-border)] bg-white/88 p-6 shadow-[0_18px_40px_rgba(38,34,27,0.04)]"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-[color:var(--dashboard-accent-soft)] text-[color:var(--dashboard-accent)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-extrabold tracking-[-0.02em] text-[color:var(--dashboard-text)]">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--dashboard-muted)]">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto w-full max-w-7xl">
          <Card className="overflow-hidden rounded-[36px] border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-text)] p-8 text-white shadow-[0_24px_60px_rgba(38,34,27,0.16)] sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/60">Finalny krok</p>
                <h2 className="max-w-3xl text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
                  Zobacz przykład dokumentu, a potem przygotuj własną umowę w tym samym workflow.
                </h2>
                <p className="max-w-2xl text-base leading-7 text-white/70">
                  Landing pokazuje efekt końcowy, ale prawdziwa wartość pojawia się wtedy, gdy przejdziesz od szkicu
                  do własnego podglądu i PDF z danymi konkretnej transakcji.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <LinkButton
                  className="h-12 border-white/20 bg-white text-[color:var(--dashboard-text)] hover:bg-[color:var(--dashboard-accent-soft)]"
                  href="/przykladowa-umowa"
                  variant="outline"
                >
                  Przejdź do przykładowej umowy
                </LinkButton>
                <LinkButton
                  className="h-12 bg-[color:var(--dashboard-accent)] px-6 hover:opacity-90"
                  href="/sign-up"
                >
                  Załóż konto
                </LinkButton>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </PublicSiteShell>
  );
}

function SignalCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="rounded-[24px] border-[color:var(--dashboard-border)] bg-white/80 p-5 shadow-[0_10px_24px_rgba(38,34,27,0.03)]">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[color:var(--dashboard-muted)]">
        {label}
      </p>
      <p className="mt-3 text-sm font-semibold leading-6 text-[color:var(--dashboard-text)]">{value}</p>
    </Card>
  );
}

function MetaCallout({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: typeof Clock3;
  title: string;
}) {
  return (
    <div className="rounded-[24px] border border-[color:var(--dashboard-border)] bg-white/78 p-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-[color:var(--dashboard-accent-soft)] text-[color:var(--dashboard-accent)]">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-extrabold text-[color:var(--dashboard-text)]">{title}</p>
          <p className="mt-1 text-sm leading-6 text-[color:var(--dashboard-muted)]">{description}</p>
        </div>
      </div>
    </div>
  );
}

function LandingAgreementPreviewShowcase() {
  return (
    <div className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-[0_18px_50px_rgba(38,34,27,0.08)] sm:p-7">
      <div
        className="space-y-5 text-zinc-900"
        style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, "Segoe UI", sans-serif' }}
      >
        <div className="flex flex-col gap-2 border-b border-zinc-900 pb-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Dokument prywatny</p>
            <h3 className="text-lg font-extrabold uppercase tracking-[0.04em] text-zinc-950 sm:text-xl">
              Umowa kupna-sprzedaży pojazdu
            </h3>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm font-bold">{sampleAgreementViewModel.documentLocationAndDateLine}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
              Przykład publiczny
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="space-y-4">
            <DocumentBlock title="§ 1. Strony umowy">
              <div className="grid gap-3 sm:grid-cols-2">
                <PreviewPartyCard
                  details={sampleAgreementViewModel.sellerDetails.details}
                  heading="Sprzedający"
                  name={sampleAgreementViewModel.sellerDetails.fullName}
                />
                <PreviewPartyCard
                  details={sampleAgreementViewModel.buyerDetails.details}
                  heading="Kupujący"
                  name={sampleAgreementViewModel.buyerDetails.fullName}
                />
              </div>
            </DocumentBlock>

            <DocumentBlock title="§ 2. Przedmiot umowy">
              <div className="grid gap-3 rounded-sm border border-zinc-300 p-3 sm:grid-cols-2">
                {vehicleHighlights.map((detail) => (
                  <div key={detail.label}>
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-400">
                      {detail.label}
                    </p>
                    <p className="mt-1 text-sm font-bold text-zinc-900">{detail.value}</p>
                  </div>
                ))}
              </div>
            </DocumentBlock>
          </div>

          <div className="rounded-sm border border-zinc-900 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">Cena sprzedaży</p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900">
              {sampleAgreementViewModel.priceDisplay}
            </p>
            <p className="mt-3 text-[12px] italic leading-5 text-zinc-600">{sampleAgreementViewModel.priceWords}</p>
            <div className="mt-4 grid gap-2">
              {saleHighlights.map((detail) => (
                <div key={detail.label} className="border-t border-zinc-100 pt-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-400">{detail.label}</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900">{detail.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 border-t border-zinc-100 pt-8 sm:grid-cols-2">
          <SignatureLine label="Czytelny podpis sprzedającego" />
          <SignatureLine label="Czytelny podpis kupującego" />
        </div>
      </div>
    </div>
  );
}

function DocumentBlock({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">{title}</p>
      {children}
    </section>
  );
}

function PreviewPartyCard({
  details,
  heading,
  name,
}: {
  details: string[];
  heading: string;
  name: string;
}) {
  return (
    <div className="rounded-sm border border-zinc-300 bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">{heading}</p>
      <p className="mt-2 text-sm font-extrabold text-zinc-900">{name}</p>
      <div className="mt-2 space-y-1 text-[12px] leading-5 text-zinc-700">
        {details.slice(0, 2).map((detail) => (
          <p key={detail}>{detail}</p>
        ))}
      </div>
    </div>
  );
}

function SignatureLine({ label }: { label: string }) {
  return (
    <div className="border-t border-zinc-900 pt-2 text-center">
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-900">{label}</p>
    </div>
  );
}
