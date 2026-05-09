import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isMockMode = (): boolean => {
  return import.meta.env.VITE_USE_MOCK !== 'false'
}
