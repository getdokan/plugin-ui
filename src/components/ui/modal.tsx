import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useThemeOptional } from "../../providers/theme-provider";
import { cn } from "@/lib/utils";

/* ============================================
   Modal Overlay
   ============================================ */

interface ModalOverlayProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

const ModalOverlay = forwardRef<HTMLDivElement, ModalOverlayProps>(
  ({ className, onClose, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      onClick={onClose}
      {...props}
    />
  ),
);

ModalOverlay.displayName = "ModalOverlay";

/* ============================================
   Modal Content
   ============================================ */

interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
        "w-full max-w-lg max-h-[85vh] overflow-auto",
        "rounded-lg border border-border bg-background p-6 shadow-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className,
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  ),
);

ModalContent.displayName = "ModalContent";

/* ============================================
   Modal Header
   ============================================ */

interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className,
      )}
      {...props}
    />
  ),
);

ModalHeader.displayName = "ModalHeader";

/* ============================================
   Modal Title
   ============================================ */

interface ModalTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  ),
);

ModalTitle.displayName = "ModalTitle";

/* ============================================
   Modal Description
   ============================================ */

interface ModalDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

const ModalDescription = forwardRef<
  HTMLParagraphElement,
  ModalDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

ModalDescription.displayName = "ModalDescription";

/* ============================================
   Modal Footer
   ============================================ */

interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4",
        className,
      )}
      {...props}
    />
  ),
);

ModalFooter.displayName = "ModalFooter";

/* ============================================
   Modal Close Button
   ============================================ */

interface ModalCloseProps extends HTMLAttributes<HTMLButtonElement> {
  onClose?: () => void;
}

const ModalClose = forwardRef<HTMLButtonElement, ModalCloseProps>(
  ({ className, onClose, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity",
        "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:pointer-events-none",
        className,
      )}
      onClick={onClose}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
      <span className="sr-only">Close</span>
    </button>
  ),
);

ModalClose.displayName = "ModalClose";

/* ============================================
   Main Modal Component
   ============================================ */

export interface ModalProps {
  /**
   * Whether the modal is open
   */
  open: boolean;

  /**
   * Callback when modal should close
   */
  onClose: () => void;

  /**
   * Modal title
   */
  title?: ReactNode;

  /**
   * Modal description
   */
  description?: ReactNode;

  /**
   * Modal content
   */
  children?: ReactNode;

  /**
   * Footer content (typically buttons)
   */
  footer?: ReactNode;

  /**
   * Whether to show close button
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Whether clicking overlay closes the modal
   * @default true
   */
  closeOnOverlayClick?: boolean;

  /**
   * Whether pressing Escape closes the modal
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Additional class for the modal content
   */
  className?: string;

  /**
   * Size preset
   * @default 'default'
   */
  size?: "sm" | "default" | "lg" | "xl" | "full";
}

const sizeClasses = {
  sm: "max-w-sm",
  default: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
};

/**
 * Modal component with proper theme scoping
 *
 * The modal portals into a container that inherits the theme context,
 * ensuring CSS variables work correctly even though it renders outside
 * the normal React tree.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <Button onClick={() => setOpen(true)}>Open Modal</Button>
 *
 * <Modal
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   title="Edit Profile"
 *   description="Make changes to your profile here."
 *   footer={
 *     <>
 *       <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
 *       <Button onClick={handleSave}>Save</Button>
 *     </>
 *   }
 * >
 *   <Input placeholder="Name" />
 *   <Input placeholder="Email" />
 * </Modal>
 * ```
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  size = "default",
}: ModalProps) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const themeContext = useThemeOptional();
  const previousActiveElement = useRef<Element | null>(null);

  // Create/find portal container that inherits theme
  useEffect(() => {
    if (!open) {
      setPortalContainer(null);
      return;
    }

    // Store currently focused element
    previousActiveElement.current = document.activeElement;

    // Create portal container
    const container = document.createElement("div");
    container.setAttribute("data-pui-modal-root", "true");

    // Copy theme attributes from ThemeProvider
    if (themeContext) {
      container.setAttribute("data-pui-plugin", themeContext.pluginId);
      container.setAttribute("data-pui-mode", themeContext.resolvedMode);
      container.className = `pui-root ${
        themeContext.resolvedMode === "dark" ? "dark" : ""
      }`;

      // Copy CSS variables
      const cssVars: Record<string, string> = {};
      Object.entries(themeContext.tokens).forEach(([key, value]) => {
        if (value) {
          const cssKey = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
          cssVars[cssKey] = value;
        }
      });
      Object.assign(container.style, cssVars);
    } else {
      container.className = "pui-root";
    }

    document.body.appendChild(container);
    setPortalContainer(container);

    // Prevent body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.removeChild(container);

      // Restore focus
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [open, themeContext]);

  // Handle escape key
  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, closeOnEscape, onClose]);

  if (!open || !portalContainer) {
    return null;
  }

  return createPortal(
    <>
      <ModalOverlay onClose={closeOnOverlayClick ? onClose : undefined} />
      <ModalContent className={cn(sizeClasses[size], className)}>
        {showCloseButton && <ModalClose onClose={onClose} />}

        {(title || description) && (
          <ModalHeader>
            {title && <ModalTitle>{title}</ModalTitle>}
            {description && <ModalDescription>{description}</ModalDescription>}
          </ModalHeader>
        )}

        {children && <div className="py-4">{children}</div>}

        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </>,
    portalContainer,
  );
}

// Export sub-components for custom composition
export {
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
};

export default Modal;
