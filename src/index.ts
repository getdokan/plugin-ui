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
    Alert, AlertDescription, AlertTitle,
    // Badge
    Badge,
    badgeVariants,
    // Button
    Button,
    // Card
    Card, CardContent, CardDescription, CardFooter, CardHeader,
    CardTitle,
    // Design system (Figma Design-System-for-Plugin)
    ComponentPreview, DesignSystemSection,
    // Currency input (uses InputGroup)
    CurrencyInput,
    // Input
    Input,
    InputGroup,
    // Label
    Label,
    // Modal
    Modal, ModalClose, ModalContent, ModalDescription,
    ModalFooter, ModalHeader, ModalOverlay, ModalTitle,
    // Separator
    Separator,
    // Switch
    Switch,
    // Textarea
    Textarea,
    // Tooltip
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    Toggle,
    ToggleGroup,
    ToggleGroupItem,
    MatricsCard,
    MatricsGroup, MatricsGroupItem, MatricsGroupProps, MatricsGroupItemProps,
    MatricsPill,
    FileUpload,
    FileUploadProps,
    FileView, FileViewProps,
    // Types
    type AlertProps,
    type AlertVariant,
    type ButtonProps,
    type ButtonSize,
    type ButtonVariant,
    type ComponentPreviewProps,
    type CurrencyInputProps,
    type CurrencyOption,
    type DesignSystemSectionProps,
    type InputGroupProps,
    type InputProps,
    type LabelProps, type ModalProps, type SeparatorProps,
    type SwitchProps,
    type TextareaProps,
    type MatricsCardProps
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
