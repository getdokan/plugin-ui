import { clsx, type ClassValue } from "clsx";
import { twMerge as tailwindMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind conflict resolution.
 * Combines clsx for conditional classes with tailwind-merge for deduplication.
 *
 * @param inputs - Class name values to merge
 * @returns Merged class string
 *
 * @example
 * ```tsx
 * cn("px-2 py-1", "px-4") // "py-1 px-4"
 * cn("text-red-500", condition && "text-blue-500")
 * cn({ "bg-primary": isActive })
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return tailwindMerge(clsx(inputs));
}

/**
 * Re-export twMerge for direct usage.
 */
export { tailwindMerge as twMerge };
