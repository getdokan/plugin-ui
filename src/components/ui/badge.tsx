import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/classnames";

/**
 * Badge variant styles following ShadCN pattern
 */
const badgeVariants = {
  default:
    "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
  secondary:
    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive:
    "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
  outline: "text-foreground",
  success:
    "border-transparent bg-success text-success-foreground shadow hover:bg-success/80",
  warning:
    "border-transparent bg-warning text-warning-foreground shadow hover:bg-warning/80",
  info: "border-transparent bg-info text-info-foreground shadow hover:bg-info/80",
} as const;

export type BadgeVariant = keyof typeof badgeVariants;

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Badge style variant
   * @default 'default'
   */
  variant?: BadgeVariant;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Badge content
   */
  children?: ReactNode;
}

/**
 * Badge component following ShadCN pattern
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Badge>New</Badge>
 *
 * // Variants
 * <Badge variant="secondary">Secondary</Badge>
 * <Badge variant="destructive">Error</Badge>
 * <Badge variant="outline">Outline</Badge>
 * <Badge variant="success">Success</Badge>
 * <Badge variant="warning">Warning</Badge>
 * <Badge variant="info">Info</Badge>
 * ```
 */
export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  ),
);

Badge.displayName = "Badge";

export default Badge;
