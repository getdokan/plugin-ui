import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  Modal,
  ModalDescription,
  ModalFooter,
  ModalTitle,
} from "./modal";

const DEFAULT_CONFIRM_LABEL = "Confirm";
const DEFAULT_CANCEL_LABEL = "Cancel";

export type ConfirmationVariant = "default" | "destructive";

const iconContainerVariants: Record<ConfirmationVariant, string> = {
  default: "bg-primary/10 text-primary",
  destructive: "bg-destructive/10 text-destructive",
};

export interface ConfirmationProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  body?: ReactNode;
  icon?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: ConfirmationVariant;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export function Confirmation({
  open,
  onClose,
  title,
  body,
  icon,
  confirmLabel = DEFAULT_CONFIRM_LABEL,
  cancelLabel = DEFAULT_CANCEL_LABEL,
  onConfirm,
  onCancel,
  variant = "default",
  showCloseButton = true,
  closeOnOverlayClick = true,
}: ConfirmationProps) {
  const handleConfirm = () => {
    onClose();
    onConfirm?.();
  };

  const handleCancel = () => {
    onClose();
    onCancel?.();
  };

  const iconContent = icon ?? <TriangleAlert className="size-5" />;

  return (
    <Modal
      open={open}
      onClose={onClose}
      role="alertdialog"
      showCloseButton={showCloseButton}
      closeOnOverlayClick={closeOnOverlayClick}
      className="border-0"
    >
      <div className="flex flex-row items-center gap-3 p-5 pt-7 text-left">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            iconContainerVariants[variant],
          )}
          aria-hidden
        >
          {iconContent}
        </div>
        <ModalTitle className="text-lg font-medium text-foreground">
          {title}
        </ModalTitle>
      </div>
      {body != null ? (
        <ModalDescription className="p-5 pt-0 text-muted-foreground">
          {body}
        </ModalDescription>
      ) : (
        <ModalDescription className="sr-only"> </ModalDescription>
      )}
      <ModalFooter className="flex flex-row justify-end gap-2">
        <Button variant="outline" onClick={handleCancel}>
          {cancelLabel}
        </Button>
        <Button variant={variant} onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
