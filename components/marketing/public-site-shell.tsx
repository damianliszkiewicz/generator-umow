import Link from "next/link";
import type { ReactNode } from "react";
import { FileCheck2 } from "lucide-react";

import { LinkButton } from "@/components/ui/link-button";

type PublicSiteShellProps = {
  children: ReactNode;
  navItems?: Array<{
    href: string;
    label: string;
  }>;
};

export function PublicSiteShell({ children, navItems = [] }: PublicSiteShellProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#fbf9f5_0%,_var(--dashboard-page)_100%)] text-[color:var(--dashboard-text)]">
      <header className="sticky top-0 z-40 border-b border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-page)] backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/">
            <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-[color:var(--dashboard-text)] text-white">
              <FileCheck2 className="h-5 w-5" />
            </span>
            <span className="text-sm font-extrabold uppercase tracking-[0.18em] text-[color:var(--dashboard-text)] sm:text-base">
              Generator umów
            </span>
          </Link>

          {navItems.length > 0 ? (
            <nav className="hidden items-center gap-8 lg:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--dashboard-muted)] transition-colors hover:text-[color:var(--dashboard-text)]"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : null}

          <div className="flex items-center gap-2 sm:gap-3">
            <LinkButton href="/sign-in" variant="outline">
              Zaloguj się
            </LinkButton>
            <LinkButton href="/sign-up">Załóż konto</LinkButton>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-[color:var(--dashboard-border)] bg-white/70">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 text-sm sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:px-8">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--dashboard-muted)]">
              Generator umowy kupna-sprzedaży samochodu
            </p>
            <p className="max-w-xl text-sm leading-6 text-[color:var(--dashboard-muted)]">
              Publiczny landing i przykładowy podgląd pokazują ten sam kierunek produktu: przygotowanie umowy,
              zapis szkicu, kontrolę podglądu i eksport PDF dla sprzedaży prywatnej w Polsce.
            </p>
          </div>

          <div className="flex flex-wrap items-start gap-4 text-sm font-medium text-[color:var(--dashboard-muted)]">
            <Link className="transition-colors hover:text-[color:var(--dashboard-text)]" href="/">
              Strona główna
            </Link>
            <Link className="transition-colors hover:text-[color:var(--dashboard-text)]" href="/przykladowa-umowa">
              Przykładowa umowa
            </Link>
            <Link className="transition-colors hover:text-[color:var(--dashboard-text)]" href="/sign-in">
              Logowanie
            </Link>
            <Link className="transition-colors hover:text-[color:var(--dashboard-text)]" href="/sign-up">
              Rejestracja
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
