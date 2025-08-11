import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLargeNumber(num: number): string {
  const absNum = Math.abs(num);

  let value: number;
  let suffix = "";

  if (absNum >= 1_000_000_000) {
    value = num / 1_000_000_000;
    suffix = "B";
  } else if (absNum >= 1_000_000) {
    value = num / 1_000_000;
    suffix = "M";
  } else if (absNum >= 1_000) {
    value = num / 1_000;
    suffix = "K";
  } else {
    let numDecimals: number;
    if (num >= 100) {
      numDecimals = 0;
    } else if (num >= 10) {
      numDecimals = 2;
    } else if (num >= 1) {
      numDecimals = 3;
    } else {
      numDecimals = 4;
    }
    return num.toFixed(numDecimals).toString();
  }

  let decimals: number;
  if (value >= 100) decimals = 1;
  else if (value >= 10) decimals = 2;
  else if (value >= 1) decimals = 3;
  else decimals = 4;

  return parseFloat(value.toFixed(decimals)).toString() + suffix;
}
