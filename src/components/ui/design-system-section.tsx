import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* ============================================
   DesignSystemSection
   ============================================ */

export interface DesignSystemSectionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Section title (e.g. "Buttons", "Inputs").
   */
  title?: ReactNode;

  /**
   * Optional description below the title.
   */
  description?: ReactNode;

  /**
   * Section content (component previews, swatches, etc.).
   */
  children?: ReactNode;

  className?: string;
}

/**
 * Section container for design system documentation.
 * Maps to a Figma frame: title + optional description + content area.
 *
 * @example
 * ```tsx
 * <DesignSystemSection title="Buttons" description="Primary actions">
 *   <ComponentPreview label="Default">
 *     <Button>Submit</Button>
 *   </ComponentPreview>
 * </DesignSystemSection>
 * ```
 */
export const DesignSystemSection = forwardRef<
  HTMLDivElement,
  DesignSystemSectionProps
>(
  (
    { title, description, children, className, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-4", className)}
      data-pui-section
      {...props}
    >
      {(title != null || description != null) && (
        <div className="flex flex-col gap-1">
          {title != null && (
            <h2 className="text-lg font-semibold leading-tight tracking-tight text-foreground">
              {title}
            </h2>
          )}
          {description != null && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      {children != null && (
        <div className="flex flex-wrap items-center gap-6">
          {children}
        </div>
      )}
    </div>
  ),
);

DesignSystemSection.displayName = "DesignSystemSection";

/* ============================================
   ComponentPreview
   ============================================ */

export interface ComponentPreviewProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Label for this preview (e.g. "Primary", "Default").
   */
  label?: ReactNode;

  /**
   * Preview content (the component instance).
   */
  children?: ReactNode;

  className?: string;
}

/**
 * Single row in a design system section: optional label + content.
 *
 * @example
 * ```tsx
 * <ComponentPreview label="Primary">
 *   <Button>Click me</Button>
 * </ComponentPreview>
 * ```
 */
export const ComponentPreview = forwardRef<
  HTMLDivElement,
  ComponentPreviewProps
>(
  (
    { label, children, className, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-2 min-w-0",
        className,
      )}
      data-pui-preview
      {...props}
    >
      {label != null && (
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        {children}
      </div>
    </div>
  ),
);

ComponentPreview.displayName = "ComponentPreview";

export default DesignSystemSection;
