"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { ChevronLeft, ShieldCheck } from "lucide-react";
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
import { cn } from "@/lib/utils";
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
  const { isLoading, isAuthenticated } = useConvexAuth();
  const step = normalizeStep(stepFromUrl);
  const router = useRouter();
  const typedContractId = contractId as Id<"contracts">;
  const contract = useQuery(
    api.contracts.getById,
    isAuthenticated ? { contractId: typedContractId } : "skip",
  );

  const updateSeller = useMutation(api.contracts.updateSeller);
  const updateBuyer = useMutation(api.contracts.updateBuyer);
  const updateVehicle = useMutation(api.contracts.updateVehicle);
  const updateSaleTerms = useMutation(api.contracts.updateSaleTerms);
  const updateDeclarations = useMutation(api.contracts.updateDeclarations);

  if (isLoading) {
    return <Card className="text-[color:var(--dashboard-muted)]">Ładowanie sesji...</Card>;
  }

  if (!isAuthenticated) {
    return <Card className="text-[color:var(--dashboard-muted)]">Sesja nie jest jeszcze gotowa. Odśwież stronę za chwilę.</Card>;
  }

  if (contract === undefined) {
    return <Card className="text-[color:var(--dashboard-muted)]">Ładowanie danych umowy...</Card>;
  }

  if (!contract) {
    return <Card className="text-[color:var(--dashboard-muted)]">Nie znaleziono umowy.</Card>;
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

  const submitLabel = step === "oswiadczenia" ? "Zapisz i przejdz do podgladu" : "Zapisz i przejdz dalej";
  const previousStep = prevStep(step);

  return (
    <Card className="overflow-hidden p-0">
      <header className="border-b border-[color:var(--dashboard-border)] bg-white/70 p-6 lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dashboard-muted)]">{contract.title}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[color:var(--dashboard-text)]">
          Edycja umowy: {wizardStepLabels[step]}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[color:var(--dashboard-muted)]">Uzupełnij pola dla aktywnego kroku i przejdź dalej.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {wizardStepOrder.map((candidate, index) => (
            <button
              key={candidate}
              type="button"
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                candidate === step
                  ? "bg-[color:var(--dashboard-accent)] text-white"
                  : "border border-[color:var(--dashboard-border)] bg-white text-[color:var(--dashboard-muted)] hover:bg-[color:var(--dashboard-accent-soft)] hover:text-[color:var(--dashboard-text)]",
              )}
              onClick={() => navigateToStep(candidate)}
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current/20 text-[10px]">
                {index + 1}
              </span>
              {wizardStepLabels[candidate]}
            </button>
          ))}
        </div>
      </header>

      {step === "sprzedajacy" ? (
        <PersonStepForm
          label="sprzedajacego"
          initialValues={contract.seller}
          submitLabel={submitLabel}
          onBack={() => navigateToStep(previousStep)}
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
          submitLabel={submitLabel}
          onBack={() => navigateToStep(previousStep)}
          onSubmit={async (values) => {
            await updateBuyer({ contractId: typedContractId, buyer: values });
            navigateToStep(nextStep(step));
          }}
        />
      ) : null}

      {step === "pojazd" ? (
        <VehicleStepForm
          initialValues={contract.vehicle}
          submitLabel={submitLabel}
          onBack={() => navigateToStep(previousStep)}
          onSubmit={async (values) => {
            await updateVehicle({ contractId: typedContractId, vehicle: values });
            navigateToStep(nextStep(step));
          }}
        />
      ) : null}

      {step === "warunki" ? (
        <SaleTermsStepForm
          initialValues={contract.saleTerms}
          submitLabel={submitLabel}
          onBack={() => navigateToStep(previousStep)}
          onSubmit={async (values) => {
            await updateSaleTerms({ contractId: typedContractId, saleTerms: values });
            navigateToStep(nextStep(step));
          }}
        />
      ) : null}

      {step === "oswiadczenia" ? (
        <DeclarationsStepForm
          initialValues={contract.declarations}
          submitLabel={submitLabel}
          onBack={() => navigateToStep(previousStep)}
          onSubmit={async (values) => {
            await updateDeclarations({ contractId: typedContractId, declarations: values });
            navigateToStep(nextStep(step));
          }}
        />
      ) : null}
    </Card>
  );
}

function PersonStepForm({
  label,
  initialValues,
  submitLabel,
  onBack,
  onSubmit,
}: {
  label: string;
  initialValues: Doc<"contracts">["seller"];
  submitLabel: string;
  onBack: () => void;
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
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="divide-y divide-[color:var(--dashboard-border)]">
        <FormSection title={`Dane ${label}`} description="Dane identyfikacyjne strony umowy.">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={`Imie ${label}`} error={errors.firstName?.message as string | undefined}>
              <Input {...register("firstName")} />
            </Field>
            <Field label={`Nazwisko ${label}`} error={errors.lastName?.message as string | undefined}>
              <Input {...register("lastName")} />
            </Field>
            <Field label="PESEL" error={errors.pesel?.message as string | undefined}>
              <Input {...register("pesel")} />
            </Field>
            <Field label="Nr dokumentu tozsamosci" error={errors.idDocumentNumber?.message as string | undefined}>
              <Input {...register("idDocumentNumber")} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Identyfikatory dodatkowe" description="Wypełnij tylko jeśli dotyczy." className="bg-[color:var(--dashboard-accent-soft)]/35">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="NIP" error={errors.nip?.message as string | undefined}>
              <Input {...register("nip")} />
            </Field>
            <Field label="REGON" error={errors.regon?.message as string | undefined}>
              <Input {...register("regon")} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Adres zamieszkania" description="Adres zgodny z dokumentem tożsamości.">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field className="sm:col-span-2" label="Ulica" error={errors.street?.message as string | undefined}>
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
            <Field className="sm:col-span-2" label="Kraj" error={errors.country?.message as string | undefined}>
              <Input {...register("country")} />
            </Field>
          </div>
        </FormSection>
      </div>

      <StickyActions submitLabel={submitLabel} isSubmitting={isSubmitting} onBack={onBack} />
    </form>
  );
}

