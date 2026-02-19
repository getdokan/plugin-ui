import * as React from "react";
import { ColorPicker as WpColorPicker } from "@wordpress/components";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

export interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  enableAlpha?: boolean;
}

export function ColorPicker({
  value = "#000000",
  onChange,
  disabled,
  className,
  "aria-label": ariaLabel,
  enableAlpha = true,
}: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "border-input dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 gap-4 rounded-md border bg-transparent h-9 px-2.5 text-sm shadow-xs transition-[color,box-shadow] focus-visible:ring-[3px] aria-invalid:ring-[3px] flex w-fit items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
          className
        )}
        disabled={disabled}
        aria-label={ariaLabel || "Choose color"}
      >
        <div
          className="w-5 h-5 rounded-full border border-border"
          style={{ backgroundColor: value }}
        />
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-none shadow-none">
        <WpColorPicker
          color={value}
          onChange={(newColor) => onChange?.(newColor)}
          enableAlpha={enableAlpha}
        />
      </PopoverContent>
    </Popover>
  );
}
