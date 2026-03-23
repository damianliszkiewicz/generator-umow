"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import type { UseFormRegisterReturn } from "react-hook-form";

import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import {
  type DeclarationsFormValues,
  declarationsSchema,
  normalizeStep,
  type PersonFormValues,
  personSchema,
  saleTermsSchema,
  type SaleTermsFormValues,
  type VehicleFormValues,
  type WizardStep,
  wizardStepLabels,
  wizardStepOrder,
  vehicleSchema,
} from "@/lib/contracts/schemas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type EditContractWizardProps = {
  contractId: string;
  stepFromUrl?: string;
};

export function EditContractWizard({ contractId, stepFromUrl }: EditContractWizardProps) {
  const step = normalizeStep(stepFromUrl);
  const router = useRouter();
  const typedContractId = contractId as Id<"contracts">;
  const contract = useQuery(api.contracts.getById, { contractId: typedContractId });

  const updateSeller = useMutation(api.contracts.updateSeller);
  const updateBuyer = useMutation(api.contracts.updateBuyer);
  const updateVehicle = useMutation(api.contracts.updateVehicle);
  const updateSaleTerms = useMutation(api.contracts.updateSaleTerms);
  const updateDeclarations = useMutation(api.contracts.updateDeclarations);

  if (contract === undefined) {
    return <Card>Ladowanie danych umowy...</Card>;
  }

  if (!contract) {
    return <Card>Nie znaleziono umowy.</Card>;
  }

  const nextStep = (current: WizardStep): WizardStep => {
    const index = wizardStepOrder.indexOf(current);
    return wizardStepOrder[Math.min(index + 1, wizardStepOrder.length - 1)];
  };

  const prevStep = (current: WizardStep): WizardStep => {
    const index = wizardStepOrder.indexOf(current);
    return wizardStepOrder[Math.max(index - 1, 0)];
  };

  const navigateToStep = (targetStep: WizardStep) => {
    if (targetStep === "podglad") {
      router.push(`/umowy/${contractId}/podglad`);
      return;
    }

    router.push(`/umowy/${contractId}/edytuj?step=${targetStep}`);
  };

  return (
    <Card className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm text-zinc-500">{contract.title}</p>
        <h1 className="text-2xl font-semibold">Edycja umowy: {wizardStepLabels[step]}</h1>
        <div className="flex flex-wrap gap-2">
          {wizardStepOrder.map((candidate) => (
            <button
              key={candidate}
              type="button"
              className={`rounded-full px-3 py-1 text-xs ${
                candidate === step ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"
              }`}
              onClick={() => navigateToStep(candidate)}
            >
              {wizardStepLabels[candidate]}
            </button>
          ))}
        </div>
      </header>

      {step === "sprzedajacy" ? (
        <PersonStepForm
          label="sprzedajacego"
          initialValues={contract.seller}
          onSubmit={async (values) => {
            await updateSeller({ contractId: typedContractId, seller: values });
            navigateToStep(nextStep(step));
          }}
        />
      ) : null}

      {step === "kupujacy" ? (
        <PersonStepForm
          label="kupujacego"
          initialValues={contract.buyer}
          onSubmit={async (values) => {
            await updateBuyer({ contractId: typedContractId, buyer: values });
            navigateToStep(nextStep(step));
          }}
        />
      ) : null}

      {step === "pojazd" ? (
        <VehicleStepForm
          initialValues={contract.vehicle}
          onSubmit={async (values) => {
            await updateVehicle({ contractId: typedContractId, vehicle: values });
            navigateToStep(nextStep(step));
          }}
        />
      ) : null}

      {step === "warunki" ? (
        <SaleTermsStepForm
          initialValues={contract.saleTerms}
          onSubmit={async (values) => {
            await updateSaleTerms({ contractId: typedContractId, saleTerms: values });
            navigateToStep(nextStep(step));
          }}
        />
      ) : null}

      {step === "oswiadczenia" ? (
        <DeclarationsStepForm
          initialValues={contract.declarations}
          onSubmit={async (values) => {
            await updateDeclarations({ contractId: typedContractId, declarations: values });
            navigateToStep(nextStep(step));
          }}
        />
      ) : null}

      <footer className="flex flex-wrap gap-2 border-t border-zinc-200 pt-3">
        <Button type="button" variant="outline" onClick={() => navigateToStep(prevStep(step))}>
          Poprzedni krok
        </Button>
        <Link href="/dashboard">
          <Button type="button" variant="secondary">
            Wroc do panelu
          </Button>
        </Link>
      </footer>
    </Card>
  );
}

