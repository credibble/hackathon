import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLargeNumber(num: number): string {
  if (num === 0) return "0";

  const absNum = Math.abs(num);

  // Helper: Trims trailing zeros while keeping up to `maxDecimals`
  const toFixedTrimmed = (value: number, maxDecimals: number): string => {
    const str = value.toFixed(maxDecimals);
    return str.replace(/(\.\d*?[1-9])0+$|\.0+$/, "$1"); // Trim trailing zeros
  };

  // Very small numbers (0 < absNum < 0.0001)
  if (absNum > 0 && absNum < 0.0001) {
    const exponent = Math.floor(Math.log10(absNum));
    const firstDigit = Math.floor(absNum * 10 ** -exponent);
    const zeros = -exponent - 1;
    const limitedZeros = Math.min(zeros, 5);
    return `<0.${"0".repeat(limitedZeros)}${firstDigit}`;
  }

  // Numbers below 1,000 (dynamic decimals)
  if (absNum < 1000) {
    if (absNum >= 100) return toFixedTrimmed(absNum, 3); // e.g., 100 → "100"
    if (absNum >= 10) return toFixedTrimmed(absNum, 4); // e.g., 10.5 → "10.5"
    if (absNum >= 1) return toFixedTrimmed(absNum, 5); // e.g., 1.25 → "1.25"
    return toFixedTrimmed(absNum, 5); // e.g., 0.00123 → "0.00123"
  }

  // Large numbers (K, M, B suffixes)
  let value: number;
  let suffix: string;

  if (absNum >= 1_000_000_000) {
    value = absNum / 1_000_000_000;
    suffix = "B";
  } else if (absNum >= 1_000_000) {
    value = absNum / 1_000_000;
    suffix = "M";
  } else {
    value = absNum / 1_000;
    suffix = "K";
  }

  // Dynamic decimals for large numbers (trim trailing zeros)
  if (value >= 100) return `${toFixedTrimmed(value, 1)}${suffix}`; // e.g., 100.0K → "100K"
  if (value >= 10) return `${toFixedTrimmed(value, 2)}${suffix}`; // e.g., 12.50K → "12.5K"
  return `${toFixedTrimmed(value, 5)}${suffix}`; // e.g., 1.00123K → "1.00123K"
}
