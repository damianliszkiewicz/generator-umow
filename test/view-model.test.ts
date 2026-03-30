import { describe, expect, it } from "vitest";

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
    nip: "8567346215",
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
    vehicleCardNumber: "KP/1234567",
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
    buyerKnowsTechnicalState: false,
    documentsTransferred: true,
    keysTransferred: true,
    defectsDescription: "Rysa na tylnym zderzaku.",
    additionalNotes: "Dwa komplety kluczykow.",
  },
  updatedAt: Date.now(),
};

describe("mapContractToViewModel", () => {
  it("builds structured party and vehicle details for preview and PDF", () => {
    const viewModel = mapContractToViewModel(contract);

    expect(viewModel.documentLocationAndDateLine).toContain("Warszawa");
    expect(viewModel.sellerDetails.fullName).toBe("Jan Kowalski");
    expect(viewModel.sellerDetails.details).toContain("PESEL: 44051401458");
    expect(viewModel.vehicleDetails.find((item) => item.label === "Numer VIN")?.mono).toBe(true);
    expect(viewModel.vehicleDetails.find((item) => item.label === "Pojemność silnika")?.value).toBe(
      "1598 cm3",
    );
    expect(viewModel.vehicleDetails.find((item) => item.label === "Rodzaj paliwa")?.value).toBe("Benzyna");
    expect(viewModel.vehicleDetails.find((item) => item.label === "Data pierwszej rejestracji")?.value).toContain(
      "2018",
    );
    expect(viewModel.vehicleDetails.find((item) => item.label === "Numer karty pojazdu")?.value).toBe(
      "KP/1234567",
    );
    expect(viewModel.saleDetails.find((item) => item.label === "Cena sprzedaży")?.value).toContain("PLN");
  });

  it("maps defects and additional notes into separate supplementary sections", () => {
    const viewModel = mapContractToViewModel(contract);

    expect(viewModel.supplementarySections).toEqual([
      {
        title: "Wady pojazdu ujawnione kupującemu",
        content: "Rysa na tylnym zderzaku.",
      },
      {
        title: "Uwagi dodatkowe",
        content: "Dwa komplety kluczykow.",
      },
      {
        title: "Postanowienia końcowe",
        content: "Umowę sporządzono w dwóch jednobrzmiących egzemplarzach, po jednym dla każdej ze stron.",
      },
    ]);
  });

  it("renders only the defects section when additional notes are empty", () => {
    const viewModel = mapContractToViewModel({
      ...contract,
      declarations: {
        ...contract.declarations,
        additionalNotes: "",
      },
    });

    expect(viewModel.supplementarySections).toEqual([
      {
        title: "Wady pojazdu ujawnione kupującemu",
        content: "Rysa na tylnym zderzaku.",
      },
      {
        title: "Postanowienia końcowe",
        content: "Umowę sporządzono w dwóch jednobrzmiących egzemplarzach, po jednym dla każdej ze stron.",
      },
    ]);
  });

  it("renders only the additional notes section when defects are empty", () => {
    const viewModel = mapContractToViewModel({
      ...contract,
      declarations: {
        ...contract.declarations,
        defectsDescription: "",
      },
    });

    expect(viewModel.supplementarySections).toEqual([
      {
        title: "Uwagi dodatkowe",
        content: "Dwa komplety kluczykow.",
      },
      {
        title: "Postanowienia końcowe",
        content: "Umowę sporządzono w dwóch jednobrzmiących egzemplarzach, po jednym dla każdej ze stron.",
      },
    ]);
  });

  it("omits optional vehicle card number when it is missing", () => {
    const viewModel = mapContractToViewModel({
      ...contract,
      vehicle: {
        ...contract.vehicle,
        vehicleCardNumber: "",
      },
    });

    expect(viewModel.vehicleDetails.find((item) => item.label === "Numer karty pojazdu")).toBeUndefined();
  });
});