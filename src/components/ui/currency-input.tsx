import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "./input-group";

/** Chevron-down icon for dropdowns */
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export interface CurrencyOption {
  value: string;
  label: string;
}

export interface CurrencyInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /**
   * Selected currency code (e.g. "USD").
   */
  currency?: string;

  /**
   * Called when the user changes the currency.
   */
  onCurrencyChange?: (currency: string) => void;

  /**
   * List of currency options. Defaults to common currencies if not provided.
   */
  currencyOptions?: CurrencyOption[];

  /**
   * Placeholder for the amount input.
   * @default "Type something"
   */
  placeholder?: string;

  /**
   * Additional CSS classes for the root wrapper.
   */
  className?: string;

  /**
   * Custom content for the currency selector (replaces the default select).
   */
  currencySelector?: ReactNode;
}

const DEFAULT_CURRENCIES: CurrencyOption[] = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "BDT", label: "BDT" },
  { value: "INR", label: "INR" },
];

/**
 * Input with currency dropdown on the right. Built with InputGroup + rightAddon.
 *
 * @example
 * ```tsx
 * <CurrencyInput
 *   placeholder="0.00"
 *   currency="USD"
 *   onCurrencyChange={(c) => setCurrency(c)}
 * />
 * ```
 */
export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      currency = "USD",
      onCurrencyChange,
      currencyOptions = DEFAULT_CURRENCIES,
      placeholder = "Type something",
      className,
      currencySelector,
      disabled,
      id: idProp,
      ...inputProps
    },
    ref,
  ) => {
    const id = useId();
    const inputId = idProp ?? id;
    const selectId = `${id}-currency`;

    const currencySelectorContent =
      currencySelector != null ? (
        currencySelector
      ) : (
        <label
          htmlFor={selectId}
          className="relative flex h-full cursor-pointer items-center"
        >
          <select
            id={selectId}
            value={currency}
            onChange={(e) => onCurrencyChange?.(e.target.value)}
            disabled={disabled}
            className={cn(
              "h-full min-w-18 cursor-pointer appearance-none bg-transparent pl-3 pr-8 py-2 text-sm font-medium text-foreground outline-none border-0",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
            aria-label="Currency"
          >
            {currencyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          >
            <ChevronDownIcon className="size-4" />
          </span>
        </label>
      );

    return (
      <InputGroup className={className} data-disabled={disabled || undefined}>
        <InputGroupInput
          ref={ref}
          id={inputId}
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          disabled={disabled}
          aria-describedby={selectId}
          {...inputProps}
        />
        <InputGroupAddon align="inline-end">
          {currencySelectorContent}
        </InputGroupAddon>
      </InputGroup>
    );
  },
);

CurrencyInput.displayName = "CurrencyInput";

export default CurrencyInput;
