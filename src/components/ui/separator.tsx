import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../utils/classnames";

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Orientation of the separator
   * @default 'horizontal'
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Whether the separator is purely decorative
   * @default true
   */
  decorative?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Separator component following ShadCN pattern
 *
 * @example
 * ```tsx
 * // Horizontal (default)
 * <Separator />
 *
 * // Vertical
 * <Separator orientation="vertical" className="h-6" />
 *
 * // In a layout
 * <div>
 *   <p>Above</p>
 *   <Separator className="my-4" />
 *   <p>Below</p>
 * </div>
 * ```
 */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className,
      )}
      {...props}
    />
  ),
);

Separator.displayName = "Separator";

export default Separator;
