import { describe, expect, it } from "vitest";

import { mergeContractSection } from "@/lib/contracts/merge";
import type { ContractDraft } from "@/lib/contracts/types";

const baseContract: ContractDraft = {
  _id: "test-id",
  _creationTime: Date.now(),
  ownerTokenIdentifier: "user|1",
  title: "Umowa testowa",
  status: "draft",
  seller: {
    firstName: "Jan",
    lastName: "Kowalski",
  },
  buyer: {
    firstName: "Anna",
    lastName: "Nowak",
  },
  vehicle: {
    brand: "Toyota",
    model: "Corolla",
  },
  saleTerms: {
    price: 10000,
  },
  declarations: {
    sellerOwnsVehicle: true,
  },
  updatedAt: Date.now(),
};

describe("mergeContractSection", () => {
  it("updates only target section keys", () => {
    const mergedBuyer = mergeContractSection(baseContract, "buyer", { city: "Gdansk" });

    expect(mergedBuyer.firstName).toBe("Anna");
    expect(mergedBuyer.city).toBe("Gdansk");
    expect(baseContract.seller.firstName).toBe("Jan");
    expect(baseContract.vehicle.brand).toBe("Toyota");
  });
});
