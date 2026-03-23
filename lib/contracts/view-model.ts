import { toPriceWords } from "./price-words";
import type { ContractDraft } from "./types";

export type AgreementViewModel = {
  title: string;
  saleDate: string;
  salePlace: string;
  handoverDate: string;
  paymentMethod: string;
  price: number;
  priceWords: string;
  sellerLine: string;
  buyerLine: string;
  vehicleLine: string;
  declarations: Array<{ label: string; value: string }>;
  notes: string;
};

const personLine = (person: ContractDraft["seller"]) => {
  const apartmentPart = person.apartmentNumber ? `/${person.apartmentNumber}` : "";
  const nipPart = person.nip ? `, NIP: ${person.nip}` : "";
  const regonPart = person.regon ? `, REGON: ${person.regon}` : "";

  return `${person.firstName ?? "-"} ${person.lastName ?? "-"}, PESEL: ${person.pesel ?? "-"}${nipPart}${regonPart}, dokument: ${person.idDocumentNumber ?? "-"}, ${person.street ?? "-"} ${person.houseNumber ?? "-"}${apartmentPart}, ${person.postalCode ?? "-"} ${person.city ?? "-"}, ${person.country ?? "Polska"}`;
};

const boolLabel = (value: boolean | undefined) => (value ? "Tak" : "Nie");

export function mapContractToViewModel(contract: ContractDraft): AgreementViewModel {
  const price = Number(contract.saleTerms.price ?? 0);

  return {
    title: contract.title,
    saleDate: contract.saleTerms.saleDate ?? "-",
    salePlace: contract.saleTerms.salePlace ?? "-",
    handoverDate: contract.saleTerms.handoverDate ?? "-",
    paymentMethod: contract.saleTerms.paymentMethod ?? "-",
    price,
    priceWords: toPriceWords(price),
    sellerLine: personLine(contract.seller),
    buyerLine: personLine(contract.buyer),
    vehicleLine: `${contract.vehicle.brand ?? "-"} ${contract.vehicle.model ?? "-"}, rok ${contract.vehicle.year ?? "-"}, VIN ${contract.vehicle.vin ?? "-"}, nr rej. ${contract.vehicle.registrationNumber ?? "-"}, przebieg ${contract.vehicle.mileage ?? "-"} km`,
    declarations: [
      {
        label: "Sprzedający oświadcza, że jest właścicielem pojazdu",
        value: boolLabel(contract.declarations.sellerOwnsVehicle),
      },
      {
        label: "Pojazd jest wolny od obciążeń",
        value: boolLabel(contract.declarations.vehicleFreeOfLiens),
      },
      {
        label: "Kupujący zna stan techniczny pojazdu",
        value: boolLabel(contract.declarations.buyerKnowsTechnicalState),
      },
      {
        label: "Dokumenty pojazdu przekazane",
        value: boolLabel(contract.declarations.documentsTransferred),
      },
      {
        label: "Kluczyki przekazane",
        value: boolLabel(contract.declarations.keysTransferred),
      },
    ],
    notes:
      contract.declarations.additionalNotes ||
      contract.declarations.defectsDescription ||
      "Brak dodatkowych uwag.",
  };
}
