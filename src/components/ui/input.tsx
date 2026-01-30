import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../utils/classnames";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Error state
   */
  error?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Input component following ShadCN pattern
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Input placeholder="Enter your email" />
 *
 * // With type
 * <Input type="email" placeholder="Email" />
 * <Input type="password" placeholder="Password" />
 *
 * // Error state
 * <Input error placeholder="Invalid input" />
 *
 * // Disabled
 * <Input disabled placeholder="Disabled" />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm",
          "transition-colors duration-150",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "md:text-sm",
          error
            ? "border-destructive focus-visible:ring-destructive"
            : "border-input",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
