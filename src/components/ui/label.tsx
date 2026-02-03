import { forwardRef, type LabelHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * Whether the associated field is required
   */
  required?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Label content
   */
  children?: ReactNode;
}

/**
 * Label component following ShadCN pattern
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Label htmlFor="email">Email</Label>
 *
 * // Required field
 * <Label htmlFor="name" required>Name</Label>
 * ```
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-destructive" aria-hidden="true">
          *
        </span>
      )}
    </label>
  ),
);

Label.displayName = "Label";

export default Label;