function PersonStepForm({
  label,
  initialValues,
  onSubmit,
}: {
  label: string;
  initialValues: Doc<"contracts">["seller"];
  onSubmit: (values: PersonFormValues) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(personSchema),
    defaultValues: {
      firstName: initialValues.firstName ?? "",
      lastName: initialValues.lastName ?? "",
      pesel: initialValues.pesel ?? "",
      nip: initialValues.nip ?? "",
      regon: initialValues.regon ?? "",
      idDocumentNumber: initialValues.idDocumentNumber ?? "",
      street: initialValues.street ?? "",
      houseNumber: initialValues.houseNumber ?? "",
      apartmentNumber: initialValues.apartmentNumber ?? "",
      postalCode: initialValues.postalCode ?? "",
      city: initialValues.city ?? "",
      country: initialValues.country ?? "Polska",
    },
  });

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <Field label={`Imie ${label}`} error={errors.firstName?.message as string | undefined}>
        <Input {...register("firstName")} />
      </Field>
      <Field label={`Nazwisko ${label}`} error={errors.lastName?.message as string | undefined}>
        <Input {...register("lastName")} />
      </Field>
      <Field label="PESEL" error={errors.pesel?.message as string | undefined}>
        <Input {...register("pesel")} />
      </Field>
      <Field label="NIP" error={errors.nip?.message as string | undefined}>
        <Input {...register("nip")} />
      </Field>
      <Field label="REGON" error={errors.regon?.message as string | undefined}>
        <Input {...register("regon")} />
      </Field>
      <Field label="Nr dokumentu" error={errors.idDocumentNumber?.message as string | undefined}>
        <Input {...register("idDocumentNumber")} />
      </Field>
      <Field label="Ulica" error={errors.street?.message as string | undefined}>
        <Input {...register("street")} />
      </Field>
      <Field label="Nr domu" error={errors.houseNumber?.message as string | undefined}>
        <Input {...register("houseNumber")} />
      </Field>
      <Field label="Nr lokalu" error={errors.apartmentNumber?.message as string | undefined}>
        <Input {...register("apartmentNumber")} />
      </Field>
      <Field label="Kod pocztowy" error={errors.postalCode?.message as string | undefined}>
        <Input {...register("postalCode")} />
      </Field>
      <Field label="Miejscowosc" error={errors.city?.message as string | undefined}>
        <Input {...register("city")} />
      </Field>
      <Field label="Kraj" error={errors.country?.message as string | undefined}>
        <Input {...register("country")} />
      </Field>
      <div className="col-span-full">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Zapisywanie..." : "Zapisz krok"}
        </Button>
      </div>
    </form>
  );
}

function VehicleStepForm({
  initialValues,
  onSubmit,
}: {
  initialValues: Doc<"contracts">["vehicle"];
  onSubmit: (values: VehicleFormValues) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      brand: initialValues.brand ?? "",
      model: initialValues.model ?? "",
      version: initialValues.version ?? "",
      year: initialValues.year,
      vin: initialValues.vin ?? "",
      registrationNumber: initialValues.registrationNumber ?? "",
      mileage: initialValues.mileage,
      color: initialValues.color ?? "",
      engineCapacity: initialValues.engineCapacity,
      fuelType: initialValues.fuelType ?? "",
      firstRegistrationDate: initialValues.firstRegistrationDate ?? "",
      vehicleCardNumber: initialValues.vehicleCardNumber ?? "",
    },
  });

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <Field label="Marka" error={errors.brand?.message as string | undefined}>
        <Input {...register("brand")} />
      </Field>
      <Field label="Model" error={errors.model?.message as string | undefined}>
        <Input {...register("model")} />
      </Field>
      <Field label="Wersja" error={errors.version?.message as string | undefined}>
        <Input {...register("version")} />
      </Field>
      <Field label="Rok" error={errors.year?.message as string | undefined}>
        <Input type="number" {...register("year", { valueAsNumber: true })} />
      </Field>
      <Field label="VIN" error={errors.vin?.message as string | undefined}>
        <Input {...register("vin")} />
      </Field>
      <Field label="Nr rejestracyjny" error={errors.registrationNumber?.message as string | undefined}>
        <Input {...register("registrationNumber")} />
      </Field>
      <Field label="Przebieg" error={errors.mileage?.message as string | undefined}>
        <Input type="number" {...register("mileage", { valueAsNumber: true })} />
      </Field>
      <Field label="Kolor" error={errors.color?.message as string | undefined}>
        <Input {...register("color")} />
      </Field>
      <Field label="Pojemnosc" error={errors.engineCapacity?.message as string | undefined}>
        <Input type="number" {...register("engineCapacity", { valueAsNumber: true })} />
      </Field>
      <Field label="Paliwo" error={errors.fuelType?.message as string | undefined}>
        <Input {...register("fuelType")} />
      </Field>
      <Field label="Data pierwszej rejestracji" error={errors.firstRegistrationDate?.message as string | undefined}>
        <Input type="date" {...register("firstRegistrationDate")} />
      </Field>
      <Field label="Nr karty pojazdu" error={errors.vehicleCardNumber?.message as string | undefined}>
        <Input {...register("vehicleCardNumber")} />
      </Field>
      <div className="col-span-full">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Zapisywanie..." : "Zapisz krok"}
        </Button>
      </div>
    </form>
  );
}

