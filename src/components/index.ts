/**
 * @wedevs/plugin-ui Components
 *
 * Reusable UI components for WordPress plugins.
 */

// Basic Inputs
export { default as TextField } from './TextField';
export { default as NumberField } from './NumberField';
export { default as TextArea } from './TextArea';
export { default as PasswordField } from './PasswordField';
export { default as Select } from './Select';
export { default as Checkbox } from './Checkbox';
export { default as CheckboxGroup } from './CheckboxGroup';
export { default as Radio } from './Radio';
export { default as RadioCapsule } from './RadioCapsule';
export { default as Switch } from './Switch';
export { default as SocialButton } from './SocialButton';
export { default as ShowHideField } from './ShowHideField';
export { default as CustomizeRadio } from './CustomizeRadio';
export { default as List } from './List';
export { default as ListItem } from './List/ListItem';

// Display
export { default as FieldLabel } from './FieldLabel';
export { default as InfoBox } from './InfoBox';
export { default as Modal } from './Modal';
export { default as Alert } from './Alert';
export { default as Badge } from './Badge';
export { default as Button } from './Button';
export { default as Tooltip } from './Tooltip';
export { default as AsyncSelect } from './AsyncSelect';
export { default as VendorAsyncSelect } from './VendorAsyncSelect';
export { default as ProductAsyncSelect } from './ProductAsyncSelect';
export { default as OrderAsyncSelect } from './OrderAsyncSelect';
export { default as CouponAsyncSelect } from './CouponAsyncSelect';
export { default as Filter } from './Filter';
export { default as VisitStore } from './VisitStore';
// Icons
export { default as LucideIcon } from './Icons/LucideIcon';
export { default as ChevronDownIcon } from './Icons/ChevronDownIcon';
export { default as ChevronUpIcon } from './Icons/ChevronUpIcon';
export { default as CopyIcon } from './Icons/CopyIcon';
export { default as EyeIcon } from './Icons/EyeIcon';
export { default as EyeOffIcon } from './Icons/EyeOffIcon';
export { default as GoogleIcon } from './Icons/GoogleIcon';
export { default as InfoIcon } from './Icons/InfoIcon';
export { default as Plus } from './Icons/Plus';
export { default as RefreshIcon } from './Icons/RefreshIcon';
export { default as SquareMinus } from './Icons/SquareMinus';
export { default as SquarePlus } from './Icons/SquarePlus';

// Re-export common icons from lucide-react for convenience
export { 
    Search,
    X,
    Calendar,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Check,
    AlertCircle,
    Info,
    AlertTriangle,
} from 'lucide-react';

// Generic Components
export { default as Link } from './Link';
export { default as DebouncedInput } from './DebouncedInput';
export { default as SearchInput } from './SearchInput';
export { default as Popover } from './Popover';
export { default as MediaUploader } from './MediaUploader';

// Re-export types
export type { LinkProps } from './Link';
export { type TextFieldProps } from '../types';
export type { NumberFieldProps } from './NumberField';
export { type TextAreaProps } from '../types';
export type { PasswordFieldProps } from './PasswordField';
export { type SelectProps } from '../types';
export { type CheckboxProps } from '../types';
export { type CheckboxGroupProps } from '../types';
export { type RadioProps } from '../types';
export { type RadioCapsuleProps } from '../types';
export { type CopyFieldProps } from '../types';
export { type TimePickerProps } from '../types';
export { type SocialButtonProps } from '../types';
export { type ShowHideFieldProps } from '../types';
export { type CustomizeRadioProps, type ListProps, type ListItemProps } from '../types';
export type { SwitchProps } from '../types';
export type { ColorPickerProps } from './ColorPicker';
export type { RichTextProps } from './RichText';
export type { InfoBoxProps } from './InfoBox';
export type { AlertVariant, DokanAlertProps as AlertProps } from './Alert';
export type { BadgeVariant, DokanBadgeProps as BadgeProps } from './Badge';
export type { ButtonVariant, DokanButtonProps as ButtonProps } from './Button';
