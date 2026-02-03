import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"

import { cn } from "@/lib/utils"

type AvatarSize = "xs" | "sm" | "md" | "lg" | number
type AvatarShape = "circle" | "square"

interface AvatarProps extends Omit<AvatarPrimitive.Root.Props, "style"> {
  size?: AvatarSize
  shape?: AvatarShape
  style?: React.CSSProperties
}

const AvatarContext = React.createContext<{ size: AvatarSize; shape: AvatarShape } | undefined>(undefined)

function useAvatarContext() {
  const context = React.useContext(AvatarContext)
  if (!context) {
    throw new Error("Avatar components must be used within an Avatar")
  }
  return context
}

function getSizeClass(size: AvatarSize): string | undefined {
  if (typeof size === "number") return undefined
  const sizeMap: Record<Exclude<AvatarSize, number>, string> = {
    xs: "size-6",
    sm: "size-7",
    md: "size-8",
    lg: "size-12",
  }
  return sizeMap[size]
}

function Avatar({
  className,
  size = "md",
  shape = "circle",
  style,
  ...props
}: AvatarProps) {
  const sizeClass = getSizeClass(size)
  const customStyle =
    typeof size === "number"
      ? { ...style, width: size, height: size }
      : style

  return (
    <AvatarContext.Provider value={{ size, shape }}>
      <AvatarPrimitive.Root
        data-slot="avatar"
        data-shape={shape}
        data-size={typeof size === "number" ? "custom" : size}
        className={cn(
          "after:border-border group/avatar relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:mix-blend-darken dark:after:mix-blend-lighten",
          // Circle shape (default)
          shape === "circle" && "rounded-full after:rounded-full",
          // Square shape with 5px border-radius
          shape === "square" && "rounded-[5px] after:rounded-[5px]",
          sizeClass,
          className
        )}
        style={customStyle}
        {...props}
      />
    </AvatarContext.Provider>
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  const { shape } = useAvatarContext()

  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full object-cover",
        // Circle shape
        shape === "circle" && "rounded-full",
        // Square shape with 5px border-radius
        shape === "square" && "rounded-[5px]",
        className
      )}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  style,
  ...props
}: AvatarPrimitive.Fallback.Props & { style?: React.CSSProperties }) {
  const { size, shape } = useAvatarContext()
  const isNumeric = typeof size === "number"
  const fontSize = isNumeric ? `${size * 0.375}px` : undefined

  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted text-muted-foreground flex size-full items-center justify-center",
        // Circle shape
        shape === "circle" && "rounded-full",
        // Square shape with 5px border-radius
        shape === "square" && "rounded-[5px]",
        // Text sizes for preset sizes
        "group-data-[size=xs]/avatar:text-xs",
        "group-data-[size=sm]/avatar:text-xs",
        "group-data-[size=md]/avatar:text-sm",
        "group-data-[size=lg]/avatar:text-base",
        className
      )}
      style={{ ...style, fontSize }}
      {...props}
    />
  )
}

function AvatarBadge({
  className,
  style,
  ...props
}: React.ComponentProps<"span"> & { style?: React.CSSProperties }) {
  const { size, shape } = useAvatarContext()
  const isNumeric = typeof size === "number"
  const badgeSize = isNumeric ? size * 0.25 : undefined
  const customStyle = isNumeric ? { ...style, width: badgeSize, height: badgeSize } : style

  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center bg-blend-color ring-2 select-none",
        // Circle shape (badge is always circular)
        shape === "circle" && "rounded-full",
        // Square shape (badge matches avatar with smaller radius)
        shape === "square" && "rounded-[3px]",
        // Preset sizes
        "group-data-[size=xs]/avatar:size-1.5 group-data-[size=xs]/avatar:[&>svg]:size-1",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:size-1",
        "group-data-[size=md]/avatar:size-2.5 group-data-[size=md]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-4 group-data-[size=lg]/avatar:[&>svg]:size-3",
        className
      )}
      style={customStyle}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "*:data-[slot=avatar]:ring-background group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  size,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  size?: AvatarSize
  style?: React.CSSProperties
}) {
  const isNumeric = typeof size === "number"
  const customSize = isNumeric ? size : undefined
  const customStyle = isNumeric ? { ...style, width: customSize, height: customSize } : style

  return (
    <div
      data-slot="avatar-group-count"
      data-size={isNumeric ? "custom" : size}
      className={cn(
        "bg-muted text-muted-foreground rounded-full ring-background relative flex shrink-0 items-center justify-center ring-2",
        // Default size
        !size && "size-8 text-sm [&>svg]:size-4",
        // Preset sizes
        size === "xs" && "size-6 text-xs [&>svg]:size-3",
        size === "sm" && "size-7 text-xs [&>svg]:size-3",
        size === "md" && "size-8 text-sm [&>svg]:size-4",
        size === "lg" && "size-12 text-base [&>svg]:size-5",
        // Fallback for group-based detection when no size prop
        !size && "group-has-data-[size=xs]/avatar-group:size-6 group-has-data-[size=xs]/avatar-group:text-xs group-has-data-[size=xs]/avatar-group:[&>svg]:size-3",
        !size && "group-has-data-[size=sm]/avatar-group:size-7 group-has-data-[size=sm]/avatar-group:text-xs group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        !size && "group-has-data-[size=md]/avatar-group:size-8 group-has-data-[size=md]/avatar-group:text-sm group-has-data-[size=md]/avatar-group:[&>svg]:size-4",
        !size && "group-has-data-[size=lg]/avatar-group:size-12 group-has-data-[size=lg]/avatar-group:text-base group-has-data-[size=lg]/avatar-group:[&>svg]:size-5",
        className
      )}
      style={customStyle}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}
