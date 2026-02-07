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
    CardTitle, CircularProgress,
    // Design system (Figma Design-System-for-Plugin)
    ComponentPreview,
    // Currency input (uses InputGroup)
    CurrencyInput, DesignSystemSection,
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
    ProgressLabel, ProgressTrack, ProgressValue, SelectionItem,
    // Selection Type
    SelectionType,
    // Separator
    Separator,
    // Slider
    Slider,
    // Spinner
    Spinner,
    // Switch
    Switch,
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
    // DataViews
    DataViews,
    // Types
    type BadgeProps,
    type BadgeVariant,
    type CardContentProps,
    type CardDescriptionProps,
    type CardFooterProps,
    type CardHeaderProps,
    type CardProps,
    type CardTitleProps,
    type CircularProgressProps,
    type ComponentPreviewProps,
    type CurrencyInputProps,
    type CurrencyOption,
    type DataViewAction,
    type DataViewField,
    type DataViewFilterField,
    type DataViewFilterProps,
    type DataViewLayouts,
    type DataViewsProps,
    type DataViewState,
    type DesignSystemSectionProps,
    type LabelProps,
    type ModalProps,
    type ProgressProps,
    type SeparatorProps,
    type SliderProps,
    type SwitchProps,
    type ThumbnailAspect,
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

