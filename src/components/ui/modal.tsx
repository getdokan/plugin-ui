import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { getThemeStyles, useThemeOptional } from "@/providers";

/* ============================================
   Modal Overlay
   ============================================ */

interface ModalOverlayProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  "data-state"?: "open" | "closed";
}

const ModalOverlay = forwardRef<HTMLDivElement, ModalOverlayProps>(
  ({ className, onClose, "data-state": dataState, ...props }, ref) => (
    <div
      ref={ref}
      data-state={dataState}
      aria-hidden="true"
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
  "data-state"?: "open" | "closed";
}

const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, children, "data-state": dataState, ...props }, ref) => (
    <div
      ref={ref}
      data-state={dataState}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
        "w-full max-w-lg max-h-[85vh] overflow-auto",
        "rounded-lg border border-border bg-background p-0 shadow-lg",
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
      data-slot="modal-header"
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left border-b p-5",
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

const ModalContext = createContext<{
  labelId: string | undefined;
  descriptionId: string | undefined;
} | null>(null);

const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ className, id: idProp, ...props }, ref) => {
    const context = useContext(ModalContext);
    const id = idProp ?? context?.labelId;
    return (
      <h2
        ref={ref}
        id={id}
        className={cn(
          "text-lg font-bold text-foreground",
          className,
        )}
        {...props}
      />
    );
  },
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
>(({ className, id: idProp, ...props }, ref) => {
  const context = useContext(ModalContext);
  const id = idProp ?? context?.descriptionId;
  return (
    <p
      ref={ref}
      id={id}
      className={cn("px-5 py-8", className)}
      {...props}
    />
  );
});

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
      data-slot="modal-footer"
      className={cn(
        "flex sm:flex-row sm:justify-end sm:space-x-2 border-t p-5",
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
  ({ className, onClose, "aria-label": ariaLabel, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel ?? "Close"}
      className={cn(
        "absolute right-4 top-4 cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity",
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
   * Modal content
   */
  children?: ReactNode;

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

  /**
   * ARIA role for the modal content
   * @default 'dialog'
   */
  role?: "dialog" | "alertdialog";
}

const sizeClasses = {
  sm: "max-w-sm",
  default: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
};

let bodyScrollLockCount = 0;

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal component that portals content to document.body.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <Button onClick={() => setOpen(true)}>Open Modal</Button>
 *
 * <Modal open={open} onClose={() => setOpen(false)}>
 *   <ModalHeader>
 *     <ModalTitle>Edit Profile</ModalTitle>
 *     <ModalDescription>Make changes to your profile here.</ModalDescription>
 *   </ModalHeader>
 *   <div className="p-8">
 *     <Input placeholder="Name" />
 *     <Input placeholder="Email" />
 *   </div>
 *   <ModalFooter>
 *     <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
 *     <Button onClick={handleSave}>Save</Button>
 *   </ModalFooter>
 * </Modal>
 * ```
 */
export function Modal({
  open,
  onClose,
  children,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  size = "default",
  role = "dialog",
}: ModalProps) {
  const theme = useThemeOptional();
  const labelId = useId();
  const descriptionId = useId();
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const previousActiveElement = useRef<Element | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open) {
      setPortalContainer(null);
      return;
    }

    previousActiveElement.current = document.activeElement;

    const container = document.createElement("div");
    container.setAttribute("data-pui-modal-root", "true");
    container.className = "pui-root";

    document.body.appendChild(container);
    setPortalContainer(container);

    bodyScrollLockCount += 1;
    if (bodyScrollLockCount === 1) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      bodyScrollLockCount -= 1;
      if (bodyScrollLockCount === 0) {
        document.body.style.overflow = "";
      }
      document.body.removeChild(container);

      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [open]);

  useEffect(() => {
    if (!portalContainer || !theme) return;

    const styles = getThemeStyles(theme.tokens);
    Object.entries(styles).forEach(([key, value]) => {
      portalContainer.style.setProperty(key, value);
    });
    portalContainer.setAttribute("data-pui-mode", theme.resolvedMode);
    if (theme.resolvedMode === "dark") {
      portalContainer.classList.add("dark");
    } else {
      portalContainer.classList.remove("dark");
    }
  }, [portalContainer, theme]);

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

  useLayoutEffect(() => {
    if (!portalContainer || !open) return;

    const container = contentRef.current;
    if (!container) return;

    const focusables = container.querySelectorAll<HTMLElement>(
      FOCUSABLE_SELECTOR,
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    (first ?? container).focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [portalContainer, open]);

  if (!open || !portalContainer) {
    return null;
  }

  const contextValue = { labelId, descriptionId };

  return createPortal(
    <ModalContext.Provider value={contextValue}>
      <ModalOverlay
        data-state="open"
        onClose={closeOnOverlayClick ? onClose : undefined}
      />
      <ModalContent
        ref={contentRef}
        role={role}
        aria-modal="true"
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        data-state="open"
        className={cn(sizeClasses[size], className)}
      >
        {showCloseButton && <ModalClose onClose={onClose} />}
        {children}
      </ModalContent>
    </ModalContext.Provider>,
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
