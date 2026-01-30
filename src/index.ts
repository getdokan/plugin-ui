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
    // Button
    Button,
    // Card
    Card, CardContent, CardDescription, CardFooter, CardHeader,
    CardTitle,
    // Input
    Input,
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
    // Types
    type AlertProps,
    type AlertVariant,
    type BadgeProps,
    type BadgeVariant,
    type ButtonProps,
    type ButtonSize,
    type ButtonVariant,
    type CardContentProps,
    type CardDescriptionProps,
    type CardFooterProps,
    type CardHeaderProps,
    type CardProps,
    type CardTitleProps,
    type InputProps,
    type LabelProps, type ModalProps, type SeparatorProps,
    type SwitchProps,
    type TextareaProps
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
export { cn, twMerge } from "./utils/classnames";
