// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PublicLandingPage } from "@/components/marketing/public-landing-page";

describe("PublicLandingPage", () => {
  it("renders the specialist hero and primary public CTAs", () => {
    render(<PublicLandingPage />);

    expect(
      screen.getByRole("heading", {
        name: /Specjalistyczna umowa kupna-sprzedaży samochodu bez zgadywania układu dokumentu/i,
      }),
    ).toBeTruthy();

    expect(
      screen.getByRole("link", {
        name: "Załóż konto i przygotuj umowę",
      }).getAttribute("href"),
    ).toBe("/sign-up");

    expect(
      screen.getAllByRole("link", {
        name: "Zobacz przykładową umowę",
      })[0]?.getAttribute("href"),
    ).toBe("/przykladowa-umowa");
  });

  it("keeps copy aligned with MVP instead of unsupported marketing claims", () => {
    render(<PublicLandingPage />);

    expect(screen.queryByText(/45,000\+/i)).toBeNull();
    expect(screen.queryByText(/100% zgod/i)).toBeNull();
    expect(screen.queryByText(/pomoc specjalisty/i)).toBeNull();
    expect(screen.getByText(/Szkice i historia dokumentów/i)).toBeTruthy();
  });
});
