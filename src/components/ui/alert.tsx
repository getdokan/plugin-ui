import type { ComponentProps, CSSProperties } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "grid gap-2.5 rounded-lg border p-5 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4 w-full relative group/alert",
  {
    variants: {
      variant: {
        default: "[&]:bg-muted [&]:border-border *:data-[slot=alert-title]:text-foreground *:data-[slot=alert-description]:text-muted-foreground",
        destructive: "[&]:bg-destructive/10 [&]:border-transparent *:data-[slot=alert-title]:text-destructive *:data-[slot=alert-description]:text-destructive/80",
        success: "[&]:bg-success/10 [&]:border-transparent *:data-[slot=alert-title]:text-success *:data-[slot=alert-description]:text-success/80",
        warning: "[&]:bg-warning/10 [&]:border-transparent *:data-[slot=alert-title]:text-warning-foreground *:data-[slot=alert-description]:text-warning-foreground/80",
        info: "[&]:bg-info [&]:border-transparent *:data-[slot=alert-title]:text-info-foreground *:data-[slot=alert-description]:text-info-foreground/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AlertProps extends ComponentProps<"div">, VariantProps<typeof alertVariants> {
  /** Custom background color */
  bgColor?: string
  /** Custom border color */
  borderColor?: string
  /** Custom title text color */
  titleColor?: string
  /** Custom description text color */
  descriptionColor?: string
}

function Alert({
  className,
  variant,
  bgColor,
  borderColor,
  titleColor,
  descriptionColor,
  style,
  ...props
}: AlertProps) {
  const alertClassName = alertVariants({ variant })

  // Build custom styles for per-instance color overrides
  const customStyle: CSSProperties = {
    ...(bgColor && { backgroundColor: bgColor }),
    ...(borderColor && { borderColor: borderColor }),
    ...(titleColor && { '--alert-title-color': titleColor } as CSSProperties),
    ...(descriptionColor && { '--alert-desc-color': descriptionColor } as CSSProperties),
    ...style,
  }

  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertClassName, className)}
      style={customStyle}
      {...props}
    >
    </div>
  )
}

function AlertTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "text-sm font-semibold group-has-[>svg]/alert:col-start-2 [&_a]:hover:text-foreground [&_a]:underline [&_a]:underline-offset-3",
        className
      )}
      style={{ color: 'var(--alert-title-color)' }}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm text-balance md:text-pretty [&_p:not(:last-child)]:mb-4 [&_a]:hover:text-foreground [&_a]:underline [&_a]:underline-offset-3",
        className
      )}
      style={{ color: 'var(--alert-desc-color)' }}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2.5 right-3", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
