import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const mergeClassNames = (...classValues: ClassValue[]) => {
  return twMerge(clsx(classValues));
};