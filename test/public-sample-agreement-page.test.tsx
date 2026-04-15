// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PublicSampleAgreementPage } from "@/components/marketing/public-sample-agreement-page";

describe("PublicSampleAgreementPage", () => {
  it("renders the public sample preview with a PDF action", () => {
    render(<PublicSampleAgreementPage />);

    expect(
      screen.getByRole("heading", {
        name: /Publiczny podgląd końcowego dokumentu przed wydrukiem/i,
      }),
    ).toBeTruthy();

    expect(
      screen.getByRole("button", {
        name: "Pobierz przykładowy PDF",
      }),
    ).toBeTruthy();

    expect(screen.getAllByText("Umowa kupna-sprzedaży pojazdu").length).toBeGreaterThan(0);
  });

  it("shows preview metadata for the public example", () => {
    render(<PublicSampleAgreementPage />);

    expect(screen.getAllByText(/Przykład publiczny/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Wygenerowano: 14 kwietnia 2026/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Strona 1 \/ 1/i)).toBeTruthy();
  });
});
