"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { useConvexAuth, useQuery } from "convex/react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Settings2,
} from "lucide-react";

import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DashboardContract = {
  id: string;
  title: string;
  status: "draft" | "ready";
  updatedAt: number;
  updatedLabel: string;
  completion: number;
  completionBucket: number;
  partyLabel: string;
  vehicleLabel: string;
  priceLabel: string;
  sectionTags: string[];
  generatedPdfUrl?: string;
};

type TrendPoint = {
  label: string;
  total: number;
  ready: number;
};

const COMPLETION_BUCKETS = [
  { label: "81-100", min: 81, max: 100, color: "#7c5cff" },
  { label: "61-80", min: 61, max: 80, color: "#8f71ff" },
  { label: "41-60", min: 41, max: 60, color: "#a88fff" },
  { label: "21-40", min: 21, max: 40, color: "#c9bbff" },
  { label: "0-20", min: 0, max: 20, color: "#e7e1d7" },
];

const SECTION_LABELS = {
  seller: "Sprzedający",
  buyer: "Kupujący",
  vehicle: "Pojazd",
  saleTerms: "Warunki",
  declarations: "Oświadczenia",
} as const;

const MONTH_FORMATTER = new Intl.DateTimeFormat("pl-PL", { month: "short" });
const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
const PRICE_FORMATTER = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 0,
});

