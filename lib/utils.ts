import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...classValues: ClassValue[]): string => {
  return twMerge(clsx(classValues));
};