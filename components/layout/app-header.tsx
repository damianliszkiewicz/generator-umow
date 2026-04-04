import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between rounded-2xl border border-[color:var(--dashboard-border)] bg-white/70 px-4 py-3 shadow-[0_1px_2px_rgba(38,34,27,0.04)] backdrop-blur sm:px-5">
      <Link
        href="/dashboard"
        className="text-sm font-medium text-[color:var(--dashboard-muted)] transition-colors hover:text-[color:var(--dashboard-text)]"
      >
        Generator umów
      </Link>
      <UserButton afterSignOutUrl="/" />
    </header>
  );
}
