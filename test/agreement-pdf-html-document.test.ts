import { describe, expect, it } from "vitest";

import { buildAgreementPdfHtmlDocument } from "@/components/contracts/agreement-pdf-html-document";
import { mapContractToViewModel } from "@/lib/contracts/view-model";
import type { ContractDraft } from "@/lib/contracts/types";

const contract: ContractDraft = {
  _id: "contract-1",
  _creationTime: Date.now(),
  ownerTokenIdentifier: "user|1",
  title: "Umowa testowa",
  status: "draft",
  seller: {
    firstName: "Jan",
    lastName: "Kowalski",
    pesel: "44051401458",
    idDocumentNumber: "ABC123456",
    street: "Wiejska",
    houseNumber: "12",
    apartmentNumber: "4",
    postalCode: "00-001",
    city: "Warszawa",
    country: "Polska",
  },
  buyer: {
    firstName: "Anna",
    lastName: "Nowak",
    pesel: "02211301458",
    idDocumentNumber: "DEF987654",
    street: "Dluga",
    houseNumber: "5",
    postalCode: "30-002",
    city: "Krakow",
    country: "Polska",
  },
  vehicle: {
    brand: "Volkswagen",
    model: "Golf",
    version: "Comfortline",
    year: 2018,
    vin: "WVWZZZ1KZEW123456",
    registrationNumber: "WA12345",
    mileage: 145000,
    color: "Srebrny",
    engineCapacity: 1598,
    fuelType: "Benzyna",
    firstRegistrationDate: "2018-05-12",
  },
  saleTerms: {
    saleDate: "2026-03-23",
    salePlace: "Warszawa",
    price: 45000,
    paymentMethod: "Przelew",
    handoverDate: "2026-03-24",
  },
  declarations: {
    sellerOwnsVehicle: true,
    vehicleFreeOfLiens: true,
    buyerKnowsTechnicalState: true,
    documentsTransferred: true,
    keysTransferred: true,
    defectsDescription: "Rysa na tylnym zderzaku.",
    additionalNotes: "Dwa komplety kluczykow.",
  },
  updatedAt: Date.now(),
};

describe("buildAgreementPdfHtmlDocument", () => {
  it("renders defects, additional notes, new vehicle fields and the final clause", () => {
    const html = buildAgreementPdfHtmlDocument(mapContractToViewModel(contract), {
      generatedAtDisplay: "24 marca 2026",
      documentLabel: "Umowa kupna-sprzedaży pojazdu",
      pageIndicator: "Strona 1 / 1",
      documentBadge: "Oryginał",
    });

    expect(html).toContain("Wady pojazdu ujawnione kupującemu");
    expect(html).toContain("Uwagi dodatkowe");
    expect(html).toContain("Pojemność silnika");
    expect(html).toContain("Rodzaj paliwa");
    expect(html).toContain("Data pierwszej rejestracji");
    expect(html).toContain("Umowę sporządzono w dwóch jednobrzmiących egzemplarzach");
  });

  it("does not render an empty vehicle card label when the value is missing", () => {
    const html = buildAgreementPdfHtmlDocument(
      mapContractToViewModel({
        ...contract,
        vehicle: {
          ...contract.vehicle,
          vehicleCardNumber: "",
        },
      }),
      {
        generatedAtDisplay: "24 marca 2026",
        documentLabel: "Umowa kupna-sprzedaży pojazdu",
        pageIndicator: "Strona 1 / 1",
      },
    );

    expect(html).not.toContain("Numer karty pojazdu");
  });
});