import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const sliderVariants = cva(
  "relative flex w-full touch-none select-none items-center",
  {
    variants: {
      size: {
        sm: "h-2",
        md: "h-3",
        lg: "h-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const sliderTrackVariants = cva(
  "relative w-full overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default: "bg-primary/20",
        success: "bg-success/20",
        warning: "bg-warning/20",
        destructive: "bg-destructive/20",
        info: "bg-info/20",
      },
      size: {
        sm: "h-2",
        md: "h-3",
        lg: "h-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const sliderRangeVariants = cva("absolute h-full", {
  variants: {
    variant: {
      default: "bg-primary",
      success: "bg-success",
      warning: "bg-warning",
      destructive: "bg-destructive",
      info: "bg-info",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const sliderThumbVariants = cva(
  "block rounded-full border-2 bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-md",
  {
    variants: {
      variant: {
        default: "border-primary",
        success: "border-success",
        warning: "border-warning",
        destructive: "border-destructive",
        info: "border-info",
      },
      size: {
        sm: "h-5 w-5",
        md: "h-6 w-6",
        lg: "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    VariantProps<typeof sliderThumbVariants> {
  classNames?: {
    track?: string;
    range?: string;
    thumb?: string;
  };
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, classNames, variant, size, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(sliderVariants({ size }), className)}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(sliderTrackVariants({ variant, size }), classNames?.track)}
    >
      <SliderPrimitive.Indicator
        className={cn(sliderRangeVariants({ variant }), classNames?.range)}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(sliderThumbVariants({ variant, size }), classNames?.thumb)}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = "Slider";

export { Slider, sliderVariants, sliderThumbVariants, sliderTrackVariants, sliderRangeVariants };
export default Slider;
