
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cn } from "@/lib/utils"

const {
  Root: ProgressRoot,
  Track: ProgressTrackPrimitive,
  Indicator: ProgressIndicatorPrimitive,
  Label: ProgressLabelPrimitive,
  Value: ProgressValuePrimitive,
} = ProgressPrimitive

export type ProgressVariant = "default" | "success" | "danger" | "warning" | "purple" | "green" | "brown"

function indicatorClass(variant?: ProgressVariant) {
  switch (variant) {
    case "success":
    case "green":
      return "bg-green-600"
    case "danger":
      return "bg-red-600"
    case "warning":
      return "bg-amber-600"
    case "purple":
      return "bg-purple-600"
    case "brown":
      return "bg-amber-800"
    default:
      return "bg-primary"
  }
}

function trackClass(variant?: ProgressVariant) {
  switch (variant) {
    case "success":
    case "green":
      return "bg-green-600/20 dark:bg-green-600/10"
    case "danger":
      return "bg-red-600/20 dark:bg-red-600/10"
    case "warning":
      return "bg-amber-600/20 dark:bg-amber-600/10"
    case "purple":
      return "bg-purple-600/20 dark:bg-purple-600/10"
    case "brown":
      return "bg-amber-800/20 dark:bg-amber-800/10"
    default:
      return "bg-stone-50"
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

function Progress({ value = 0, className, children, ...props }: ProgressProps) {
  return (
    <ProgressRoot value={value} className={cn("flex items-center gap-3", className)} {...props}>
      {children}
    </ProgressRoot>
  )
}

function ProgressTrack({ className, variant = "default", size = "md", rounded = true, ...props }: ProgressPrimitive.Track.Props & { variant?: ProgressVariant; size?: "sm" | "md" | "lg"; rounded?: boolean }) {
  return (
    <ProgressTrackPrimitive
      className={cn("relative overflow-hidden flex-1 min-w-0", trackClass(variant), sizeClass(size), rounded ? "rounded-full" : "rounded", className)}
      {...props}
    />
  )
}

function ProgressIndicator({ className, variant = "default", rounded = true, striped = false, ...props }: ProgressPrimitive.Indicator.Props & { variant?: ProgressVariant; rounded?: boolean; striped?: boolean }) {
  return (
    <ProgressIndicatorPrimitive
      className={cn("h-full transition-all duration-300", indicatorClass(variant), rounded ? "rounded-full" : "rounded", striped && "opacity-90 animate-pulse", className)}
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
    success: "stroke-green-600",
    green: "stroke-green-600",
    danger: "stroke-red-600",
    warning: "stroke-amber-600",
    purple: "stroke-purple-600",
    brown: "stroke-amber-800",
  }

  const bgStrokeClass: Record<ProgressVariant, string> = {
    default: "stroke-primary/25",
    success: "stroke-green-600/25",
    green: "stroke-green-600/25",
    danger: "stroke-red-600/25",
    warning: "stroke-amber-600/25",
    purple: "stroke-purple-600/25",
    brown: "stroke-amber-800/25",
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

