import { cn } from "@/lib/utils";
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { addAction, removeAction } from "@wordpress/hooks";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar";

/* ============================================
   Layout context (namespace + sidebar bridge)
   ============================================ */

export interface LayoutContextValue {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isMobile: boolean;
  /** Unique namespace for WordPress hooks (e.g. "dokan"). Used to register actions like `{namespace}_layout_toggle`. */
  namespace: string;
  toggleSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("Layout subcomponents must be used within Layout.");
  return ctx;
}

/** Returns layout context or null when used outside a Layout provider. */
export function useLayoutOptional() {
  return useContext(LayoutContext);
}

/* ============================================
   Layout Root — wraps SidebarProvider
   ============================================ */

export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  /** Initial open state for sidebar */
  defaultSidebarOpen?: boolean;
  /** Unique namespace for WordPress hooks integration. Used to register actions like `{namespace}_layout_toggle`. */
  namespace?: string;
}

export const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  (
    {
      className,
      defaultSidebarOpen = false,
      namespace = "plugin_ui",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <SidebarProvider defaultOpen={defaultSidebarOpen}>
        <LayoutInner
          ref={ref}
          className={className}
          namespace={namespace}
          {...props}
        >
          {children}
        </LayoutInner>
      </SidebarProvider>
    );
  },
);

Layout.displayName = "Layout";

/* ============================================
   LayoutInner — bridges SidebarContext and LayoutContext
   ============================================ */

interface LayoutInnerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  namespace: string;
}

const LayoutInner = forwardRef<HTMLDivElement, LayoutInnerProps>(
  (
    {
      className,
      namespace,
      children,
      ...props
    },
    ref,
  ) => {
    const sidebar = useSidebar();

    // Register WordPress hook so external code can toggle the sidebar
    // via `doAction('{namespace}_layout_toggle')`
    const { toggleSidebar } = sidebar;
    useEffect(() => {
      const hookName = `${namespace}_layout_toggle`;
      addAction(hookName, namespace, toggleSidebar);
      return () => {
        removeAction(hookName, namespace);
      };
    }, [namespace, toggleSidebar]);

    const value: LayoutContextValue = {
      sidebarOpen: sidebar.open,
      setSidebarOpen: sidebar.setOpen,
      isMobile: sidebar.isMobile,
      namespace,
      toggleSidebar: sidebar.toggleSidebar,
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
  },
);

LayoutInner.displayName = "LayoutInner";

/* ============================================
   Layout Header
   ============================================ */

export interface LayoutHeaderProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
  /** Show a trigger button that toggles the sidebar */
  showSidebarToggle?: boolean;
}

export const LayoutHeader = forwardRef<HTMLElement, LayoutHeaderProps>(
  ({ className, children, showSidebarToggle = true, ...props }, ref) => {
    return (
      <header
        ref={ref}
        data-slot="layout-header"
        className={cn(
          "items-center border-b border-border bg-background",
          className,
        )}
        {...props}
      >
        {showSidebarToggle && <SidebarTrigger />}
        {children}
      </header>
    );
  },
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
        className={cn("flex flex-1", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

LayoutBody.displayName = "LayoutBody";

/* ============================================
   Layout Main (content area) — wraps SidebarInset
   ============================================ */

export interface LayoutMainProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
}

export const LayoutMain = forwardRef<HTMLElement, LayoutMainProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <SidebarInset
        ref={ref}
        data-slot="layout-main"
        className={cn(
          "min-w-0 flex-1 overflow-auto focus:outline-none py-0",
          className,
        )}
        {...props}
      >
        {children}
      </SidebarInset>
    );
  },
);

LayoutMain.displayName = "LayoutMain";

/* ============================================
   Layout Sidebar — wraps Sidebar component
   ============================================ */

export interface LayoutSidebarProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
  /** Which side the sidebar appears on. Defaults to "left". */
  side?: "left" | "right";
  /** Sidebar collapsible mode. Defaults to "icon". */
  collapsible?: "offcanvas" | "icon" | "none";
  /** Sidebar visual variant. Defaults to "sidebar". */
  variant?: "sidebar" | "floating" | "inset";
}

export const LayoutSidebar = forwardRef<HTMLElement, LayoutSidebarProps>(
  ({ className, children, side = "left", collapsible = "icon", variant = "sidebar", ...props }, ref) => {
    return (
      <Sidebar
        ref={ref as React.Ref<HTMLDivElement>}
        data-slot="layout-sidebar"
        side={side}
        collapsible={collapsible}
        variant={variant}
        className={cn("bg-muted/30", className)}
        {...props}
      >
        {children}
      </Sidebar>
    );
  },
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
          className,
        )}
        {...props}
      >
        {children}
      </footer>
    );
  },
);

LayoutFooter.displayName = "LayoutFooter";
