"use client"

import * as React from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

/**
 * Represents an individual item in the ButtonToggleGroup.
 */
export interface ButtonToggleGroupItem {
  /** Unique value for the toggle item */
  value: string
  /** Text label to display */
  label: string
  /** Optional icon to display before the label */
  startIcon?: React.ReactNode
  /** Optional icon to display after the label */
  endIcon?: React.ReactNode
}

/**
 * Props for the ButtonToggleGroup component.
 */
export interface ButtonToggleGroupProps {
  /** Array of items to be displayed as toggle options */
  items: ButtonToggleGroupItem[]
  /** The value of the currently active toggle item (for controlled component) */
  value?: string
  /** Callback fired when the active toggle item changes */
  onValueChange?: (value: string) => void
  /**
   * The size of the toggle items
   * @default "default"
   */
  size?: "default" | "sm" | "lg"
  /** Extra CSS classes for the container */
  className?: string
  /** Extra CSS classes for individual toggle items */
  itemClassName?: string
}

/**
 * A specialized ToggleGroup component that supports icons and custom active state styling.
 * Useful for segmented controls where each option might need an accompanying icon.
 */
export function ButtonToggleGroup({
  items,
  value,
  onValueChange,
  size = "default",
  className,
  itemClassName,
}: ButtonToggleGroupProps) {
  return (
    <ToggleGroup
      value={value ? [value] : []}
      onValueChange={(val) => {
        const nextValue = val[0]
        if (nextValue !== undefined) {
          onValueChange?.(nextValue)
        }
      }}
      variant="default"
      size={size}
      className={cn("gap-0! rounded-lg! shadow-none!", className)}
      orientation="horizontal"
    >
      {items.map((item) => (
        <ToggleGroupItem
          key={item.value}
          value={item.value}
          className={cn(
            "bg-background flex items-center gap-2 px-4! transition-colors",
            "aria-pressed:bg-primary! aria-pressed:text-primary-foreground!",
            "border! border-border! aria-pressed:border-primary!",
            "group-data-[spacing=0]/toggle-group:first:rounded-l-[5px]!",
            "group-data-[spacing=0]/toggle-group:last:rounded-r-[5px]!",
            itemClassName
          )}
        >
          {item.startIcon && (
            <span className="flex items-center justify-center shrink-0">
              {item.startIcon}
            </span>
          )}
          <span>{item.label}</span>
          {item.endIcon && (
            <span className="flex items-center justify-center shrink-0">
              {item.endIcon}
            </span>
          )}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
