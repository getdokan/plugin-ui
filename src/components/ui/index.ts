// Core UI Components following ShadCN pattern
// All components are pure React - no WordPress dependencies

export { Alert, AlertDescription, AlertTitle, AlertAction } from "./alert";
export { default as AdminNotice } from "../wordpress/AdminNotice";
export { Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge } from "./avatar";
export { Thumbnail, type ThumbnailProps, type ThumbnailSize, type ThumbnailAspect } from "./thumbnail";
export { Notice, NoticeTitle, NoticeAction } from "./notice";
export { Button, buttonVariants } from "./button";
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "./breadcrumb";
export { Badge, badgeVariants} from "./badge";
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
export { Input } from "./input";
export { CopyInput, type CopyInputProps } from "./copy-input";
export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
} from "./input-group";
export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "./input-otp";
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
export { Spinner } from "./spinner";
export {
  Sortable,
  SortableItem,
  SortableDragHandle,
  SortableProvider,
  DragOverlay,
  type SortableProps,
  type SortableItemProps,
  type SortableDragHandleProps,
  type SortableProviderProps,
} from "./sortable";
export { Switch, LabeledSwitch, SwitchCard, type SwitchProps, type LabeledSwitchProps, type SwitchCardProps } from "./switch";
export { Textarea } from "./textarea";
export { RichTextEditor, type RichTextEditorProps } from "./rich-text-editor";
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
export { CombineInput, type CombineInputProps } from "./combine-input";
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

// Popover component
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverPortal,
  PopoverHeader,
  PopoverDescription,
  PopoverTitle,
  PopoverClose,
  PopoverArrow,
} from "./popover";

// ColorPicker component
export { ColorPicker, type ColorPickerProps } from "./color-picker";

// Dialog component
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

// Sheet component
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./sheet";

// Sidebar component
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
  useSidebarOptional,
} from "./sidebar";

// Chart component
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  type ChartConfig,
} from "./chart";

// Skeleton component
export { Skeleton } from "./skeleton";

// ScrollArea component
export { ScrollArea, ScrollBar } from "./scroll-area";

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
export { RadioGroup, RadioGroupItem, LabeledRadio, RadioCard, RadioImageCard, RadioIconCard, type RadioGroupItemProps, type LabeledRadioProps, type RadioCardProps, type RadioImageCardProps, type RadioIconCardProps } from "./radio-group";
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
export { DataViews, type DataViewAction, type DataViewField, type DataViewFilterField, type DataViewFilterProps, type DataViewLayouts, type DataViewsProps, type DataViewState } from '../wordpress/dataviews';

// Calendar component (react-day-picker + WordPress timezone/locale)
export { Calendar, type CalendarProps } from "./calendar";
export {
  wpLocaleToDayPickerKey,
  isWpLocaleRtl,
  WP_TO_DAY_PICKER_LOCALE,
  RTL_WP_LOCALES,
  type DayPickerLocaleKey,
} from "@/lib/locale-map";
export {
  getWordPressTimezone,
  getWordPressLocale,
  getWordPressDateFormat,
  getWordPressTimeFormat,
  formatWordPressDate,
  formatWordPressDateTime,
  getWordPressDateSettings,
  createWordPressLocale,
  type WordPressDateSettings,
} from "@/lib/wordpress-date";

// DatePicker component
export {
  DatePicker,
  DateRangePicker,
  type DatePickerProps,
  type DateRangePickerProps,
  type DateRange,
} from "./date-picker";

// Layout (responsive app layout with optional header/footer and right sidebar)
export {
  Layout,
  LayoutHeader,
  LayoutBody,
  LayoutMain,
  LayoutSidebar,
  LayoutFooter,
  type LayoutProps,
  type LayoutHeaderProps,
  type LayoutBodyProps,
  type LayoutMainProps,
  type LayoutSidebarProps,
  type LayoutFooterProps,
  type LayoutContextValue,
} from "../wordpress/layout";

// Sonner (toast notifications)
export { Toaster } from "./sonner";

// Layout menu (searchable, multi-label nested menu for LayoutSidebar)
export {
  LayoutMenu,
  LayoutMenuSearch,
  type LayoutMenuItemData,
  type LayoutMenuGroupData,
  type LayoutMenuProps,
  type LayoutMenuSearchProps,
} from "../wordpress/layout-menu";
