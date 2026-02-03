import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Button variant styles following ShadCN pattern
 *
 * Sizes based on design spec:
 * - L (large):  h-10 (40px), px-6 (24px), py-2.5
 * - M (medium): h-9 (36px), px-5 (20px), py-2
 * - S (small):  h-7 (28px), px-4 (16px), py-1.5, text-xs
 */
const buttonVariants = {
  variant: {
    // Primary - filled with primary color
    default:
      "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",

    // Secondary - subtle background
    secondary:
      "border-1 border-secondary bg-transparent text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",

    // Outlined - border only, transparent bg
    outline:
      "border-1 border-primary bg-transparent text-primary hover:bg-primary/10 active:bg-primary/20",
    outlined:
      "border-1 border-primary bg-transparent text-primary hover:bg-primary/10 active:bg-primary/20",

    // Ghost - no border, no bg
    ghost:
      "text-primary hover:bg-accent hover:text-accent-foreground active:bg-accent/80",

    // Link style
    link: "text-primary underline-offset-4 hover:underline",

    // Semantic variants
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
    success:
      "bg-success text-success-foreground hover:bg-success/90 active:bg-success/80",
    warning:
      "bg-warning text-warning-foreground hover:bg-warning/90 active:bg-warning/80",
    info: "bg-info text-info-foreground hover:bg-info/90 active:bg-info/80",

    // Outlined semantic variants
    "outline-destructive":
      "border border-[var(--destructive)] text-destructive bg-transparent hover:bg-destructive/10 active:bg-destructive/20",
    "outline-success":
      "border border-[var(--success)] text-success bg-transparent hover:bg-success/10 active:bg-success/20",
  },
  size: {
    // S - Small (28px height)
    sm: "h-7 rounded-md px-4 py-1.5 text-xs gap-1.5",
    s: "h-7 rounded-md px-4 py-1.5 text-xs gap-1.5",

    // M - Medium (36px height) - default
    md: "h-9 rounded-md px-5 py-2 text-sm gap-2",
    m: "h-9 rounded-md px-5 py-2 text-sm gap-2",
    default: "h-9 rounded-md px-5 py-2 text-sm gap-2",

    // L - Large (40px height)
    lg: "h-10 rounded-md px-6 py-2.5 text-sm gap-2",
    l: "h-10 rounded-md px-6 py-2.5 text-sm gap-2",

    // XL - Extra Large
    xl: "h-12 rounded-md px-8 py-3 text-base gap-2.5",

    // Icon only buttons (square)
    "icon-sm": "h-7 w-7 rounded-md p-0",
    "icon-md": "h-9 w-9 rounded-md p-0",
    "icon-lg": "h-10 w-10 rounded-md p-0",
    icon: "h-9 w-9 rounded-md p-0",
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
   * Button size: 's' | 'sm' | 'm' | 'md' | 'l' | 'lg' | 'xl' | 'icon' | 'icon-sm' | 'icon-md' | 'icon-lg'
   * @default 'default'
   */
  size?: ButtonSize;

  /**
   * Whether button is in loading state
   */
  loading?: boolean;

  /**
   * Loading text to display (optional)
   */
  loadingText?: string;

  /**
   * Progress value (0-100) for progress button
   */
  progress?: number;

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

  /**
   * Icon-only mode (no padding for text)
   */
  iconOnly?: boolean;
}

/**
 * Loading spinner component
 */
function LoadingSpinner({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <svg
      className={cn("animate-spin", sizeClasses[size], className)}
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
 * <Button variant="primary">Primary</Button>
 * <Button variant="secondary">Secondary</Button>
 * <Button variant="outline">Outlined</Button>
 * <Button variant="ghost">Ghost</Button>
 *
 * // Sizes (L, M, S)
 * <Button size="l">Large</Button>
 * <Button size="m">Medium</Button>
 * <Button size="s">Small</Button>
 *
 * // With icons
 * <Button leftIcon={<PlusIcon />}>Create Store</Button>
 * <Button rightIcon={<ArrowRightIcon />}>Next</Button>
 * <Button leftIcon={<MenuIcon />} rightIcon={<ChevronDownIcon />}>Button</Button>
 *
 * // Icon only
 * <Button size="icon-md" iconOnly><MenuIcon /></Button>
 *
 * // Loading state
 * <Button loading loadingText="Saving">Save</Button>
 *
 * // Progress button
 * <Button progress={45}>Loading</Button>
 *
 * // Semantic variants
 * <Button variant="success">Apply Now</Button>
 * <Button variant="destructive">Delete</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      loading = false,
      loadingText,
      progress,
      leftIcon,
      rightIcon,
      disabled,
      fullWidth,
      iconOnly,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const hasProgress = typeof progress === "number";

    // Determine spinner size based on button size
    const spinnerSize =
      size === "s" || size === "sm" || size === "icon-sm"
        ? "sm"
        : size === "l" || size === "lg" || size === "xl" || size === "icon-lg"
        ? "lg"
        : "md";

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          // Base styles
          "relative inline-flex items-center justify-center whitespace-nowrap rounded-md",
          "font-medium tracking-normal",
          "transition-all duration-150 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0",
          // Variant styles (disabled when hasProgress to use gradient)
          !hasProgress && buttonVariants.variant[variant],
          // Size styles
          buttonVariants.size[size],
          // Full width
          fullWidth && "w-full",
          // Progress bar needs relative positioning and overflow hidden
          hasProgress && "overflow-hidden",
          // Custom classes
          className,
        )}
        style={
          hasProgress
            ? {
                background: `linear-gradient(to right, var(--primary) 50%, color-mix(in oklch, var(--primary) 40%, transparent) 50%)`,
                color: "var(--primary-foreground)",
              }
            : undefined
        }
        {...props}
      >
        {/* Content */}
        {loading ? (
          <>
            <LoadingSpinner size={spinnerSize} />
            {loadingText || children}
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
