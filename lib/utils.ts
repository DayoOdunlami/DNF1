import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRoomCode(): string {
  const prefix = "TURBO";
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const suffix = Array.from({ length: 4 }, () => 
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `${prefix}-${suffix}`;
}


