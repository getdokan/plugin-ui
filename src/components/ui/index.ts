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
export { Separator, type SeparatorProps } from "./separator";
export { Spinner } from "./spinner";
export { Switch, LabeledSwitch, SwitchCard, type SwitchProps, type LabeledSwitchProps, type SwitchCardProps } from "./switch";
export { Textarea } from "./textarea";
export { Thumbnail, type ThumbnailAspect, type ThumbnailProps, type ThumbnailSize } from "./thumbnail";
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
export { Toggle } from './toggle'
export { ToggleGroup, ToggleGroupItem } from './toggle-group'
export { Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue, CircularProgress, type ProgressProps, type CircularProgressProps } from "./progress";
export { Slider, type SliderProps } from "./slider";
export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants } from './tabs'
export { SelectionType, SelectionItem, selectionItemVariants } from './selection-type'
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
  SelectValue,
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
  useComboboxAnchor,
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
  DropdownMenuTrigger,
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
  AlertDialogTrigger,
} from "./alert-dialog";

export { Checkbox, LabeledCheckbox, CheckboxCard, type CheckboxProps, type LabeledCheckboxProps, type CheckboxCardProps } from "./checkbox";
export { RadioGroup, RadioGroupItem, LabeledRadio, RadioCard, type RadioGroupItemProps, type LabeledRadioProps, type RadioCardProps } from "./radio-group";
export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
} from "./field";

