import React from "react";
import { cn } from "@/lib/utils";
import { Slider as SliderParts } from "@base-ui/react/slider";

const { Root: SliderRoot, Track: SliderTrack, Indicator: SliderIndicator, Thumb: SliderThumb } = SliderParts;

export interface SliderProps extends React.ComponentProps<typeof SliderRoot> {
  variant?: "default" | "green" | "purple" | "brown" | "danger";
  size?: "sm" | "md" | "lg";
}

function variantClass(variant?: SliderProps["variant"]) {
  switch (variant) {
    case "green":
      return "bg-green-600";
    case "purple":
      return "bg-purple-600";
    case "brown":
      return "bg-amber-800";
    case "danger":
      return "bg-red-600";
    default:
      return "bg-primary";
  }
}

// function trackClass(variant?: SliderProps["variant"]) {
//   switch (variant) {
//     case "green":
//       return "bg-green-600/20 dark:bg-green-600/10"
//     case "danger":
//       return "bg-red-600/20 dark:bg-red-600/10"
//     case "purple":
//       return "bg-purple-600/20 dark:bg-purple-600/10"
//     case "brown":
//       return "bg-amber-800/20 dark:bg-amber-800/10"
//     default:
//       return "bg-primary/20"
  
//     }
// }

function variantBorderClass(variant?: SliderProps["variant"]) {
  switch (variant) {
    case "green":
      return "border-green-600";
    case "purple":
      return "border-purple-600";
    case "brown":
      return "border-amber-800";
    case "danger":
      return "border-red-600";
    default:
      return "border-primary";
  }
}

export function Slider({ variant = "default", size = "md", className, ...props }: SliderProps) {
  const height = size === "sm" ? "h-2" : size === "lg" ? "h-4" : "h-3";
  const thumbClasses = size === "sm" ? "w-5 h-5" : size === "lg" ? "w-7 h-7" : "w-6 h-6";

  return (
    <SliderRoot className={cn("w-full relative", className)} {...props}>
      <SliderTrack className={cn("bg-primary/20 rounded-full overflow-hidden", height)}>
        <SliderIndicator className={cn("h-full", variantClass(variant))} />
      </SliderTrack>
      <SliderThumb 
        className={cn(
          "rounded-full bg-white border-2 shadow-md outline-none focus-visible:ring-2 focus-visible:ring-offset-2 z-10",
          thumbClasses, variantBorderClass(variant)
        )}
        
      />
    </SliderRoot>
  );
}

export default Slider;