function SaleTermsStepForm({
  initialValues,
  onSubmit,
}: {
  initialValues: Doc<"contracts">["saleTerms"];
  onSubmit: (values: SaleTermsFormValues) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SaleTermsFormValues>({
    resolver: zodResolver(saleTermsSchema),
    defaultValues: {
      saleDate: initialValues.saleDate ?? "",
      salePlace: initialValues.salePlace ?? "",
      price: initialValues.price,
      paymentMethod: initialValues.paymentMethod ?? "",
      handoverDate: initialValues.handoverDate ?? "",
    },
  });

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <Field label="Data sprzedazy" error={errors.saleDate?.message as string | undefined}>
        <Input type="date" {...register("saleDate")} />
      </Field>
      <Field label="Miejsce" error={errors.salePlace?.message as string | undefined}>
        <Input {...register("salePlace")} />
      </Field>
      <Field label="Cena" error={errors.price?.message as string | undefined}>
        <Input type="number" step="0.01" {...register("price", { valueAsNumber: true })} />
      </Field>
      <Field label="Metoda platnosci" error={errors.paymentMethod?.message as string | undefined}>
        <Input {...register("paymentMethod")} />
      </Field>
      <Field label="Data przekazania" error={errors.handoverDate?.message as string | undefined}>
        <Input type="date" {...register("handoverDate")} />
      </Field>
      <div className="col-span-full">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Zapisywanie..." : "Zapisz krok"}
        </Button>
      </div>
    </form>
  );
}

function DeclarationsStepForm({
  initialValues,
  onSubmit,
}: {
  initialValues: Doc<"contracts">["declarations"];
  onSubmit: (values: DeclarationsFormValues) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(declarationsSchema),
    defaultValues: {
      sellerOwnsVehicle: initialValues.sellerOwnsVehicle ?? true,
      vehicleFreeOfLiens: initialValues.vehicleFreeOfLiens ?? true,
      buyerKnowsTechnicalState: initialValues.buyerKnowsTechnicalState ?? true,
      defectsDescription: initialValues.defectsDescription ?? "",
      documentsTransferred: initialValues.documentsTransferred ?? true,
      keysTransferred: initialValues.keysTransferred ?? true,
      additionalNotes: initialValues.additionalNotes ?? "",
    },
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <BooleanField
        label="Sprzedajacy oswiadcza, ze jest wlascicielem pojazdu"
        inputProps={register("sellerOwnsVehicle")}
      />
      <BooleanField
        label="Pojazd jest wolny od obciazen"
        inputProps={register("vehicleFreeOfLiens")}
      />
      <BooleanField
        label="Kupujacy zna stan techniczny"
        inputProps={register("buyerKnowsTechnicalState")}
      />
      <BooleanField
        label="Dokumenty pojazdu przekazane"
        inputProps={register("documentsTransferred")}
      />
      <BooleanField
        label="Kluczyki przekazane"
        inputProps={register("keysTransferred")}
      />

      <Field label="Opis usterek" error={errors.defectsDescription?.message as string | undefined}>
        <Textarea {...register("defectsDescription")} />
      </Field>
      <Field label="Dodatkowe uwagi" error={errors.additionalNotes?.message as string | undefined}>
        <Textarea {...register("additionalNotes")} />
      </Field>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Zapisywanie..." : "Zapisz krok"}
      </Button>
    </form>
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

function BooleanField({
  label,
  inputProps,
}: {
  label: string;
  inputProps: UseFormRegisterReturn;
}) {
  return (
    <div className="flex items-center gap-2">
      <input type="checkbox" className="h-4 w-4 rounded border-zinc-300" {...inputProps} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
