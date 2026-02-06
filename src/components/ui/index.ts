// Core UI Components following ShadCN pattern
// All components are pure React - no WordPress dependencies

export { Alert, AlertAction, AlertDescription, AlertTitle } from "./alert";
export {
  Avatar, AvatarBadge, AvatarFallback,
  AvatarGroup,
  AvatarGroupCount, AvatarImage
} from "./avatar";
export { Badge, type BadgeProps, type BadgeVariant } from "./badge";
export {
  Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem,
  BreadcrumbLink, BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from "./breadcrumb";
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
export { Input } from "./input";
export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea
} from "./input-group";
export {
  InputOTP,
  InputOTPGroup, InputOTPSeparator, InputOTPSlot
} from "./input-otp";
export { Label, type LabelProps } from "./label";
export {
  Modal, ModalClose, ModalContent, ModalDescription,
  ModalFooter, ModalHeader, ModalOverlay, ModalTitle, type ModalProps
} from "./modal";
export { Notice, NoticeAction, NoticeTitle } from "./notice";
export { CircularProgress, Progress, ProgressIndicator, ProgressLabel, ProgressTrack, ProgressValue, type CircularProgressProps, type ProgressProps } from "./progress";
export { SelectionItem, selectionItemVariants, SelectionType } from './selection-type';
export { Separator, type SeparatorProps } from "./separator";
export { Slider, type SliderProps } from "./slider";
export { Spinner } from "./spinner";
export { Switch, type SwitchProps } from "./switch";
export { Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger } from './tabs';
export { Textarea } from "./textarea";
export { Thumbnail, type ThumbnailAspect, type ThumbnailProps, type ThumbnailSize } from "./thumbnail";
export { Toggle } from './toggle';
export { ToggleGroup, ToggleGroupItem } from './toggle-group';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

// Dropdown menu high-level components and types
export {
  ActionMenuDropdown,
  CheckboxListDropdown,
  IconListDropdown, MultiSelectDropdown, SectionedMenuDropdown,
  SimpleMenuDropdown
} from './dropdown-menu';
export type {
  CheckboxListDropdownProps,
  IconDropdownItem,
  IconListDropdownProps,
  MenuDropdownItem,
  MultiSelectDropdownProps,
  SectionedMenuDropdownProps,
  SimpleDropdownItem,
  SimpleMenuDropdownProps
} from './dropdown-menu';

