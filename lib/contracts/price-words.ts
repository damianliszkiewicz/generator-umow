import { Slownie } from "slownie";

export function toPriceWords(price: number): string {
  if (!Number.isFinite(price) || price < 0) {
    return "zero";
  }

  const integerPrice = Math.floor(price);
  const grosze = Math.round((price - integerPrice) * 100);
  const converter = new Slownie();

  const zloteWords = converter.get(integerPrice).trim();
  const groszeFormatted = String(grosze).padStart(2, "0");

  return `${zloteWords} zł ${groszeFormatted}/100`;
}
