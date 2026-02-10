
import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cn } from "@/lib/utils"

const {
  Root: ProgressRoot,
  Track: ProgressTrackPrimitive,
  Indicator: ProgressIndicatorPrimitive,
  Label: ProgressLabelPrimitive,
  Value: ProgressValuePrimitive,
} = ProgressPrimitive

export type ProgressVariant = "default" | "success" | "destructive" | "warning" | "info"

function indicatorClass(variant?: ProgressVariant) {
  switch (variant) {
    case "success":
      return "bg-success"
    case "destructive":
      return "bg-destructive"
    case "warning":
      return "bg-warning"
    case "info":
      return "bg-info"
    default:
      return "bg-primary"
  }
}

function trackClass(variant?: ProgressVariant) {
  switch (variant) {
    case "success":
      return "bg-success/20 dark:bg-success/10"
    case "destructive":
      return "bg-destructive/20 dark:bg-destructive/10"
    case "warning":
      return "bg-warning/20 dark:bg-warning/10"
    case "info":
      return "bg-info/20 dark:bg-info/10"
    default:
      return "bg-primary/20 dark:bg-primary/10"
  }
}



function sizeClass(size?: "sm" | "md" | "lg") {
  switch (size) {
    case "sm":
      return "h-2"
    case "lg":
      return "h-4"
    default:
      return "h-3"
  }
}

export type ProgressProps = ProgressPrimitive.Root.Props & {
  variant?: ProgressVariant
  size?: "sm" | "md" | "lg"
  rounded?: boolean
  striped?: boolean
}

const ProgressContext = React.createContext<{
  variant?: ProgressVariant
  size?: "sm" | "md" | "lg"
  rounded?: boolean
  striped?: boolean
}>({})

function Progress({ value, className, children, variant, size, rounded, striped, ...props }: ProgressProps) {
  return (
    <ProgressContext.Provider value={{ variant, size, rounded, striped }}>
      <ProgressRoot value={value} className={cn("flex items-center gap-3", className)} {...props}>
        {children}
      </ProgressRoot>
    </ProgressContext.Provider>
  )
}

function ProgressTrack({ className, variant, size, rounded, ...props }: ProgressPrimitive.Track.Props & { variant?: ProgressVariant; size?: "sm" | "md" | "lg"; rounded?: boolean }) {
  const context = React.useContext(ProgressContext)
  const v = variant ?? context.variant ?? "default"
  const s = size ?? context.size ?? "md"
  const r = rounded ?? context.rounded ?? true

  return (
    <ProgressTrackPrimitive
      className={cn("relative overflow-hidden flex-1 min-w-0", trackClass(v), sizeClass(s), r ? "rounded-full" : "rounded", className)}
      {...props}
    />
  )
}

function ProgressIndicator({ className, variant, rounded, striped, ...props }: ProgressPrimitive.Indicator.Props & { variant?: ProgressVariant; rounded?: boolean; striped?: boolean }) {
  const context = React.useContext(ProgressContext)
  const v = variant ?? context.variant ?? "default"
  const r = rounded ?? context.rounded ?? true
  const s = striped ?? context.striped ?? false

  return (
    <ProgressIndicatorPrimitive
      className={cn("h-full transition-all duration-300", indicatorClass(v), r ? "rounded-full" : "rounded", s && "pui-progress-striped pui-animate-progress-striped", className)}
      {...props}
    />
  )
}

function ProgressLabel(props: ProgressPrimitive.Label.Props) {
  return <ProgressLabelPrimitive className={cn("text-sm font-medium", props.className)} {...props} />
}

function ProgressValue(props: ProgressPrimitive.Value.Props) {
  return <ProgressValuePrimitive className={cn("text-muted-foreground text-sm tabular-nums ml-auto", props.className)} {...props} />
}

// Circular Progress Component (SVG)
export interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  shape?: "square" | "round"
  variant?: ProgressVariant
  showLabel?: boolean
  renderLabel?: (progress: number) => number | string
  className?: string
}

function CircularProgress({ value, max = 100, size = 100, strokeWidth = 10, shape = "round", variant = "default", showLabel = true, renderLabel, className }: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percentage = Math.max(0, Math.min(100, (value / max) * 100))
  const offset = circumference - (percentage / 100) * circumference

  const progressStrokeClass: Record<ProgressVariant, string> = {
    default: "stroke-primary",
    success: "stroke-success",
    destructive: "stroke-destructive",
    warning: "stroke-warning",
    info: "stroke-info",
  }

  const bgStrokeClass: Record<ProgressVariant, string> = {
    default: "stroke-primary/25",
    success: "stroke-success/25",
    destructive: "stroke-destructive/25",
    warning: "stroke-warning/25",
    info: "stroke-info/25",
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg height={size} viewBox={`0 0 ${size} ${size}`} width={size} xmlns="http://www.w3.org/2000/svg">
        <g style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}>
          <circle className={bgStrokeClass[variant] || bgStrokeClass.default} cx={size / 2} cy={size / 2} fill="transparent" r={radius} strokeWidth={strokeWidth} />
          <circle className={progressStrokeClass[variant] || progressStrokeClass.default} cx={size / 2} cy={size / 2} fill="transparent" r={radius} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap={shape} style={{ transition: "stroke-dashoffset 0.35s ease" }} />
        </g>
      </svg>
      {showLabel && <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold pointer-events-none">{renderLabel ? renderLabel(value) : `${Math.round(percentage)}%`}</div>}
    </div>
  )
}

export { Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue, CircularProgress }

export default Progress

