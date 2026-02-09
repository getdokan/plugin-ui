import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Button } from "./button";

/* ============================================
   Layout context (sidebar open state, breakpoint)
   ============================================ */

export type LayoutSidebarVariant = "drawer" | "inline" | "overlay";

/** Sidebar position: "left" | "right" | null (no sidebar) */
export type LayoutSidebarPosition = "left" | "right" | null;

export interface LayoutContextValue {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarVariant: LayoutSidebarVariant;
  sidebarBreakpoint: string;
  sidebarPosition: LayoutSidebarPosition;
  isMobile: boolean;
}

const LayoutContext = createContext<LayoutContextValue | null>(null);

function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("Layout subcomponents must be used within Layout.");
  return ctx;
}

/* ============================================
   Layout Root
   ============================================ */

export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  /** Sidebar position: "left", "right", or null for no sidebar */
  sidebarPosition?: LayoutSidebarPosition;
  /** Sidebar behavior: drawer (slides in), inline (always visible on desktop), overlay (over content) */
  sidebarVariant?: LayoutSidebarVariant;
  /** Tailwind breakpoint at which sidebar is always visible, e.g. "lg", "md" */
  sidebarBreakpoint?: string;
  /** Initial open state for mobile sidebar */
  defaultSidebarOpen?: boolean;
}

export const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  (
    {
      className,
      sidebarPosition = "right",
      sidebarVariant = "drawer",
      sidebarBreakpoint = "lg",
      defaultSidebarOpen = false,
      children,
      ...props
    },
    ref
  ) => {
    const [sidebarOpen, setSidebarOpen] = useState(defaultSidebarOpen);
    const value: LayoutContextValue = {
      sidebarOpen,
      setSidebarOpen,
      sidebarVariant,
      sidebarBreakpoint,
      sidebarPosition: sidebarPosition ?? null,
      isMobile: true, // will be set by CSS/JS or consumer can override via provider
    };
    return (
      <LayoutContext.Provider value={value}>
        <div
          ref={ref}
          data-slot="layout"
          className={cn("flex min-h-screen w-full flex-col", className)}
          {...props}
        >
          {children}
        </div>
      </LayoutContext.Provider>
    );
  }
);

Layout.displayName = "Layout";

/* ============================================
   Layout Header
   ============================================ */

export interface LayoutHeaderProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
  /** Show a menu button that toggles the sidebar on small screens */
  showSidebarToggle?: boolean;
}

export const LayoutHeader = forwardRef<HTMLElement, LayoutHeaderProps>(
  ({ className, children, showSidebarToggle = true, ...props }, ref) => {
    const { setSidebarOpen, sidebarPosition } = useLayout();
    const hasSidebar =
      sidebarPosition === "left" || sidebarPosition === "right";
    return (
      <header
        ref={ref}
        data-slot="layout-header"
        className={cn(
          "sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4",
          className
        )}
        {...props}
      >
        {hasSidebar && showSidebarToggle && (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle sidebar"
          >
            <Menu className="size-5" />
          </Button>
        )}
        {children}
      </header>
    );
  }
);

LayoutHeader.displayName = "LayoutHeader";

/* ============================================
   Layout Body (header + main + sidebar + footer wrapper)
   ============================================ */

export interface LayoutBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export const LayoutBody = forwardRef<HTMLDivElement, LayoutBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="layout-body"
        className={cn("flex flex-1 flex-col lg:flex-row", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

LayoutBody.displayName = "LayoutBody";

/* ============================================
   Layout Main (content area)
   ============================================ */

export interface LayoutMainProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
}

export const LayoutMain = forwardRef<HTMLElement, LayoutMainProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <main
        ref={ref}
        data-slot="layout-main"
        className={cn(
          "min-w-0 flex-1 overflow-auto p-4 focus:outline-none",
          className
        )}
        {...props}
      >
        {children}
      </main>
    );
  }
);

LayoutMain.displayName = "LayoutMain";

/* ============================================
   Layout Sidebar (left or right; nullable when Layout has sidebarPosition={null})
   ============================================ */

export interface LayoutSidebarProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
  /** Width when open, e.g. "w-72", "16rem" */
  width?: string;
}

export const LayoutSidebar = forwardRef<HTMLElement, LayoutSidebarProps>(
  ({ className, children, width = "w-72", ...props }, ref) => {
    const {
      sidebarOpen,
      setSidebarOpen,
      sidebarBreakpoint,
      sidebarPosition,
    } = useLayout();

    if (sidebarPosition !== "left" && sidebarPosition !== "right") {
      return null;
    }

    const isLeft = sidebarPosition === "left";
    const bp = sidebarBreakpoint;
    const breakpointClass =
      bp === "lg" ? "lg:flex" : bp === "md" ? "md:flex" : "xl:flex";
    const collapseWhenClosed =
      bp === "lg"
        ? "lg:w-0 lg:min-w-0 lg:overflow-hidden"
        : bp === "md"
        ? "md:w-0 md:min-w-0 md:overflow-hidden"
        : "xl:w-0 xl:min-w-0 xl:overflow-hidden";
    const desktopTransition =
      bp === "lg"
        ? "lg:transition-[width] lg:duration-200"
        : bp === "md"
        ? "md:transition-[width] md:duration-200"
        : "xl:transition-[width] xl:duration-200";

    return (
      <>
        {/* Backdrop on mobile: fades in/out, closes sidebar on click when visible */}
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/50 lg:hidden",
            "transition-opacity duration-300 ease-out",
            sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          aria-hidden
          onClick={() => setSidebarOpen(false)}
        />
        <aside
          ref={ref}
          data-slot="layout-sidebar"
          data-side={sidebarPosition}
          data-open={sidebarOpen || undefined}
          className={cn(
            "flex shrink-0 flex-col bg-muted/30",
            // Mobile: solid background so content behind is not visible
            "max-lg:bg-background max-lg:shadow-xl",
            isLeft ? "border-r border-border" : "border-l border-border",
            // Mobile: fixed width when drawer is open
            "max-lg:w-72",
            // Desktop: width when open, collapse to 0 when closed (expandable/collapsible)
            sidebarOpen ? width : collapseWhenClosed,
            desktopTransition,
            // Mobile: fixed, hidden when closed, smooth slide animation
            "max-lg:fixed max-lg:inset-y-0 max-lg:z-50 max-lg:flex max-lg:flex-col",
            isLeft ? "max-lg:left-0" : "max-lg:right-0",
            !sidebarOpen &&
              (isLeft ? "max-lg:-translate-x-full" : "max-lg:translate-x-full"),
            "max-lg:transition-transform max-lg:duration-300 max-lg:ease-out",
            breakpointClass,
            className
          )}
          {...props}
        >
          <div className="flex h-14 items-center border-b border-border px-2 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X className="size-5" />
            </Button>
          </div>
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {children}
          </div>
        </aside>
      </>
    );
  }
);

LayoutSidebar.displayName = "LayoutSidebar";

/* ============================================
   Layout Footer (nullable)
   ============================================ */

export interface LayoutFooterProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
}

export const LayoutFooter = forwardRef<HTMLElement, LayoutFooterProps>(
  ({ className, children, ...props }, ref) => {
    if (children == null || children === undefined) return null;
    return (
      <footer
        ref={ref}
        data-slot="layout-footer"
        className={cn(
          "shrink-0 border-t border-border bg-muted/30 px-4 py-3",
          className
        )}
        {...props}
      >
        {children}
      </footer>
    );
  }
);

LayoutFooter.displayName = "LayoutFooter";
