// Core UI Components following ShadCN pattern
// All components are pure React - no WordPress dependencies

export { Alert, AlertDescription, AlertTitle, type AlertProps, type AlertVariant } from "./alert";
export { Badge, type BadgeProps, type BadgeVariant } from "./badge";
export { Button, buttonVariants } from "./button";
export {
    Card, CardContent, CardDescription, CardFooter, CardHeader,
    CardTitle, type CardContentProps, type CardDescriptionProps, type CardFooterProps, type CardHeaderProps, type CardProps, type CardTitleProps
} from "./card";
export {
    CurrencyInput,
    type CurrencyInputProps,
    type CurrencyOption
} from "./currency-input";
export {
    ComponentPreview,
    DesignSystemSection,
    type ComponentPreviewProps,
    type DesignSystemSectionProps
} from "./design-system-section";
export { Input, type InputProps } from "./input";
export { InputGroup, type InputGroupProps } from "./input-group";
export { Label, type LabelProps } from "./label";
export {
    Modal, ModalClose, ModalContent, ModalDescription,
    ModalFooter, ModalHeader, ModalOverlay, ModalTitle, type ModalProps
} from "./modal";
export { Separator, type SeparatorProps } from "./separator";
export { Spinner } from "./spinner";
export { Switch, type SwitchProps } from "./switch";
export { Textarea, type TextareaProps } from "./textarea";
export { Toggle } from './toggle';
export { ToggleGroup, ToggleGroupItem } from './toggle-group';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

// Dropdown menu high-level components and types
export {
    ActionMenuDropdown,
    CheckboxListDropdown,
    IconListDropdown
} from './dropdown-menu';
export type {
    CheckboxListDropdownProps,
    IconDropdownItem,
    SimpleDropdownItem
} from './dropdown-menu';

