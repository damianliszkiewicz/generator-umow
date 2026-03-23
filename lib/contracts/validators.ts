const digitsOnly = (value: string) => value.replace(/\D/g, "");

export function isValidPesel(value: string): boolean {
  const digits = digitsOnly(value);
  if (!/^\d{11}$/.test(digits)) {
    return false;
  }

  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  const sum = weights.reduce((acc, weight, index) => acc + weight * Number(digits[index]), 0);
  const checksum = (10 - (sum % 10)) % 10;

  return checksum === Number(digits[10]);
}

export function isValidNip(value: string): boolean {
  const digits = digitsOnly(value);
  if (!/^\d{10}$/.test(digits)) {
    return false;
  }

  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  const sum = weights.reduce((acc, weight, index) => acc + weight * Number(digits[index]), 0);
  const checksum = sum % 11;

  return checksum !== 10 && checksum === Number(digits[9]);
}

export function isValidRegon(value: string): boolean {
  const digits = digitsOnly(value);

  if (/^\d{9}$/.test(digits)) {
    const weights = [8, 9, 2, 3, 4, 5, 6, 7];
    const sum = weights.reduce((acc, weight, index) => acc + weight * Number(digits[index]), 0);
    const checksum = sum % 11 === 10 ? 0 : sum % 11;
    return checksum === Number(digits[8]);
  }

  if (/^\d{14}$/.test(digits)) {
    const weights = [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8];
    const sum = weights.reduce((acc, weight, index) => acc + weight * Number(digits[index]), 0);
    const checksum = sum % 11 === 10 ? 0 : sum % 11;
    return checksum === Number(digits[13]);
  }

  return false;
}
