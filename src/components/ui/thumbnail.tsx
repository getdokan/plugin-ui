import * as React from "react"

import { cn } from "@/lib/utils"

type ThumbnailSize = "xs" | "sm" | "md" | "lg" | number
type ThumbnailAspect = "landscape" | "portrait" | "square"

interface ThumbnailProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  size?: ThumbnailSize
  aspect?: ThumbnailAspect
  fallback?: React.ReactNode
  alt?: string
}

const defaultFallback = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function getSizeClass(size: ThumbnailSize): string | undefined {
  if (typeof size === "number") return undefined
  const sizeMap: Record<Exclude<ThumbnailSize, number>, string> = {
    xs: "h-6",
    sm: "h-7",
    md: "h-8",
    lg: "h-12",
  }
  return sizeMap[size]
}

function getAspectRatioClass(aspect: ThumbnailAspect): string {
  const aspectMap: Record<ThumbnailAspect, string> = {
    landscape: "aspect-video",
    portrait: "aspect-[3/4]",
    square: "aspect-square",
  }
  return aspectMap[aspect]
}

function calculateDimensions(size: ThumbnailSize, aspect: ThumbnailAspect) {
  if (typeof size !== "number") return undefined

  const aspectRatios: Record<ThumbnailAspect, number> = {
    landscape: 16 / 9,
    portrait: 3 / 4,
    square: 1,
  }

  const ratio = aspectRatios[aspect]
  const height = size
  const width = Math.round(size * ratio)

  return { width, height }
}

function Thumbnail({
  src,
  size = "md",
  aspect = "square",
  fallback,
  alt = "",
  className,
  style,
  ...props
}: ThumbnailProps) {
  const [imageError, setImageError] = React.useState(false)
  const sizeClass = getSizeClass(size)
  const aspectClass = getAspectRatioClass(aspect)
  const dimensions = calculateDimensions(size, aspect)

  const customStyle = dimensions
    ? { ...style, width: dimensions.width, height: dimensions.height }
    : style

  const showFallback = !src || imageError

  return (
    <div
      data-slot="thumbnail"
      data-size={typeof size === "number" ? "custom" : size}
      data-aspect={aspect}
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-[5px] bg-muted",
        "text-muted-foreground",
        "items-center justify-center",
        aspectClass,
        sizeClass,
        className
      )}
      style={customStyle}
      {...props}
    >
      {showFallback ? (
        <div className="flex items-center justify-center w-full h-full p-2">
          {fallback || defaultFallback}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  )
}

export { Thumbnail }
export type { ThumbnailProps, ThumbnailSize, ThumbnailAspect }
