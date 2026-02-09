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
    CardTitle, CircularProgress,
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
    // Types
    type CircularProgressProps,
    type ComponentPreviewProps,
    type CurrencyInputProps,
    type CurrencyOption,
    type CheckboxProps,
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
    type SliderProps,
    type SwitchProps,
    type LabeledSwitchProps,
    type SwitchCardProps,
    type ThumbnailAspect,
    type ThumbnailProps,
    type ThumbnailSize
} from "./components/ui";

export { MatricsCard, type MatricsCardProps } from './components/matrics-card';
export { MatricsGroup, MatricsGroupItem, type MatricsGroupProps, type MatricsGroupItemProps } from './components/matrics-group';
export { MatricsPill, type MatricsPillProps } from './components/matrics-pill';
export { FileUpload, type FileUploadProps } from './components/file-upload';
export { FileView, type FileViewProps, } from './components/file-view';
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

