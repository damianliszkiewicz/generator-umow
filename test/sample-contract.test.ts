import { describe, expect, it } from "vitest";

import {
  sampleAgreementGeneratedAtDisplay,
  sampleAgreementPdfFileName,
  sampleAgreementViewModel,
  sampleContractDraft,
} from "@/lib/contracts/sample-contract";

describe("sample contract helpers", () => {
  it("keeps a typed public sample draft and mapped preview model in sync", () => {
    expect(sampleContractDraft.title).toBe("Przykładowa umowa kupna-sprzedaży samochodu");
    expect(sampleAgreementViewModel.sellerDetails.fullName).toBe("Jan Kowalski");
    expect(sampleAgreementViewModel.buyerDetails.fullName).toBe("Anna Nowak");
    expect(sampleAgreementViewModel.vehicleDetails.find((item) => item.label === "Numer VIN")?.value).toBe(
      "JTDBR32E720123456",
    );
    expect(sampleAgreementViewModel.priceDisplay).toContain("58");
  });

  it("exposes stable public preview metadata values", () => {
    expect(sampleAgreementGeneratedAtDisplay).toBe("14 kwietnia 2026");
    expect(sampleAgreementPdfFileName).toBe("przykladowa-umowa-kupna-sprzedazy-samochodu.pdf");
  });
});
