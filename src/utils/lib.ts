import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes properly.
 * Uses clsx for conditional class joining and tailwind-merge to handle Tailwind class conflicts.
 *
 * @param inputs - Class values to be combined (strings, objects, arrays, etc.)
 * @returns A string of merged class names
 *
 * Example:
 * cn("text-red-500", isActive && "bg-blue-500", ["p-4", "m-2"])
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a currency value with the specified currency symbol and locale.
 *
 * @param value - The numeric value to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns A formatted currency string
 */
export function formatCurrency(
  value: number,
  currency = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

/**
 * Truncates a string to the specified maximum length and adds an ellipsis if truncated.
 *
 * @param str - The string to truncate
 * @param maxLength - The maximum length of the string (default: 50)
 * @returns The truncated string
 */
export function truncateString(str: string, maxLength = 50): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

/**
 * Debounces a function to limit how often it can be called.
 *
 * @param fn - The function to debounce
 * @param delay - The delay in milliseconds (default: 300)
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Generates a random ID with an optional prefix.
 *
 * @param prefix - Optional prefix for the ID
 * @returns A random ID string
 */
export function generateId(prefix = ""): string {
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `${prefix}${randomPart}`;
}
