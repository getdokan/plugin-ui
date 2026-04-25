// Styles - Import this in your plugin's entry point
import "./styles.css";

// ============================================
// Providers
// ============================================
export {
    ThemeProvider,
    useTheme,
    useThemeOptional, type ThemeMode, type ThemeProviderProps,
    type ThemeTokens, type ThemeContextValue
} from "./providers";

// ============================================
// UI Components (ShadCN-style, pure React)
// ============================================
export {
    // Alert
    Alert, AlertAction, AlertDescription, AlertTitle,
    // AlertDialog
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
    // Avatar
    Avatar, AvatarBadge, AvatarFallback,
    AvatarGroup,
    AvatarGroupCount, AvatarImage,
    // Badge
    Badge,
    badgeVariants,
    // Breadcrumb
    Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem,
    BreadcrumbLink, BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator,
    // Button
    Button,
    // Card
    Card, CardContent, CardDescription, CardFooter, CardHeader,
    CardTitle,
    // Chart
    ChartContainer, ChartTooltip, ChartTooltipContent,
    ChartLegend, ChartLegendContent, ChartStyle,
    CircularProgress,
    // Combobox
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
    // Design system (Figma Design-System-for-Plugin)
    ComponentPreview,
    // Currency input (uses InputGroup)
    CurrencyInput, DesignSystemSection,
    // DataViews
    DataViews,
    // Dialog
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
    // DropdownMenu
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
    // Checkbox
    Checkbox,
    LabeledCheckbox,
    CheckboxCard,
    // Radio
    RadioGroup,
    RadioGroupItem,
    LabeledRadio,
    RadioCard,
    // Field
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
    // Layout
    Layout,
    LayoutHeader,
    LayoutBody,
    LayoutMain,
    LayoutSidebar,
    LayoutFooter,
    LayoutMenu,
    LayoutMenuSearch,
    // Input
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
    // Input OTP
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
    // Label
    Label,
    // Modal
    Modal, ModalClose, ModalContent, ModalDescription,
    ModalFooter, ModalHeader, ModalOverlay, ModalTitle,
    // Notice
    Notice, NoticeAction, NoticeTitle,
    // Popover
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverPortal,
    PopoverTitle,
    PopoverTrigger,
    PopoverArrow,
    PopoverClose,
    // Sheet
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
    // Sidebar
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
    // Skeleton
    Skeleton,
    // Sortable
    Sortable,
    SortableItem,
    SortableDragHandle,
    SortableProvider,
    DragOverlay,
    // ScrollArea
    ScrollArea,
    ScrollBar,
    // Progress
    Progress, ProgressIndicator,
    ProgressLabel, ProgressTrack, ProgressValue,
    // Select
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
    // Selection Type
    SelectionItem,
    SelectionType,
    // SmartSelect
    SmartSelect,
    type SmartSelectOption,
    type SmartSelectProps,
    type SmartSelectCreateContext,
    // SmartMultiSelect
    SmartMultiSelect,
    type SmartMultiSelectOption,
    type SmartMultiSelectProps,
    type SmartMultiSelectRef,
    type SmartMultiSelectCreateContext,
    // Separator
    Separator,
    // Slider
    Slider,
    // Spinner
    Spinner,
    // Switch
    Switch,
    LabeledSwitch,
    SwitchCard,
    // Tabs
    Tabs, TabsContent, TabsList,
    TabsTrigger,
    // Textarea
    Textarea,
    // Thumbnail
    Thumbnail, Toggle,
    ToggleGroup,
    ToggleGroupItem,
    // Tooltip
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    // Utilities
    useComboboxAnchor,
    // Rich Text Editor
    RichTextEditor,
    // Pagination
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    // Sonner (toast notifications)
    Toaster,
    // Calendar & DatePicker
    Calendar,
    DatePicker,
    DateRangePicker,
    // Types
    type RichTextEditorProps,
    type CalendarProps,
    type DatePickerProps,
    type DateRangePickerProps,
    type DateRange,
    type CircularProgressProps,
    type ComponentPreviewProps,
    type CurrencyInputProps,
    type CurrencyOption,
    type CheckboxProps,
    type DataViewAction,
    type DataViewField,
    type DataViewFilterField,
    type DataViewFilterProps,
    type DataViewLayouts,
    type DataViewsProps,
    type DataViewState,
    type LabeledCheckboxProps,
    type CheckboxCardProps,
    type RadioGroupItemProps,
    type LabeledRadioProps,
    type RadioCardProps,
    type DesignSystemSectionProps,
    type LabelProps,
    type ModalProps,
    type ProgressProps,
    type SeparatorProps,
    type SortableProps,
    type SortableItemProps,
    type SortableDragHandleProps,
    type SortableProviderProps,
    type SliderProps,
    type SwitchProps,
    type LabeledSwitchProps,
    type SwitchCardProps,
    type ThumbnailAspect,
    type ThumbnailProps,
    type ThumbnailSize,
    type LayoutProps,
    type LayoutHeaderProps,
    type LayoutBodyProps,
    type LayoutMainProps,
    type LayoutSidebarProps,
    type LayoutFooterProps,
    type LayoutContextValue,
    type LayoutMenuItemData,
    type LayoutMenuGroupData,
    type LayoutMenuProps,
    type LayoutMenuSearchProps,
    type PaginationLinkProps,
} from "./components/ui";

export { MatricsCard, type MatricsCardProps } from './components/matrics-card';
export { MatricsGroup, MatricsGroupItem, type MatricsGroupProps, type MatricsGroupItemProps } from './components/matrics-group';
export { MatricsPill, type MatricsPillProps } from './components/matrics-pill';
export { FileUpload, type FileUploadProps } from './components/file-upload';
export { FileView, type FileViewProps, } from './components/file-view';
export {
    WpMediaUpload,
    type WpMediaUploadProps,
    WpMediaUploadMultiple,
    type WpMediaUploadMultipleProps,
} from './components/wordpress/WpMediaUpload';
export {
    Logo,
    type LogoProps,
    YoutubeCircleLightLogo,
    type YoutubeCircleLightLogoProps,
    YoutubeCircleDarkLogo,
    type YoutubeCircleLightDarkProps,
} from './components/logo';
export { TopBar, type TopBarProps } from './components/top-bar'
export { CrownIcon, type CrownIconProps } from './components/crown-icon'
export { ButtonToggleGroup, type ButtonToggleGroupProps, type ButtonToggleGroupItem } from './components/button-toggle-group'
export { License, type LicenseProps, type LicenseLabels, type LicenseStatus, type LicenseClassNames } from './components/license'

// Settings (schema-driven settings page)
export {
    Settings,
    SettingsProvider,
    useSettings,
    FieldRenderer,
    formatSettingsData,
    extractValues,
    type ApplyFiltersFunction,
    type SettingsProps,
    type SettingsElement,
    type FieldComponentProps,
    type SaveButtonRenderProps,
} from './components/settings';
export { SettingsSkeleton } from './components/settings/settings-skeleton';

// ============================================
// Theme Presets
// ============================================
export {
    createDarkTheme, createTheme, defaultDarkTheme, defaultTheme, slateDarkTheme, slateTheme
} from "./themes";

// ============================================
// Utilities
// ============================================
export { cn } from "@/lib/utils";
export { twMerge } from "tailwind-merge";
export * as recharts from 'recharts';
export { toast } from 'sonner';