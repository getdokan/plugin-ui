import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/classnames";

/**
 * Alert variant styles following ShadCN pattern
 */
const alertVariants = {
  default: "bg-background text-foreground border-border",
  destructive:
    "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
  success:
    "border-success/50 bg-success/10 text-success dark:border-success [&>svg]:text-success",
  warning:
    "border-warning/50 bg-warning/10 text-warning dark:border-warning [&>svg]:text-warning",
  info: "border-info/50 bg-info/10 text-info dark:border-info [&>svg]:text-info",
} as const;

export type AlertVariant = keyof typeof alertVariants;

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Alert style variant
   * @default 'default'
   */
  variant?: AlertVariant;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Alert content
   */
  children?: ReactNode;
}

/**
 * Alert component following ShadCN pattern
 *
 * @example
 * ```tsx
 * <Alert>
 *   <AlertTitle>Heads up!</AlertTitle>
 *   <AlertDescription>
 *     You can add components to your app using the cli.
 *   </AlertDescription>
 * </Alert>
 *
 * <Alert variant="destructive">
 *   <AlertTitle>Error</AlertTitle>
 *   <AlertDescription>Something went wrong.</AlertDescription>
 * </Alert>
 * ```
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative w-full rounded-lg border px-4 py-3 text-sm",
        "[&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
        alertVariants[variant],
        className,
      )}
      {...props}
    />
  ),
);

Alert.displayName = "Alert";

/* ============================================
   Alert Title
   ============================================ */

export interface AlertTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
  className?: string;
}

export const AlertTitle = forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  ),
);

AlertTitle.displayName = "AlertTitle";

/* ============================================
   Alert Description
   ============================================ */

export interface AlertDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
  className?: string;
}

export const AlertDescription = forwardRef<
  HTMLParagraphElement,
  AlertDescriptionProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));

AlertDescription.displayName = "AlertDescription";

export default Alert;
