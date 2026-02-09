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
export {
  ComponentPreview,
  DesignSystemSection,
  type ComponentPreviewProps,
  type DesignSystemSectionProps
} from "./design-system-section";
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
export { LabeledSwitch, Switch, SwitchCard, type LabeledSwitchProps, type SwitchCardProps, type SwitchProps } from "./switch";
export { Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger } from './tabs';
export { Textarea } from "./textarea";
export { Thumbnail, type ThumbnailAspect, type ThumbnailProps, type ThumbnailSize } from "./thumbnail";
export { Toggle } from './toggle';
export { ToggleGroup, ToggleGroupItem } from './toggle-group';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
// Select component
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from "./select";

// Combobox component
export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor
} from "./combobox";

// DropdownMenu component
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "./dropdown-menu";

// AlertDialog component
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger
} from "./alert-dialog";

export { Checkbox, CheckboxCard, LabeledCheckbox, type CheckboxCardProps, type CheckboxProps, type LabeledCheckboxProps } from "./checkbox";
export {
  Field, FieldContent, FieldDescription,
  FieldError,
  FieldGroup, FieldLabel, FieldLegend,
  FieldSeparator,
  FieldSet, FieldTitle
} from "./field";
export { LabeledRadio, RadioCard, RadioGroup, RadioGroupItem, type LabeledRadioProps, type RadioCardProps, type RadioGroupItemProps } from "./radio-group";

export { DataViews, type DataViewAction, type DataViewField, type DataViewFilterField, type DataViewFilterProps, type DataViewLayouts, type DataViewsProps, type DataViewState } from '../wordpress/dataviews';
