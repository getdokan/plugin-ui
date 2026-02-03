import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Content to show on the left of the input (e.g. icon, prefix, select).
   */
  leftAddon?: ReactNode;

  /**
   * Content to show on the right of the input (e.g. icon, suffix, select).
   */
  rightAddon?: ReactNode;

  /**
   * Error state for the whole group.
   */
  error?: boolean;

  /**
   * Additional CSS classes for the root wrapper.
   */
  className?: string;

  /**
   * Additional CSS classes for the inner input element.
   */
  inputClassName?: string;
}

/**
 * Generic input with optional left and right addons in a single bordered box.
 * Addons are rendered with muted background and a border between them and the input.
 *
 * @example
 * ```tsx
 * // Left addon (prefix)
 * <InputGroup
 *   leftAddon={<span className="px-3 text-muted-foreground">$</span>}
 *   placeholder="0.00"
 * />
 *
 * // Right addon (suffix / currency)
 * <InputGroup
 *   rightAddon={(
 *     <select className="...">
 *       <option>USD</option>
 *     </select>
 *   )}
 *   placeholder="Amount"
 * />
 *
 * // Both
 * <InputGroup
 *   leftAddon={<SearchIcon />}
 *   rightAddon={<Button size="icon">...</Button>}
 *   placeholder="Search"
 * />
 * ```
 */
export const InputGroup = forwardRef<HTMLInputElement, InputGroupProps>(
  (
    {
      leftAddon,
      rightAddon,
      error = false,
      className,
      inputClassName,
      disabled,
      ...inputProps
    },
    ref,
  ) => {
    const hasLeft = leftAddon != null;
    const hasRight = rightAddon != null;

    return (
      <div
        className={cn(
          "flex h-9 w-full overflow-hidden rounded-md border bg-transparent text-base shadow-sm transition-colors md:text-sm",
          "focus-within:ring-1 focus-within:ring-ring",
          error
            ? "border-destructive focus-within:ring-destructive"
            : "border-input",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        data-pui-input-group
      >
        {hasLeft && (
          <div
            className={cn(
              "flex shrink-0 items-center border-r border-input bg-muted text-muted-foreground",
              "[&_select]:h-full [&_select]:min-w-0 [&_select]:border-0 [&_select]:bg-transparent [&_select]:outline-none",
            )}
          >
            {leftAddon}
          </div>
        )}
        <Input
          ref={ref}
          inGroup
          disabled={disabled}
          className={inputClassName}
          {...inputProps}
        />
        {hasRight && (
          <div
            className={cn(
              "flex shrink-0 items-center border-l border-input bg-muted text-muted-foreground",
              "[&_select]:h-full [&_select]:min-w-0 [&_select]:border-0 [&_select]:bg-transparent [&_select]:outline-none",
            )}
          >
            {rightAddon}
          </div>
        )}
      </div>
    );
  },
);

InputGroup.displayName = "InputGroup";

export default InputGroup;
