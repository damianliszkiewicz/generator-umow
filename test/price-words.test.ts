import { describe, expect, it } from "vitest";

import { toPriceWords } from "@/lib/contracts/price-words";

describe("toPriceWords", () => {
  it("returns Polish words with grosze suffix", () => {
    const result = toPriceWords(1234.56);

    expect(result).toContain("zł");
    expect(result).toContain("56/100");
  });

  it("handles invalid input safely", () => {
    expect(toPriceWords(Number.NaN)).toBe("zero");
  });
});
