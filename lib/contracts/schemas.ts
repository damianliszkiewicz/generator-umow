import { z } from "zod";

import { isValidNip, isValidPesel, isValidRegon } from "./validators";

const requiredText = (label: string, min = 2) =>
  z
    .string({ message: `${label} jest wymagane.` })
    .trim()
    .min(min, `${label} jest wymagane.`);

const optionalTrimmedText = z.string().trim().optional().or(z.literal(""));

export const personSchema = z.object({
  firstName: requiredText("Imię"),
  lastName: requiredText("Nazwisko"),
  pesel: z
    .string({ message: "PESEL jest wymagany." })
    .trim()
    .regex(/^\d{11}$/, "PESEL musi mieć 11 cyfr.")
    .refine(isValidPesel, "PESEL jest nieprawidłowy."),
  nip: optionalTrimmedText.refine((value) => !value || isValidNip(value), "NIP jest nieprawidłowy."),
  regon: optionalTrimmedText.refine(
    (value) => !value || isValidRegon(value),
    "REGON jest nieprawidłowy.",
  ),
  idDocumentNumber: requiredText("Numer dokumentu tożsamości"),
  street: requiredText("Ulica"),
  houseNumber: requiredText("Numer domu", 1),
  apartmentNumber: optionalTrimmedText,
  postalCode: z
    .string({ message: "Kod pocztowy jest wymagany." })
    .trim()
    .regex(/^\d{2}-\d{3}$/, "Kod pocztowy musi mieć format 00-000."),
  city: requiredText("Miejscowość"),
  country: requiredText("Kraj", 1).default("Polska"),
});

export const vehicleSchema = z.object({
  brand: requiredText("Marka"),
  model: requiredText("Model"),
  version: optionalTrimmedText,
  year: z.coerce
    .number({ message: "Rok produkcji jest wymagany." })
    .int("Rok produkcji musi być liczbą całkowitą.")
    .min(1950, "Rok produkcji nie może być wcześniejszy niż 1950.")
    .max(new Date().getFullYear() + 1, "Rok produkcji jest nieprawidłowy."),
  vin: z
    .string({ message: "VIN jest wymagany." })
    .trim()
    .toUpperCase()
    .length(17, "VIN musi mieć dokładnie 17 znaków.")
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, "VIN zawiera niedozwolone znaki."),
  registrationNumber: requiredText("Numer rejestracyjny"),
  mileage: z.coerce.number({ message: "Przebieg jest wymagany." }).nonnegative("Przebieg nie może być ujemny."),
  color: optionalTrimmedText,
  engineCapacity: z.coerce
    .number({ message: "Pojemność silnika jest wymagana." })
    .positive("Pojemność silnika musi być dodatnia."),
  fuelType: requiredText("Rodzaj paliwa"),
  firstRegistrationDate: z
    .string({ message: "Data pierwszej rejestracji jest wymagana." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data musi mieć format RRRR-MM-DD."),
  vehicleCardNumber: optionalTrimmedText,
});

export const saleTermsSchema = z.object({
  saleDate: z
    .string({ message: "Data sprzedaży jest wymagana." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data musi mieć format RRRR-MM-DD."),
  salePlace: requiredText("Miejsce zawarcia umowy"),
  price: z.coerce.number({ message: "Cena jest wymagana." }).positive("Cena musi być dodatnia."),
  paymentMethod: requiredText("Metoda płatności"),
  handoverDate: z
    .string({ message: "Data przekazania pojazdu jest wymagana." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data musi mieć format RRRR-MM-DD."),
});

export const declarationsSchema = z.object({
  sellerOwnsVehicle: z.boolean(),
  vehicleFreeOfLiens: z.boolean(),
  buyerKnowsTechnicalState: z.boolean(),
  defectsDescription: optionalTrimmedText,
  documentsTransferred: z.boolean(),
  keysTransferred: z.boolean(),
  additionalNotes: optionalTrimmedText,
});

export const contractDraftSchema = z.object({
  title: z.string().trim().min(1, "Tytuł jest wymagany."),
  seller: personSchema,
  buyer: personSchema,
  vehicle: vehicleSchema,
  saleTerms: saleTermsSchema,
  declarations: declarationsSchema,
});

export type PersonFormValues = z.infer<typeof personSchema>;
export type VehicleFormValues = z.infer<typeof vehicleSchema>;
export type SaleTermsFormValues = z.infer<typeof saleTermsSchema>;
export type DeclarationsFormValues = z.infer<typeof declarationsSchema>;
export type ContractDraftFormValues = z.infer<typeof contractDraftSchema>;

export const wizardStepOrder = [
  "sprzedajacy",
  "kupujacy",
  "pojazd",
  "warunki",
  "oswiadczenia",
  "podglad",
] as const;

export type WizardStep = (typeof wizardStepOrder)[number];

export const wizardStepLabels: Record<WizardStep, string> = {
  sprzedajacy: "Sprzedający",
  kupujacy: "Kupujący",
  pojazd: "Pojazd",
  warunki: "Warunki sprzedaży",
  oswiadczenia: "Oświadczenia",
  podglad: "Podgląd",
};

export function normalizeStep(value: string | undefined): WizardStep {
  if (!value) {
    return "sprzedajacy";
  }

  return wizardStepOrder.includes(value as WizardStep) ? (value as WizardStep) : "sprzedajacy";
}
