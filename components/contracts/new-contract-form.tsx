"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";

import { api } from "@/convex/_generated/api";
import { personSchema, type PersonFormValues } from "@/lib/contracts/schemas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const sellerInitialValues: PersonFormValues = {
  firstName: "",
  lastName: "",
  pesel: "",
  nip: "",
  regon: "",
  idDocumentNumber: "",
  street: "",
  houseNumber: "",
  apartmentNumber: "",
  postalCode: "",
  city: "",
  country: "Polska",
};

export function NewContractForm() {
  const router = useRouter();
  const createDraft = useMutation(api.contracts.createDraft);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonFormValues>({
    resolver: zodResolver(personSchema),
    defaultValues: sellerInitialValues,
  });

  const onSubmit = async (values: PersonFormValues) => {
    const contractId = await createDraft({
      seller: values,
    });

    router.push(`/umowy/${contractId}/edytuj?step=kupujacy`);
  };

  return (
    <Card className="overflow-hidden p-0">
      <header className="border-b border-[color:var(--dashboard-border)] bg-white/70 p-6 lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dashboard-muted)]">Nowy szkic</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[color:var(--dashboard-text)]">Nowa umowa kupna-sprzedaży</h1>
        <p className="mt-2 text-sm leading-6 text-[color:var(--dashboard-muted)]">Wypełnij formularz danymi sprzedającego pojazdu. Styl i układ formularza są spójne z dashboardem oraz podglądem.</p>
      </header>

      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div className="divide-y divide-[color:var(--dashboard-border)]">
          <FormSection
            title="Dane osobowe"
            description="Podstawowe informacje o osobie fizycznej."
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Imie" error={errors.firstName?.message}>
                <Input placeholder="np. Jan" {...register("firstName")} />
              </Field>
              <Field label="Nazwisko" error={errors.lastName?.message}>
                <Input placeholder="np. Kowalski" {...register("lastName")} />
              </Field>
              <Field label="PESEL" error={errors.pesel?.message}>
                <Input {...register("pesel")} />
              </Field>
              <Field label="Nr dokumentu tozsamosci" error={errors.idDocumentNumber?.message}>
                <Input placeholder="np. dowod osobisty lub paszport" {...register("idDocumentNumber")} />
              </Field>
            </div>
          </FormSection>

          <FormSection
            title="Identyfikatory dodatkowe"
            description="Wymagane tylko jesli dotyczy prowadzonej dzialalnosci."
            className="bg-[color:var(--dashboard-accent-soft)]/35"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="NIP (opcjonalnie)" error={errors.nip?.message}>
                <Input {...register("nip")} />
              </Field>
              <Field label="REGON (opcjonalnie)" error={errors.regon?.message}>
                <Input {...register("regon")} />
              </Field>
            </div>
          </FormSection>

          <FormSection
            title="Adres zamieszkania"
            description="Pelny adres zgodnie z dokumentem tozsamosci."
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field className="sm:col-span-2" label="Ulica" error={errors.street?.message}>
                <Input {...register("street")} />
              </Field>
              <Field label="Nr domu" error={errors.houseNumber?.message}>
                <Input {...register("houseNumber")} />
              </Field>
              <Field label="Nr lokalu" error={errors.apartmentNumber?.message}>
                <Input {...register("apartmentNumber")} />
              </Field>
              <Field label="Kod pocztowy" error={errors.postalCode?.message}>
                <Input placeholder="00-000" {...register("postalCode")} />
              </Field>
              <Field label="Miejscowosc" error={errors.city?.message}>
                <Input {...register("city")} />
              </Field>
              <Field className="sm:col-span-2" label="Kraj" error={errors.country?.message}>
                <Input {...register("country")} />
              </Field>
            </div>
          </FormSection>
        </div>

        <div className="sticky bottom-0 z-10 mt-auto flex flex-col items-center justify-between gap-4 rounded-b-[24px] border-t border-[color:var(--dashboard-border)] bg-white/92 p-4 backdrop-blur sm:flex-row-reverse lg:p-6">
          <div className="flex w-full gap-3 sm:w-auto">
            <Link
              className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-[color:var(--dashboard-border)] bg-white px-6 text-sm font-semibold text-[color:var(--dashboard-text)] transition-colors hover:bg-[color:var(--dashboard-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--dashboard-accent-subtle)] sm:flex-none"
              href="/dashboard"
            >
              Anuluj
            </Link>
            <Button className="flex-1 px-8 sm:flex-none" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Zapisywanie..." : "Zapisz i kontynuuj"}
            </Button>
          </div>
          <div className="hidden items-center gap-2 text-[color:var(--dashboard-muted)] sm:flex">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-xs font-semibold">Bezpieczne połączenie</span>
          </div>
        </div>
      </form>
    </Card>
  );
}

function FormSection({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={className ? `p-6 lg:p-8 ${className}` : "p-6 lg:p-8"}>
      <div className="mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--dashboard-text)]">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-6 text-[color:var(--dashboard-muted)]">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className ? `space-y-1.5 ${className}` : "space-y-1.5"}>
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs font-medium text-[color:var(--dashboard-danger)]">{error}</p> : null}
    </div>
  );
}
