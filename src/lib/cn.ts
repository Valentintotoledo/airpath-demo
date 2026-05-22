import clsx, { type ClassValue } from "clsx";

/** Merge class names. clsx handles conditional/array/object inputs. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