export function DashboardClient() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const contracts = useQuery(api.contracts.listMine, isAuthenticated ? {} : "skip");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const deferredQuery = useDeferredValue(query);

  if (isLoading) {
    return <p className="text-sm text-[color:var(--dashboard-muted)]">Ładowanie sesji...</p>;
  }

  if (!isAuthenticated) {
    return <p className="text-sm text-[color:var(--dashboard-muted)]">Trwa odświeżanie sesji. Spróbuj ponownie za chwilę.</p>;
  }

  if (contracts === undefined) {
    return <p className="text-sm text-[color:var(--dashboard-muted)]">Ładowanie umów...</p>;
  }

  const items = contracts.map(mapDashboardContract);
  const summary = buildSummary(items);
  const trend = buildTrend(items);
  const normalizedQuery = deferredQuery.trim().toLocaleLowerCase("pl-PL");
  const filteredItems = normalizedQuery
    ? items.filter((item) => {
        const haystack = [item.title, item.partyLabel, item.vehicleLabel, item.priceLabel, ...item.sectionTags]
          .join(" ")
          .toLocaleLowerCase("pl-PL");
        return haystack.includes(normalizedQuery);
      })
    : items;
  const pageCount = Math.max(1, Math.ceil(filteredItems.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const visibleItems = filteredItems.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const allVisibleSelected = visibleItems.length > 0 && visibleItems.every((item) => selectedIds.includes(item.id));
  const hasSomeVisibleSelected = visibleItems.some((item) => selectedIds.includes(item.id));
  const pageNumbers = getPageNumbers(currentPage, pageCount);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setPage(1);
  };

  const toggleVisibleRows = (checked: boolean) => {
    if (checked) {
      const next = new Set(selectedIds);
      for (const item of visibleItems) {
        next.add(item.id);
      }
      setSelectedIds(Array.from(next));
      return;
    }

    setSelectedIds(selectedIds.filter((id) => !visibleItems.some((item) => item.id === id)));
  };

  const toggleRow = (rowId: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(Array.from(new Set([...selectedIds, rowId])));
      return;
    }

    setSelectedIds(selectedIds.filter((id) => id !== rowId));
  };

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-[30px] font-semibold tracking-[-0.03em] text-[color:var(--dashboard-text)]">
            Przegląd umów
          </h1>
          <p className="max-w-2xl text-sm text-[color:var(--dashboard-muted)]">
            Monitoruj kompletność szkiców, śledź aktywność w czasie i przejdź szybko do edycji lub podglądu PDF.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ActionChip icon={Filter} label="Filtry" suffix={filteredItems.length.toString()} />
          <ActionChip icon={Settings2} label="Widok" />
          <Link
            href="/umowy/nowa"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[color:var(--dashboard-border)] bg-white px-4 text-sm font-semibold text-[color:var(--dashboard-text)] shadow-[0_1px_2px_rgba(38,34,27,0.04)] transition-transform duration-150 hover:-translate-y-0.5 hover:bg-[color:var(--dashboard-accent-soft)]"
          >
            <Plus className="h-4 w-4" />
            Nowa umowa
          </Link>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="rounded-[24px] border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-panel)] p-0 shadow-[0_8px_24px_rgba(38,34,27,0.04)]">
          <div className="flex items-start justify-between px-5 pt-5">
            <div>
              <h2 className="text-base font-semibold text-[color:var(--dashboard-text)]">Poziom kompletności</h2>
              <p className="mt-1 text-sm text-[color:var(--dashboard-muted)]">Rozkład szkiców według stopnia uzupełnienia.</p>
            </div>
            <MoreVertical className="h-4 w-4 text-[color:var(--dashboard-muted)]" />
          </div>
          <div className="grid gap-6 px-5 py-6 sm:grid-cols-[140px_minmax(0,1fr)] xl:grid-cols-1">
            <CompletionDonut counts={summary.bucketCounts} total={items.length} />
            <div className="space-y-3">
              {COMPLETION_BUCKETS.map((bucket, index) => (
                <div key={bucket.label} className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2 text-[color:var(--dashboard-muted)]">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: bucket.color }} />
                    <span>{bucket.label}</span>
                  </div>
                  <span className="font-medium text-[color:var(--dashboard-text)]">{summary.bucketCounts[index]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-[color:var(--dashboard-border)] px-5 py-4">
            <a href="#contracts-table" className="inline-flex h-10 items-center justify-center rounded-xl border border-[color:var(--dashboard-border)] bg-white px-4 text-sm font-semibold text-[color:var(--dashboard-text)] transition-colors hover:bg-[color:var(--dashboard-accent-soft)]">
              Zobacz wszystkie umowy
            </a>
          </div>
        </Card>

        <Card className="rounded-[24px] border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-panel)] p-0 shadow-[0_8px_24px_rgba(38,34,27,0.04)]">
          <div className="flex items-start justify-between gap-4 px-5 pt-5">
            <div>
              <h2 className="text-base font-semibold text-[color:var(--dashboard-text)]">Aktywność miesięczna</h2>
              <p className="mt-1 text-sm text-[color:var(--dashboard-muted)]">Porównanie wszystkich zapisanych umów i gotowych dokumentów.</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <LegendDot color="var(--dashboard-accent)" label="Wszystkie umowy" />
              <LegendDot color="var(--dashboard-accent-subtle)" label="Gotowe do PDF" />
            </div>
          </div>
          <div className="px-3 pb-4 pt-2 sm:px-5 sm:pb-5">
            <TrendChart points={trend} />
          </div>
        </Card>
      </section>

      <section className="space-y-3" id="contracts-table">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[color:var(--dashboard-text)]">Ruch w umowach</h2>
            <p className="text-sm text-[color:var(--dashboard-muted)]">Przegląd ostatnio aktualizowanych szkiców i gotowych dokumentów.</p>
          </div>
          <div className="relative w-full sm:max-w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--dashboard-muted)]" />
            <Input
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              placeholder="Szukaj"
              className="h-10 rounded-xl border-[color:var(--dashboard-border)] bg-white pl-9 text-[color:var(--dashboard-text)] placeholder:text-[color:var(--dashboard-muted)] focus-visible:ring-[color:var(--dashboard-accent-subtle)]"
            />
          </div>
        </div>

        <Card className="overflow-hidden rounded-[24px] border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-panel)] p-0 shadow-[0_8px_24px_rgba(38,34,27,0.04)]">
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-white/80 text-left text-xs font-semibold text-[color:var(--dashboard-muted)]">
                  <th className="w-14 border-b border-[color:var(--dashboard-border)] px-4 py-3">
                    <Checkbox
                      checked={allVisibleSelected}
                      onCheckedChange={toggleVisibleRows}
                      className={cn(
                        "rounded-md border-[color:var(--dashboard-border)]",
                        hasSomeVisibleSelected && !allVisibleSelected ? "bg-[color:var(--dashboard-accent-soft)]" : undefined,
                      )}
                    />
                  </th>
                  <th className="border-b border-[color:var(--dashboard-border)] px-4 py-3">Umowa</th>
                  <th className="border-b border-[color:var(--dashboard-border)] px-4 py-3">Kompletność</th>
                  <th className="border-b border-[color:var(--dashboard-border)] px-4 py-3">Status</th>
                  <th className="border-b border-[color:var(--dashboard-border)] px-4 py-3">Ostatnia aktualizacja</th>
                  <th className="border-b border-[color:var(--dashboard-border)] px-4 py-3">Sekcje</th>
                  <th className="border-b border-[color:var(--dashboard-border)] px-4 py-3 text-right">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="mx-auto max-w-md space-y-3">
                        <p className="text-lg font-semibold text-[color:var(--dashboard-text)]">Brak wyników dla tego widoku</p>
                        <p className="text-sm text-[color:var(--dashboard-muted)]">
                          {items.length === 0
                            ? "Utwórz pierwszy szkic umowy, aby zobaczyć statystyki i historię zmian."
                            : "Zmień frazę wyszukiwania albo wyczyść filtry, aby przywrócić listę umów."}
                        </p>
                        {items.length === 0 ? (
                          <Link
                            href="/umowy/nowa"
                            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[color:var(--dashboard-text)] px-4 text-sm font-semibold text-white transition-colors hover:bg-black"
                          >
                            <Plus className="h-4 w-4" />
                            Utwórz szkic
                          </Link>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ) : (
                  visibleItems.map((item) => {
                    const selected = selectedIds.includes(item.id);

                    return (
                      <tr key={item.id} className="bg-white/60 transition-colors hover:bg-white">
                        <td className="border-b border-[color:var(--dashboard-border)] px-4 py-4 align-top">
                          <Checkbox
                            checked={selected}
                            onCheckedChange={(checked) => toggleRow(item.id, checked)}
                            className="rounded-md border-[color:var(--dashboard-border)]"
                          />
                        </td>
                        <td className="border-b border-[color:var(--dashboard-border)] px-4 py-4 align-top">
                          <div className="flex items-start gap-3">
                            <ContractAvatar title={item.title} />
                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-[color:var(--dashboard-text)]">{item.title}</p>
                              <p className="text-sm text-[color:var(--dashboard-muted)]">{item.partyLabel}</p>
                              <p className="text-xs text-[color:var(--dashboard-muted)]">{item.vehicleLabel}</p>
                            </div>
                          </div>
                        </td>
                        <td className="border-b border-[color:var(--dashboard-border)] px-4 py-4 align-top">
                          <div className="min-w-36 space-y-2">
                            <div className="h-2.5 rounded-full bg-[color:var(--dashboard-accent-soft)]">
                              <div
                                className="h-2.5 rounded-full bg-[color:var(--dashboard-accent)]"
                                style={{ width: `${item.completion}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-[color:var(--dashboard-text)]">{item.completion}%</span>
                              <span className="text-[color:var(--dashboard-muted)]">{item.priceLabel}</span>
                            </div>
                          </div>
                        </td>
                        <td className="border-b border-[color:var(--dashboard-border)] px-4 py-4 align-top">
                          <StatusBadge status={item.status} completion={item.completion} />
                        </td>
                        <td className="border-b border-[color:var(--dashboard-border)] px-4 py-4 align-top text-sm text-[color:var(--dashboard-muted)]">
                          {item.updatedLabel}
                        </td>
                        <td className="border-b border-[color:var(--dashboard-border)] px-4 py-4 align-top">
                          <div className="flex max-w-xs flex-wrap gap-2">
                            {item.sectionTags.slice(0, 3).map((tag) => (
                              <Tag key={tag} tone="neutral">
                                {tag}
                              </Tag>
                            ))}
                            {item.sectionTags.length > 3 ? <Tag tone="neutral">+{item.sectionTags.length - 3}</Tag> : null}
                            {item.generatedPdfUrl ? <Tag tone="success">PDF</Tag> : null}
                          </div>
                        </td>
                        <td className="border-b border-[color:var(--dashboard-border)] px-4 py-4 align-top">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/umowy/${item.id}/podglad`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--dashboard-border)] bg-white text-[color:var(--dashboard-muted)] transition-colors hover:bg-[color:var(--dashboard-accent-soft)] hover:text-[color:var(--dashboard-text)]"
                              aria-label={`Podgląd ${item.title}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              href={`/umowy/${item.id}/edytuj?step=sprzedajacy`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--dashboard-border)] bg-white text-[color:var(--dashboard-muted)] transition-colors hover:bg-[color:var(--dashboard-accent-soft)] hover:text-[color:var(--dashboard-text)]"
                              aria-label={`Edytuj ${item.title}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[color:var(--dashboard-border)] px-4 py-4 text-sm text-[color:var(--dashboard-muted)] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span>
                Strona {currentPage} z {pageCount}
              </span>
              <label className="flex items-center gap-2">
                <span>Wierszy</span>
                <select
                  value={rowsPerPage}
                  onChange={(event) => handleRowsPerPageChange(Number(event.target.value))}
                  className="h-9 rounded-xl border border-[color:var(--dashboard-border)] bg-white px-3 text-[color:var(--dashboard-text)] outline-none"
                >
                  {[5, 10, 20].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <PaginationButton
                disabled={currentPage === 1}
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                ariaLabel="Poprzednia strona"
              >
                <ChevronLeft className="h-4 w-4" />
              </PaginationButton>
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={cn(
                    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors",
                    pageNumber === currentPage
                      ? "border-[color:var(--dashboard-border)] bg-white text-[color:var(--dashboard-text)]"
                      : "border-transparent text-[color:var(--dashboard-muted)] hover:border-[color:var(--dashboard-border)] hover:bg-white",
                  )}
                >
                  {pageNumber}
                </button>
              ))}
              <PaginationButton
                disabled={currentPage === pageCount}
                onClick={() => setPage((previous) => Math.min(pageCount, previous + 1))}
                ariaLabel="Następna strona"
              >
                <ChevronRight className="h-4 w-4" />
              </PaginationButton>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function ActionChip({
  icon: Icon,
  label,
  suffix,
}: {
  icon: typeof Filter;
  label: string;
  suffix?: string;
}) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-[color:var(--dashboard-border)] bg-white px-4 text-sm font-semibold text-[color:var(--dashboard-text)] shadow-[0_1px_2px_rgba(38,34,27,0.04)] transition-transform duration-150 hover:-translate-y-0.5 hover:bg-[color:var(--dashboard-accent-soft)]"
    >
      <Icon className="h-4 w-4 text-[color:var(--dashboard-muted)]" />
      <span>{label}</span>
      {suffix ? (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[color:var(--dashboard-accent-soft)] px-1.5 py-0.5 text-xs text-[color:var(--dashboard-accent)]">
          {suffix}
        </span>
      ) : null}
    </button>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[color:var(--dashboard-muted)]">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}

function CompletionDonut({ counts, total }: { counts: number[]; total: number }) {
  const gradient = useMemo(() => {
    if (total === 0) {
      return "conic-gradient(#eee7dc 0deg 360deg)";
    }

    let start = 0;
    const segments = counts
      .map((count, index) => {
        const degrees = (count / total) * 360;
        const end = start + degrees;
        const color = COMPLETION_BUCKETS[index].color;
        const segment = `${color} ${start}deg ${end}deg`;
        start = end;
        return segment;
      })
      .join(", ");

    return `conic-gradient(${segments})`;
  }, [counts, total]);

  return (
    <div className="flex items-center justify-center">
      <div className="relative h-36 w-36 rounded-full" style={{ background: gradient }}>
        <div className="absolute inset-6 flex flex-col items-center justify-center rounded-full bg-white text-center shadow-[inset_0_0_0_1px_rgba(236,227,215,0.8)]">
          <span className="text-2xl font-semibold tracking-[-0.03em] text-[color:var(--dashboard-text)]">{total}</span>
          <span className="text-xs text-[color:var(--dashboard-muted)]">umów</span>
        </div>
      </div>
    </div>
  );
}

function TrendChart({ points }: { points: TrendPoint[] }) {
  const width = 760;
  const height = 260;
  const paddingX = 28;
  const paddingTop = 24;
  const paddingBottom = 40;
  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = width - paddingX * 2;
  const maxValue = Math.max(1, ...points.flatMap((point) => [point.total, point.ready]));
  const gridValues = Array.from({ length: 5 }, (_, index) => Math.round((maxValue / 4) * (4 - index)));
  const pointX = (index: number) => paddingX + (chartWidth / Math.max(points.length - 1, 1)) * index;
  const pointY = (value: number) => paddingTop + chartHeight - (value / maxValue) * chartHeight;
  const totalPath = buildLinePath(points.map((point, index) => [pointX(index), pointY(point.total)]));
  const readyPath = buildLinePath(points.map((point, index) => [pointX(index), pointY(point.ready)]));

  return (
    <div className="overflow-hidden rounded-[20px] border border-[color:var(--dashboard-border)] bg-white px-2 py-3 sm:px-4 sm:py-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
        {gridValues.map((value, index) => {
          const y = paddingTop + (chartHeight / (gridValues.length - 1)) * index;

          return (
            <g key={`grid-${index}`}>
              <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#ede6db" strokeDasharray="4 6" />
              <text x={0} y={y + 4} className="fill-[color:var(--dashboard-muted)] text-[11px]">
                {value}
              </text>
            </g>
          );
        })}

        {points.map((point, index) => {
          const x = pointX(index);

          return (
            <g key={point.label}>
              <line x1={x} y1={paddingTop} x2={x} y2={height - paddingBottom} stroke="#f4eee5" />
              <text x={x} y={height - 10} textAnchor="middle" className="fill-[color:var(--dashboard-muted)] text-[11px]">
                {point.label}
              </text>
            </g>
          );
        })}

        <path d={readyPath} fill="none" stroke="var(--dashboard-accent-subtle)" strokeWidth="3" strokeLinecap="round" />
        <path d={totalPath} fill="none" stroke="var(--dashboard-accent)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function ContractAvatar({ title }: { title: string }) {
  const initials = title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "U";

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,_#a88fff,_#7c5cff)] text-sm font-semibold text-white shadow-[0_6px_14px_rgba(124,92,255,0.24)]">
      {initials}
    </div>
  );
}

function StatusBadge({ status, completion }: { status: "draft" | "ready"; completion: number }) {
  if (status === "ready") {
    return <Tag tone="success">Gotowa</Tag>;
  }

  if (completion >= 80) {
    return <Tag tone="neutral">Do finalizacji</Tag>;
  }

  return <Tag tone="danger">Szkic</Tag>;
}

function Tag({ children, tone }: { children: React.ReactNode; tone: "neutral" | "success" | "danger" }) {
  const toneClassName =
    tone === "success"
      ? "bg-[color:var(--dashboard-success-soft)] text-[color:var(--dashboard-success)]"
      : tone === "danger"
        ? "bg-[color:var(--dashboard-danger-soft)] text-[color:var(--dashboard-danger)]"
        : "bg-[color:var(--dashboard-accent-soft)] text-[color:var(--dashboard-accent)]";

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", toneClassName)}>
      {children}
    </span>
  );
}

function PaginationButton({
  children,
  disabled,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--dashboard-border)] bg-white text-[color:var(--dashboard-muted)] transition-colors hover:bg-[color:var(--dashboard-accent-soft)] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function mapDashboardContract(contract: Doc<"contracts">) {
  const completion = calculateCompletion(contract);
  const sectionTags = getCompletedSections(contract);
  const sellerName = [contract.seller.firstName, contract.seller.lastName].filter(Boolean).join(" ").trim();
  const buyerName = [contract.buyer.firstName, contract.buyer.lastName].filter(Boolean).join(" ").trim();
  const vehicleLabel = [contract.vehicle.brand, contract.vehicle.model, contract.vehicle.registrationNumber]
    .filter(Boolean)
    .join(" • ");

  return {
    id: contract._id,
    title: contract.title,
    status: contract.status,
    updatedAt: contract.updatedAt,
    updatedLabel: DATE_TIME_FORMATTER.format(new Date(contract.updatedAt)),
    completion,
    completionBucket: getBucketIndex(completion),
    partyLabel: [sellerName || "Brak sprzedającego", buyerName || "Brak kupującego"].join(" → "),
    vehicleLabel: vehicleLabel || "Pojazd nieuzupełniony",
    priceLabel: contract.saleTerms.price ? PRICE_FORMATTER.format(contract.saleTerms.price) : "Bez ceny",
    sectionTags,
    generatedPdfUrl: contract.generatedPdfUrl,
  } satisfies DashboardContract;
}

function buildSummary(items: DashboardContract[]) {
  const bucketCounts = COMPLETION_BUCKETS.map(() => 0);

  for (const item of items) {
    bucketCounts[item.completionBucket] += 1;
  }

  return {
    bucketCounts,
  };
}

function buildTrend(items: DashboardContract[]): TrendPoint[] {
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: MONTH_FORMATTER.format(date).replace(".", ""),
      total: 0,
      ready: 0,
    };
  });
  const monthIndexByKey = new Map(months.map((month, index) => [month.key, index]));
  const firstMonth = new Date(now.getFullYear(), now.getMonth() - 11, 1).getTime();
  let totalCarry = 0;
  let readyCarry = 0;

  for (const item of items) {
    const date = new Date(item.updatedAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const monthIndex = monthIndexByKey.get(key);

    if (item.updatedAt < firstMonth || monthIndex === undefined) {
      totalCarry += 1;
      if (item.status === "ready") {
        readyCarry += 1;
      }
      continue;
    }

    months[monthIndex].total += 1;
    if (item.status === "ready") {
      months[monthIndex].ready += 1;
    }
  }

  return months.map((month) => {
    totalCarry += month.total;
    readyCarry += month.ready;

    return {
      label: month.label,
      total: totalCarry,
      ready: readyCarry,
    };
  });
}

function calculateCompletion(contract: Parameters<typeof mapDashboardContract>[0]) {
  const checks = [
    isFilled(contract.seller.firstName),
    isFilled(contract.seller.lastName),
    isFilled(contract.seller.pesel),
    isFilled(contract.seller.idDocumentNumber),
    isFilled(contract.seller.street),
    isFilled(contract.seller.houseNumber),
    isFilled(contract.seller.postalCode),
    isFilled(contract.seller.city),
    isFilled(contract.seller.country),
    isFilled(contract.buyer.firstName),
    isFilled(contract.buyer.lastName),
    isFilled(contract.buyer.pesel),
    isFilled(contract.buyer.idDocumentNumber),
    isFilled(contract.buyer.street),
    isFilled(contract.buyer.houseNumber),
    isFilled(contract.buyer.postalCode),
    isFilled(contract.buyer.city),
    isFilled(contract.buyer.country),
    isFilled(contract.vehicle.brand),
    isFilled(contract.vehicle.model),
    isFilled(contract.vehicle.year),
    isFilled(contract.vehicle.vin),
    isFilled(contract.vehicle.registrationNumber),
    isFilled(contract.vehicle.mileage),
    isFilled(contract.vehicle.engineCapacity),
    isFilled(contract.vehicle.fuelType),
    isFilled(contract.vehicle.firstRegistrationDate),
    isFilled(contract.saleTerms.saleDate),
    isFilled(contract.saleTerms.salePlace),
    isFilled(contract.saleTerms.price),
    isFilled(contract.saleTerms.paymentMethod),
    isFilled(contract.saleTerms.handoverDate),
    isFilled(contract.declarations.sellerOwnsVehicle),
    isFilled(contract.declarations.vehicleFreeOfLiens),
    isFilled(contract.declarations.buyerKnowsTechnicalState),
    isFilled(contract.declarations.documentsTransferred),
    isFilled(contract.declarations.keysTransferred),
  ];
  const filledCount = checks.filter(Boolean).length;

  return Math.round((filledCount / checks.length) * 100);
}

function getCompletedSections(contract: Parameters<typeof mapDashboardContract>[0]) {
  const sections = [
    {
      label: SECTION_LABELS.seller,
      complete: [
        contract.seller.firstName,
        contract.seller.lastName,
        contract.seller.pesel,
        contract.seller.idDocumentNumber,
        contract.seller.street,
        contract.seller.houseNumber,
        contract.seller.postalCode,
        contract.seller.city,
      ].every(isFilled),
    },
    {
      label: SECTION_LABELS.buyer,
      complete: [
        contract.buyer.firstName,
        contract.buyer.lastName,
        contract.buyer.pesel,
        contract.buyer.idDocumentNumber,
        contract.buyer.street,
        contract.buyer.houseNumber,
        contract.buyer.postalCode,
        contract.buyer.city,
      ].every(isFilled),
    },
    {
      label: SECTION_LABELS.vehicle,
      complete: [
        contract.vehicle.brand,
        contract.vehicle.model,
        contract.vehicle.year,
        contract.vehicle.vin,
        contract.vehicle.registrationNumber,
        contract.vehicle.mileage,
        contract.vehicle.engineCapacity,
      ].every(isFilled),
    },
    {
      label: SECTION_LABELS.saleTerms,
      complete: [
        contract.saleTerms.saleDate,
        contract.saleTerms.salePlace,
        contract.saleTerms.price,
        contract.saleTerms.paymentMethod,
      ].every(isFilled),
    },
    {
      label: SECTION_LABELS.declarations,
      complete: [
        contract.declarations.sellerOwnsVehicle,
        contract.declarations.vehicleFreeOfLiens,
        contract.declarations.buyerKnowsTechnicalState,
      ].every(isFilled),
    },
  ];

  const completed = sections.filter((section) => section.complete).map((section) => section.label);
  return completed.length > 0 ? completed : ["Wymaga uzupełnienia"];
}

function getBucketIndex(completion: number) {
  const index = COMPLETION_BUCKETS.findIndex((bucket) => completion >= bucket.min && completion <= bucket.max);
  return index === -1 ? COMPLETION_BUCKETS.length - 1 : index;
}

function isFilled(value: string | number | boolean | undefined) {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value === "boolean") {
    return true;
  }

  return false;
}

function getPageNumbers(currentPage: number, pageCount: number) {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(pageCount, start + 4);
  const adjustedStart = Math.max(1, end - 4);

  return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
}

function buildLinePath(points: Array<[number, number]>) {
  return points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
}
