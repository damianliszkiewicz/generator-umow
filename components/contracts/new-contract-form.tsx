"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
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
    <Card className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Nowa umowa</h1>
        <p className="text-sm text-zinc-600">Krok 1/6: dane sprzedajacego.</p>
      </div>

      <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <Field label="Imie" error={errors.firstName?.message}>
          <Input {...register("firstName")} />
        </Field>
        <Field label="Nazwisko" error={errors.lastName?.message}>
          <Input {...register("lastName")} />
        </Field>
        <Field label="PESEL" error={errors.pesel?.message}>
          <Input {...register("pesel")} />
        </Field>
        <Field label="NIP (opcjonalnie)" error={errors.nip?.message}>
          <Input {...register("nip")} />
        </Field>
        <Field label="REGON (opcjonalnie)" error={errors.regon?.message}>
          <Input {...register("regon")} />
        </Field>
        <Field label="Nr dokumentu" error={errors.idDocumentNumber?.message}>
          <Input {...register("idDocumentNumber")} />
        </Field>
        <Field label="Ulica" error={errors.street?.message}>
          <Input {...register("street")} />
        </Field>
        <Field label="Nr domu" error={errors.houseNumber?.message}>
          <Input {...register("houseNumber")} />
        </Field>
        <Field label="Nr lokalu" error={errors.apartmentNumber?.message}>
          <Input {...register("apartmentNumber")} />
        </Field>
        <Field label="Kod pocztowy" error={errors.postalCode?.message}>
          <Input {...register("postalCode")} />
        </Field>
        <Field label="Miejscowosc" error={errors.city?.message}>
          <Input {...register("city")} />
        </Field>
        <Field label="Kraj" error={errors.country?.message}>
          <Input {...register("country")} />
        </Field>

        <div className="col-span-full flex flex-wrap gap-2 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Zapisywanie..." : "Zapisz i przejdz dalej"}
          </Button>
          <Link href="/dashboard">
            <Button type="button" variant="outline">
              Anuluj
            </Button>
          </Link>
        </div>
      </form>
    </Card>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
