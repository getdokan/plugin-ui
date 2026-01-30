import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/classnames";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
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
 * Textarea component following ShadCN pattern
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Textarea placeholder="Type your message here." />
 *
 * // With rows
 * <Textarea rows={6} placeholder="Write a detailed description..." />
 *
 * // Error state
 * <Textarea error placeholder="Invalid content" />
 *
 * // Disabled
 * <Textarea disabled placeholder="Cannot edit" />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-sm",
          "transition-colors duration-150",
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

Textarea.displayName = "Textarea";

export default Textarea;
