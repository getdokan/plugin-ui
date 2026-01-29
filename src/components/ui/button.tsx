import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-plugin-ui-primary text-plugin-ui-primary-foreground hover:bg-plugin-ui-primary-hover",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-plugin-ui-gray-100 text-plugin-ui-gray-700 hover:bg-plugin-ui-gray-200 border border-plugin-ui-gray-200",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-plugin-ui-primary underline-offset-4 hover:underline",
        primary: "bg-plugin-ui-primary text-plugin-ui-primary-foreground hover:bg-plugin-ui-primary-hover",
        tertiary: "bg-white border border-plugin-ui-gray-300 text-plugin-ui-gray-700 hover:bg-plugin-ui-gray-50",
        info: "bg-plugin-ui-info text-white hover:bg-plugin-ui-info/90",
        success: "bg-plugin-ui-success text-white hover:bg-plugin-ui-success/90",
        warning: "bg-plugin-ui-warning text-white hover:bg-plugin-ui-warning/90",
        danger: "bg-plugin-ui-error text-white hover:bg-plugin-ui-error/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 rounded px-2 text-xs",
        sm: "h-9 rounded-md px-3",
        md: "h-10 px-4 py-2",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"]

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
