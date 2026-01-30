import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/classnames";

/**
 * Button variant styles following ShadCN pattern
 */
const buttonVariants = {
  variant: {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
    success: "bg-success text-success-foreground hover:bg-success/90 shadow-sm",
    warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-sm",
    info: "bg-info text-info-foreground hover:bg-info/90 shadow-sm",
  },
  size: {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    xl: "h-12 rounded-md px-10 text-base",
    icon: "h-9 w-9",
  },
} as const;

export type ButtonVariant = keyof typeof buttonVariants.variant;
export type ButtonSize = keyof typeof buttonVariants.size;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button style variant
   * @default 'default'
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * @default 'default'
   */
  size?: ButtonSize;

  /**
   * Whether button is in loading state
   */
  loading?: boolean;

  /**
   * Icon to display before children
   */
  leftIcon?: ReactNode;

  /**
   * Icon to display after children
   */
  rightIcon?: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Button content
   */
  children?: ReactNode;

  /**
   * Make button full width
   */
  fullWidth?: boolean;
}

/**
 * Loading spinner component
 */
function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin h-4 w-4", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * Button component following ShadCN pattern with plugin theme support
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button>Click me</Button>
 *
 * // Variants
 * <Button variant="destructive">Delete</Button>
 * <Button variant="outline">Cancel</Button>
 * <Button variant="secondary">Secondary</Button>
 * <Button variant="ghost">Ghost</Button>
 * <Button variant="link">Link</Button>
 *
 * // Sizes
 * <Button size="sm">Small</Button>
 * <Button size="lg">Large</Button>
 * <Button size="icon"><IconComponent /></Button>
 *
 * // With icons
 * <Button leftIcon={<PlusIcon />}>Add Item</Button>
 * <Button rightIcon={<ArrowRightIcon />}>Next</Button>
 *
 * // Loading state
 * <Button loading>Saving...</Button>
 *
 * // Full width
 * <Button fullWidth>Submit</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      fullWidth,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          // Variant styles
          buttonVariants.variant[variant],
          // Size styles
          buttonVariants.size[size],
          // Full width
          fullWidth && "w-full",
          // Custom classes
          className,
        )}
        {...props}
      >
        {loading ? (
          <LoadingSpinner className="mr-2" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {rightIcon && !loading && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
