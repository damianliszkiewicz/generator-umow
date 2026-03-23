import { describe, expect, it } from "vitest";

import { personSchema, saleTermsSchema, vehicleSchema } from "@/lib/contracts/schemas";
import { isValidNip, isValidPesel, isValidRegon } from "@/lib/contracts/validators";

describe("checksum validators", () => {
  it("validates PESEL", () => {
    expect(isValidPesel("44051401458")).toBe(true);
    expect(isValidPesel("44051401459")).toBe(false);
  });

  it("validates NIP", () => {
    expect(isValidNip("8567346215")).toBe(true);
    expect(isValidNip("8567346216")).toBe(false);
  });

  it("validates REGON", () => {
    expect(isValidRegon("590096454")).toBe(true);
    expect(isValidRegon("590096455")).toBe(false);
  });
});

describe("zod schemas", () => {
  it("rejects invalid VIN length", () => {
    const result = vehicleSchema.safeParse({
      brand: "Toyota",
      model: "Corolla",
      version: "1.6",
      year: 2018,
      vin: "123",
      registrationNumber: "WA12345",
      mileage: 123000,
      color: "Czarny",
      engineCapacity: 1598,
      fuelType: "Benzyna",
      firstRegistrationDate: "2019-01-01",
      vehicleCardNumber: "AB123456",
    });

    expect(result.success).toBe(false);
  });

  it("rejects non-positive price", () => {
    const result = saleTermsSchema.safeParse({
      saleDate: "2026-03-22",
      salePlace: "Warszawa",
      price: 0,
      paymentMethod: "Przelew",
      handoverDate: "2026-03-23",
    });

    expect(result.success).toBe(false);
  });

  it("requires mandatory person fields", () => {
    const result = personSchema.safeParse({
      firstName: "",
      lastName: "",
      pesel: "123",
      nip: "",
      regon: "",
      idDocumentNumber: "",
      street: "",
      houseNumber: "",
      apartmentNumber: "",
      postalCode: "00-000",
      city: "",
      country: "Polska",
    });

    expect(result.success).toBe(false);
  });
});
