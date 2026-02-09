import type { ComponentProps, CSSProperties } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const noticeVariants = cva(
  "relative grid gap-2.5 rounded-[3px] border-l-[3px] border-y-0 border-r-0 px-4 py-3 text-left text-sm has-data-[slot=notice-action]:pr-10 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4 w-full group/notice",
  {
    variants: {
      variant: {
        default: "[&]:border-muted-foreground/50 *:data-[slot=notice-title]:text-foreground bg-muted",
        destructive: "[&]:border-destructive *:data-[slot=notice-title]:text-destructive bg-destructive/10",
        success: "[&]:border-success *:data-[slot=notice-title]:text-success bg-success/10",
        warning: "[&]:border-warning *:data-[slot=notice-title]:text-warning-foreground bg-warning/10",
        info: "[&]:border-info *:data-[slot=notice-title]:text-info-foreground bg-info/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface NoticeProps extends ComponentProps<"div">, VariantProps<typeof noticeVariants> {
  /** Custom background color */
  bgColor?: string
  /** Custom border color */
  borderColor?: string
  /** Custom title text color */
  titleColor?: string
}

function Notice({
  className,
  variant,
  bgColor,
  borderColor,
  titleColor,
  style,
  ...props
}: NoticeProps) {
  const noticeClassName = noticeVariants({ variant })

  const customStyle: CSSProperties = {
    ...(bgColor && { backgroundColor: bgColor }),
    ...(borderColor && { borderColor }),
    ...(titleColor && { '--notice-title-color': titleColor } as CSSProperties),
    ...style,
  }

  return (
    <div
      data-slot="notice"
      role="status"
      className={cn(noticeClassName, className)}
      style={Object.keys(customStyle).length > 0 ? customStyle : undefined}
      {...props}
    >
    </div>
  )
}

function NoticeTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="notice-title"
      className={cn(
        "text-sm font-medium group-has-[>svg]/notice:col-start-2 [&_a]:hover:text-foreground [&_a]:underline [&_a]:underline-offset-3",
        className
      )}
      style={{ color: 'var(--notice-title-color)' }}
      {...props}
    />
  )
}

function NoticeAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="notice-action"
      className={cn("absolute top-2.5 right-3", className)}
      {...props}
    />
  )
}

export { Notice, NoticeTitle, NoticeAction }
