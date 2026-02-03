import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Error state
   */
  error?: boolean;

  /**
   * When true, omits border, radius and focus ring so the input fits inside
   * InputGroup (the group provides the border and focus-within ring).
   */
  inGroup?: boolean;

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
  ({ className, type = "text", error, inGroup = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-9 w-full bg-transparent px-3 py-1 text-base transition-colors duration-150",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "md:text-sm",
          inGroup
            ? "min-w-0 border-0 outline-none"
            : cn(
                "rounded-md border shadow-sm",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                error
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-input",
              ),
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
