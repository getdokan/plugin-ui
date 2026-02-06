// Core UI Components following ShadCN pattern
// All components are pure React - no WordPress dependencies

export { Alert, AlertDescription, AlertTitle, type AlertProps, type AlertVariant } from "./alert";
export { Badge, badgeVariants} from "./badge";
export { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from "./button";
export {
    Card, CardContent, CardDescription, CardFooter, CardHeader,
    CardTitle,
  CardAction,
} from "./card";
export {
  CurrencyInput,
  type CurrencyInputProps,
  type CurrencyOption,
} from "./currency-input";
export { Input, type InputProps } from "./input";
export { InputGroup, type InputGroupProps } from "./input-group";
export { Label, type LabelProps } from "./label";
export {
    Modal, ModalClose, ModalContent, ModalDescription,
    ModalFooter, ModalHeader, ModalOverlay, ModalTitle, type ModalProps
} from "./modal";
export {
  ComponentPreview,
  DesignSystemSection,
  type ComponentPreviewProps,
  type DesignSystemSectionProps,
} from "./design-system-section";
export { Separator, type SeparatorProps } from "./separator";
export { Switch, type SwitchProps } from "./switch";
export { Textarea, type TextareaProps } from "./textarea";
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
export { Toggle } from './toggle'
export { ToggleGroup, ToggleGroupItem } from './toggle-group'
export { MatricsCard, type MatricsCardProps } from './matrics-card'
export { MatricsGroup, MatricsGroupItem, MatricsGroupProps, MatricsGroupItemProps } from './matrics-group';
export { MatricsPill, MatricsPillProps } from './matrics-pill';
export { FileUpload, FileUploadProps } from './file-upload';
export { FileView, FileViewProps } from './file-view';



