import { toPriceWords } from "./price-words";
import type { ContractDraft } from "./types";

export type AgreementPartyDetails = {
  fullName: string;
  details: string[];
  addressLine: string;
};

export type AgreementDetailItem = {
  label: string;
  value: string;
  mono?: boolean;
  emphasize?: boolean;
};

export type AgreementTextSection = {
  title: string;
  content: string;
};

export type AgreementViewModel = {
  title: string;
  saleDate: string;
  saleDateDisplay: string;
  salePlace: string;
  salePlaceDisplay: string;
  handoverDate: string;
  handoverDateDisplay: string;
  documentLocationAndDateLine: string;
  paymentMethod: string;
  price: number;
  priceDisplay: string;
  priceWords: string;
  sellerLine: string;
  buyerLine: string;
  vehicleLine: string;
  sellerDetails: AgreementPartyDetails;
  buyerDetails: AgreementPartyDetails;
  vehicleDetails: AgreementDetailItem[];
  saleDetails: AgreementDetailItem[];
  declarations: Array<{ label: string; value: string }>;
  supplementarySections: AgreementTextSection[];
};

const textOrFallback = (value: string | number | undefined, fallback = "-") => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : fallback;
  }

  if (!value) {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const optionalText = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const formatPolishDate = (value: string | undefined) => {
  if (!value) {
    return "-";
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

const formatEngineCapacity = (value: number | undefined) => {
  if (value === undefined || !Number.isFinite(value)) {
    return "-";
  }

  return `${value} cm3`;
};

const addressLine = (person: ContractDraft["seller"]) => {
  const apartmentPart = person.apartmentNumber ? `/${person.apartmentNumber}` : "";
  const street = textOrFallback(person.street);
  const houseNumber = textOrFallback(person.houseNumber);
  const postalCode = textOrFallback(person.postalCode);
  const city = textOrFallback(person.city);
  const country = textOrFallback(person.country, "Polska");

  return `${street} ${houseNumber}${apartmentPart}, ${postalCode} ${city}, ${country}`;
};

const personLine = (person: ContractDraft["seller"]) => {
  const apartmentPart = person.apartmentNumber ? `/${person.apartmentNumber}` : "";
  const nipPart = person.nip ? `, NIP: ${person.nip}` : "";
  const regonPart = person.regon ? `, REGON: ${person.regon}` : "";

  return `${person.firstName ?? "-"} ${person.lastName ?? "-"}, PESEL: ${person.pesel ?? "-"}${nipPart}${regonPart}, dokument: ${person.idDocumentNumber ?? "-"}, ${person.street ?? "-"} ${person.houseNumber ?? "-"}${apartmentPart}, ${person.postalCode ?? "-"} ${person.city ?? "-"}, ${person.country ?? "Polska"}`;
};

const partyDetails = (person: ContractDraft["seller"]): AgreementPartyDetails => {
  const fullName = [person.firstName, person.lastName].filter(Boolean).join(" ").trim() || "-";
  const details = [
    `PESEL: ${textOrFallback(person.pesel)}`,
    `Dokument tożsamości: ${textOrFallback(person.idDocumentNumber)}`,
    ...(person.nip ? [`NIP: ${person.nip}`] : []),
    ...(person.regon ? [`REGON: ${person.regon}`] : []),
  ];

  return {
    fullName,
    details,
    addressLine: addressLine(person),
  };
};

const boolLabel = (value: boolean | undefined) => (value ? "Tak" : "Nie");

const transferSummary = (documentsTransferred: boolean | undefined, keysTransferred: boolean | undefined) =>
  `Dokumenty: ${boolLabel(documentsTransferred)}, kluczyki: ${boolLabel(keysTransferred)}`;

export function mapContractToViewModel(contract: ContractDraft): AgreementViewModel {
  const price = Number(contract.saleTerms.price ?? 0);
  const salePlaceDisplay = textOrFallback(contract.saleTerms.salePlace);
  const saleDateDisplay = formatPolishDate(contract.saleTerms.saleDate);
  const handoverDateDisplay = formatPolishDate(contract.saleTerms.handoverDate);
  const firstRegistrationDateDisplay = formatPolishDate(contract.vehicle.firstRegistrationDate);
  const sellerDetails = partyDetails(contract.seller);
  const buyerDetails = partyDetails(contract.buyer);
  const vehicleDetails: AgreementDetailItem[] = [
    {
      label: "Marka i model",
      value:
        [contract.vehicle.brand, contract.vehicle.model, contract.vehicle.version]
          .filter(Boolean)
          .join(" ") || "-",
    },
    {
      label: "Rok produkcji",
      value: textOrFallback(contract.vehicle.year),
    },
    {
      label: "Numer VIN",
      value: textOrFallback(contract.vehicle.vin),
      mono: true,
    },
    {
      label: "Nr rejestracyjny",
      value: textOrFallback(contract.vehicle.registrationNumber),
    },
    {
      label: "Przebieg",
      value:
        contract.vehicle.mileage !== undefined && Number.isFinite(contract.vehicle.mileage)
          ? `${contract.vehicle.mileage} km`
          : "-",
    },
    {
      label: "Pojemność silnika",
      value: formatEngineCapacity(contract.vehicle.engineCapacity),
    },
    {
      label: "Rodzaj paliwa",
      value: textOrFallback(contract.vehicle.fuelType),
    },
    {
      label: "Data pierwszej rejestracji",
      value: firstRegistrationDateDisplay,
    },
  ];

  const color = optionalText(contract.vehicle.color);
  if (color) {
    vehicleDetails.push({
      label: "Kolor",
      value: color,
    });
  }

  const vehicleCardNumber = optionalText(contract.vehicle.vehicleCardNumber);
  if (vehicleCardNumber) {
    vehicleDetails.push({
      label: "Numer karty pojazdu",
      value: vehicleCardNumber,
    });
  }

  const priceDisplay = `${formatPrice(price)} PLN`;
  const saleDetails: AgreementDetailItem[] = [
    {
      label: "Cena sprzedaży",
      value: priceDisplay,
      emphasize: true,
    },
    {
      label: "Słownie",
      value: toPriceWords(price),
    },
    {
      label: "Sposób płatności",
      value: textOrFallback(contract.saleTerms.paymentMethod),
    },
    {
      label: "Data zawarcia",
      value: saleDateDisplay,
    },
    {
      label: "Miejsce zawarcia",
      value: salePlaceDisplay,
    },
    {
      label: "Data przekazania",
      value: handoverDateDisplay,
    },
  ];

  const defectsDescription = optionalText(contract.declarations.defectsDescription);
  const additionalNotes = optionalText(contract.declarations.additionalNotes);
  const supplementarySections: AgreementTextSection[] = [];

  if (defectsDescription) {
    supplementarySections.push({
      title: "Wady pojazdu ujawnione kupującemu",
      content: defectsDescription,
    });
  }

  if (additionalNotes) {
    supplementarySections.push({
      title: "Uwagi dodatkowe",
      content: additionalNotes,
    });
  }

  supplementarySections.push({
    title: "Postanowienia końcowe",
    content: "Umowę sporządzono w dwóch jednobrzmiących egzemplarzach, po jednym dla każdej ze stron.",
  });

  return {
    title: contract.title,
    saleDate: contract.saleTerms.saleDate ?? "-",
    saleDateDisplay,
    salePlace: contract.saleTerms.salePlace ?? "-",
    salePlaceDisplay,
    handoverDate: contract.saleTerms.handoverDate ?? "-",
    handoverDateDisplay,
    documentLocationAndDateLine: `${salePlaceDisplay}, ${saleDateDisplay}`,
    paymentMethod: contract.saleTerms.paymentMethod ?? "-",
    price,
    priceDisplay,
    priceWords: toPriceWords(price),
    sellerLine: personLine(contract.seller),
    buyerLine: personLine(contract.buyer),
    vehicleLine: `${contract.vehicle.brand ?? "-"} ${contract.vehicle.model ?? "-"}, rok ${contract.vehicle.year ?? "-"}, VIN ${contract.vehicle.vin ?? "-"}, nr rej. ${contract.vehicle.registrationNumber ?? "-"}, przebieg ${contract.vehicle.mileage ?? "-"} km`,
    sellerDetails,
    buyerDetails,
    vehicleDetails,
    saleDetails,
    declarations: [
      {
        label: "Sprzedający oświadcza, że pojazd stanowi jego własność.",
        value: boolLabel(contract.declarations.sellerOwnsVehicle),
      },
      {
        label:
          "Sprzedający oświadcza, że pojazd nie jest obciążony prawami osób trzecich, nie stanowi przedmiotu zabezpieczenia ani postępowania egzekucyjnego.",
        value: boolLabel(contract.declarations.vehicleFreeOfLiens),
      },
      {
        label:
          "Kupujący oświadcza, że zapoznał się ze stanem technicznym pojazdu, w tym z wadami ujawnionymi w niniejszej umowie.",
        value: boolLabel(contract.declarations.buyerKnowsTechnicalState),
      },
      {
        label:
          "W dniu przekazania sprzedający wydaje kupującemu pojazd wraz z przekazywanymi dokumentami i kluczykami.",
        value: transferSummary(
          contract.declarations.documentsTransferred,
          contract.declarations.keysTransferred,
        ),
      },
    ],
    supplementarySections,
  };
}
