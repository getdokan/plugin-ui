// Styles - Import this in your plugin's entry point
import "./styles.css";

// ============================================
// Providers
// ============================================
export {
    ThemeProvider,
    useTheme,
    useThemeOptional, type ThemeMode, type ThemeProviderProps,
    type ThemeTokens
} from "./providers";

// ============================================
// UI Components (ShadCN-style, pure React)
// ============================================
export {
    // Alert
    Alert, AlertAction, AlertDescription,
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
    AlertDialogTrigger, AlertTitle,
    // Avatar
    Avatar, AvatarBadge, AvatarFallback,
    AvatarGroup,
    AvatarGroupCount, AvatarImage,
    // Badge
    Badge,
    // Breadcrumb
    Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem,
    BreadcrumbLink, BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator,
    // Button
    Button,
    // Card
    Card, CardContent, CardDescription, CardFooter, CardHeader,
    CardTitle,
    // Checkbox
    Checkbox, CheckboxCard, CircularProgress,
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
    CurrencyInput,
    // DataViews
    DataViews,
    DesignSystemSection,
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
    // Field
    Field, FieldContent, FieldDescription,
    FieldError,
    FieldGroup, FieldLabel, FieldLegend,
    FieldSeparator,
    FieldSet, FieldTitle,
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
    Label, LabeledCheckbox, LabeledRadio, LabeledSwitch,
    // Modal
    Modal, ModalClose, ModalContent, ModalDescription,
    ModalFooter, ModalHeader, ModalOverlay, ModalTitle,
    // Notice
    Notice, NoticeAction, NoticeTitle,
    // Progress
    Progress, ProgressIndicator,
    ProgressLabel, ProgressTrack, ProgressValue, RadioCard,
    // Radio
    RadioGroup,
    RadioGroupItem,
    // Select
    Select,
    SelectContent,
    SelectGroup,
    // Selection Type
    SelectionItem,
    SelectionType, SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
    // Separator
    Separator,
    // Slider
    Slider,
    // Spinner
    Spinner,
    // Switch
    Switch, SwitchCard,
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
    // Types
    type BadgeProps,
    type BadgeVariant,
    type CardContentProps,
    type CardDescriptionProps,
    type CardFooterProps,
    type CardHeaderProps,
    type CardProps,
    type CardTitleProps, type CheckboxCardProps, type CheckboxProps, type CircularProgressProps,
    type ComponentPreviewProps,
    type CurrencyInputProps,
    type CurrencyOption,
    type DataViewAction,
    type DataViewField,
    type DataViewFilterField,
    type DataViewFilterProps,
    type DataViewLayouts,
    type DataViewsProps,
    type DataViewState, type DesignSystemSectionProps, type LabeledCheckboxProps, type LabeledRadioProps, type LabeledSwitchProps, type LabelProps,
    type ModalProps,
    type ProgressProps, type RadioCardProps, type RadioGroupItemProps, type SeparatorProps,
    type SliderProps, type SwitchCardProps, type SwitchProps, type ThumbnailAspect,
    type ThumbnailProps,
    type ThumbnailSize
} from "./components/ui";

// ============================================
// Theme Presets
// ============================================
export {
    amberDarkTheme, amberTheme, blueDarkTheme, blueTheme, createDarkTheme, createTheme, defaultDarkTheme, defaultTheme, dokanDarkTheme, dokanTheme, greenDarkTheme, greenTheme, slateDarkTheme, slateTheme
} from "./themes";

// ============================================
// Utilities
// ============================================
export { cn } from "@/lib/utils";
export { twMerge } from "tailwind-merge";

