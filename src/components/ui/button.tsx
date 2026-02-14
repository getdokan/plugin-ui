import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cursor-pointer focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-md border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-[3px] aria-invalid:ring-[3px] [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        outline:
          "border-primary bg-transparent text-primary hover:bg-muted dark:hover:bg-muted/50 aria-expanded:bg-muted",
        ghost:
          "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        "outline-destructive":
          "border-destructive bg-transparent text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20",
        success:
          "bg-success text-success-foreground hover:bg-success/90 focus-visible:ring-success/20 dark:focus-visible:ring-success/40",
        "outline-success":
          "border-success bg-transparent text-success hover:bg-success/10 dark:hover:bg-success/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-md px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-md px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        lg: "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-9",
        "icon-xs":
          "size-6 rounded-md in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-md in-data-[slot=button-group]:rounded-md",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  progress?: number;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      progress,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const hasProgress =
      typeof progress === "number" && progress >= 0 && progress <= 100;

    return (
      <ButtonPrimitive
        ref={ref}
        data-slot="button"
        className={cn(
          buttonVariants({ variant, size }),
          hasProgress && "relative overflow-hidden",
          className,
        )}
        disabled={disabled}
        {...props}
      >
        {/* Progress bar background */}
        {hasProgress && (
          <span
            className="absolute inset-0 bg-primary/20 dark:bg-primary/40 transition-all"
            style={{
              width: `${progress}%`,
            }}
          />
        )}

        {/* Content */}
        {children}
      </ButtonPrimitive>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