function VehicleStepForm({
  initialValues,
  submitLabel,
  onBack,
  onSubmit,
}: {
  initialValues: Doc<"contracts">["vehicle"];
  submitLabel: string;
  onBack: () => void;
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
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="divide-y divide-[color:var(--dashboard-border)]">
        <FormSection title="Dane pojazdu" description="Podstawowe informacje identyfikujace pojazd.">
          <div className="grid gap-6 sm:grid-cols-2">
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
          </div>
        </FormSection>

        <FormSection title="Parametry techniczne" description="Dane potrzebne do jednoznacznego opisu pojazdu." className="bg-[color:var(--dashboard-accent-soft)]/35">
          <div className="grid gap-6 sm:grid-cols-2">
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
          </div>
        </FormSection>
      </div>

      <StickyActions submitLabel={submitLabel} isSubmitting={isSubmitting} onBack={onBack} />
    </form>
  );
}

function SaleTermsStepForm({
  initialValues,
  submitLabel,
  onBack,
  onSubmit,
}: {
  initialValues: Doc<"contracts">["saleTerms"];
  submitLabel: string;
  onBack: () => void;
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
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="divide-y divide-[color:var(--dashboard-border)]">
        <FormSection title="Warunki zawarcia" description="Kiedy i gdzie strony zawieraja umowe.">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Data sprzedazy" error={errors.saleDate?.message as string | undefined}>
              <Input type="date" {...register("saleDate")} />
            </Field>
            <Field label="Miejsce" error={errors.salePlace?.message as string | undefined}>
              <Input {...register("salePlace")} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Cena i przekazanie" description="Ustal sposób rozliczenia i datę wydania pojazdu." className="bg-[color:var(--dashboard-accent-soft)]/35">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Cena" error={errors.price?.message as string | undefined}>
              <Input type="number" step="0.01" {...register("price", { valueAsNumber: true })} />
            </Field>
            <Field label="Metoda platnosci" error={errors.paymentMethod?.message as string | undefined}>
              <Input {...register("paymentMethod")} />
            </Field>
            <Field label="Data przekazania" error={errors.handoverDate?.message as string | undefined}>
              <Input type="date" {...register("handoverDate")} />
            </Field>
          </div>
        </FormSection>
      </div>

      <StickyActions submitLabel={submitLabel} isSubmitting={isSubmitting} onBack={onBack} />
    </form>
  );
}

function DeclarationsStepForm({
  initialValues,
  submitLabel,
  onBack,
  onSubmit,
}: {
  initialValues: Doc<"contracts">["declarations"];
  submitLabel: string;
  onBack: () => void;
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
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="divide-y divide-[color:var(--dashboard-border)]">
        <FormSection title="Oświadczenia stron" description="Potwierdź informacje, które znajdą się w treści umowy.">
          <div className="space-y-3">
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
          </div>
        </FormSection>

        <FormSection title="Uwagi dodatkowe" description="Uzupełnij tylko wtedy, gdy trzeba doprecyzować stan pojazdu lub przekazanie." className="bg-[color:var(--dashboard-accent-soft)]/35">
          <div className="space-y-6">
            <Field label="Opis usterek" error={errors.defectsDescription?.message as string | undefined}>
              <Textarea {...register("defectsDescription")} />
            </Field>
            <Field label="Dodatkowe uwagi" error={errors.additionalNotes?.message as string | undefined}>
              <Textarea {...register("additionalNotes")} />
            </Field>
          </div>
        </FormSection>
      </div>

      <StickyActions submitLabel={submitLabel} isSubmitting={isSubmitting} onBack={onBack} />
    </form>
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
    <section className={cn("p-6 lg:p-8", className)}>
      <div className="mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--dashboard-text)]">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-6 text-[color:var(--dashboard-muted)]">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function StickyActions({
  submitLabel,
  isSubmitting,
  onBack,
}: {
  submitLabel: string;
  isSubmitting: boolean;
  onBack: () => void;
}) {
  return (
    <div className="sticky bottom-0 z-10 mt-auto flex flex-col items-center justify-between gap-4 rounded-b-[24px] border-t border-[color:var(--dashboard-border)] bg-white/92 p-4 backdrop-blur sm:flex-row-reverse lg:p-6">
      <div className="flex w-full gap-3 sm:w-auto">
        <Button className="flex-1 px-8 sm:flex-none" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Zapisywanie..." : submitLabel}
        </Button>
        <Button className="flex-1 sm:flex-none" type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Poprzedni krok
        </Button>
      </div>
      <div className="hidden items-center gap-2 text-[color:var(--dashboard-muted)] sm:flex">
        <ShieldCheck className="h-4 w-4" />
        <span className="text-xs font-semibold">Szkic zapisuje się po przejściu dalej</span>
      </div>
    </div>
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
    <div className={cn("space-y-1.5", className)}>
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs font-medium text-[color:var(--dashboard-danger)]">{error}</p> : null}
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
    <div className="flex items-start gap-3 rounded-2xl border border-[color:var(--dashboard-border)] bg-white/88 p-4">
      <input type="checkbox" className="mt-0.5 h-4 w-4 rounded-md border-[color:var(--dashboard-border)] text-[color:var(--dashboard-accent)]" {...inputProps} />
      <span className="text-sm leading-6 text-[color:var(--dashboard-text)]">{label}</span>
    </div>
  );
}
