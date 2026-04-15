import type { ContractDraft } from "@/lib/contracts/types";
import { mapContractToViewModel } from "@/lib/contracts/view-model";

export const sampleAgreementPdfFileName = "przykladowa-umowa-kupna-sprzedazy-samochodu.pdf";
export const sampleAgreementGeneratedAtDisplay = "14 kwietnia 2026";

export const sampleContractDraft: ContractDraft = {
  _id: "public-sample-contract",
  _creationTime: 1760000000000,
  ownerTokenIdentifier: "public-sample",
  title: "Przykładowa umowa kupna-sprzedaży samochodu",
  status: "ready",
  seller: {
    firstName: "Jan",
    lastName: "Kowalski",
    pesel: "85010212345",
    idDocumentNumber: "ABC123456",
    street: "Marszałkowska",
    houseNumber: "15",
    apartmentNumber: "8",
    postalCode: "00-590",
    city: "Warszawa",
    country: "Polska",
  },
  buyer: {
    firstName: "Anna",
    lastName: "Nowak",
    pesel: "90031567890",
    idDocumentNumber: "CBA654321",
    street: "Puławska",
    houseNumber: "120",
    apartmentNumber: "14",
    postalCode: "02-624",
    city: "Warszawa",
    country: "Polska",
  },
  vehicle: {
    brand: "Toyota",
    model: "Corolla",
    version: "Comfort",
    year: 2019,
    vin: "JTDBR32E720123456",
    registrationNumber: "WA 1234K",
    mileage: 118500,
    color: "Grafitowy",
    engineCapacity: 1598,
    fuelType: "Benzyna",
    firstRegistrationDate: "2019-05-22",
    vehicleCardNumber: "KP/1234567",
  },
  saleTerms: {
    saleDate: "2026-04-14",
    salePlace: "Warszawa",
    price: 58900,
    paymentMethod: "Przelew bankowy",
    handoverDate: "2026-04-14",
  },
  declarations: {
    sellerOwnsVehicle: true,
    vehicleFreeOfLiens: true,
    buyerKnowsTechnicalState: true,
    defectsDescription: "Kupujący został poinformowany o drobnych rysach na tylnym zderzaku.",
    documentsTransferred: true,
    keysTransferred: true,
    additionalNotes:
      "Strony potwierdzają przekazanie dwóch kompletów kluczyków oraz aktualnej polisy OC.",
  },
  updatedAt: 1760000000000,
};

export const sampleAgreementViewModel = mapContractToViewModel(sampleContractDraft);
