/**
 * Common prop types for UI components
 */

export interface BaseFieldProps {
    /**
     * Unique identifier for the field
     */
    id?: string;

    /**
     * Current value
     */
    value?: string | number | boolean | string[] | number[];

    /**
     * Default value when value is undefined
     */
    defaultValue?: string | number | boolean | string[] | number[];

    /**
     * Change handler
     */
    onChange?: ( value: unknown ) => void;

    /**
     * Placeholder text
     */
    placeholder?: string;

    /**
     * Whether the field is disabled
     */
    disabled?: boolean;

    /**
     * Whether the field is read-only
     */
    readOnly?: boolean;

    /**
     * Additional CSS classes
     */
    className?: string;

    /**
     * Aria label for accessibility
     */
    ariaLabel?: string;
}

export interface OptionItem {
    /**
     * Display label
     */
    label: string;

    /**
     * Option value
     */
    value: string | number;

    /**
     * Optional description
     */
    description?: string;

    /**
     * Whether option is disabled
     */
    disabled?: boolean;

    /**
     * Optional icon
     */
    icon?: React.ReactNode;
}

export interface TextFieldProps extends BaseFieldProps {
    /**
     * Input type (text, email, tel, url, search, number, password, etc.)
     */
    type?: string;

    /**
     * Prefix element (icon or text)
     */
    prefix?: React.ReactNode;

    /**
     * Suffix element (icon or text)
     */
    suffix?: React.ReactNode;

    /**
     * Maximum length
     */
    maxLength?: number;

    /**
     * Minimum length
     */
    minLength?: number;

    /**
     * Pattern for validation
     */
    pattern?: string;

    /**
     * Auto-complete attribute
     */
    autoComplete?: string;

    /**
     * Auto-focus on mount
     */
    autoFocus?: boolean;

    /**
     * Helper text below the input
     */
    helperText?: string;

    /**
     * Error message or array of messages
     */
    errors?: string | string[];

    /**
     * Whether to show character count
     */
    showCharCount?: boolean;

    /**
     * Action buttons to display next to the input
     */
    actionsButtons?: React.ReactNode;

    /**
     * Field status
     */
    status?: 'default' | 'error' | 'success' | 'warning' | 'info';

    /**
     * Input props to pass to the underlying input element
     */
    inputProps?: React.InputHTMLAttributes< HTMLInputElement >;
}

export interface CheckboxProps {
    /**
     * Unique identifier
     */
    id?: string;

    /**
     * Whether checkbox is checked
     */
    checked?: boolean;

    /**
     * Change handler
     */
    onChange?: ( checked: boolean ) => void;

    /**
     * Label element or text
     */
    label?: React.ReactNode;

    /**
     * Description below label
     */
    description?: React.ReactNode;

    /**
     * Whether checkbox is disabled
     */
    disabled?: boolean;

    /**
     * Indeterminate state
     */
    indeterminate?: boolean;

    /**
     * Additional CSS classes
     */
    className?: string;

    /**
     * Input props to pass to the underlying input element
     */
    inputProps?: React.InputHTMLAttributes< HTMLInputElement >;
}

export interface CheckboxGroupProps {
    /**
     * Selected values
     */
    value?: ( string | number )[];

    /**
     * Options array
     */
    options: OptionItem[];

    /**
     * Change handler
     */
    onChange?: ( values: ( string | number )[] ) => void;

    /**
     * Whether group is disabled
     */
    disabled?: boolean;

    /**
     * Layout direction
     */
    direction?: 'horizontal' | 'vertical';

    /**
     * Number of columns for grid layout
     */
    columns?: number;

    /**
     * Additional CSS classes
     */
    className?: string;
}

export interface RadioProps {
    /**
     * Unique identifier
     */
    id?: string;

    /**
     * Group name
     */
    name?: string;

    /**
     * Selected value
     */
    value?: string | number;

    /**
     * Options array
     */
    options: OptionItem[];

    /**
     * Change handler
     */
    onChange?: ( value: string | number ) => void;

    /**
     * Whether radio group is disabled
     */
    disabled?: boolean;

    /**
     * Additional CSS classes
     */
    className?: string;

    /**
     * Layout direction
     */
    direction?: 'horizontal' | 'vertical';

    /**
     * Number of columns for grid layout
     */
    columns?: number;
}

export interface RadioCapsuleProps {
    /**
     * Group name
     */
    name?: string;

    /**
     * Selected value
     */
    value?: string | number;

    /**
     * Options array
     */
    options: OptionItem[];

    /**
     * Change handler
     */
    onChange?: ( value: string | number ) => void;

    /**
     * Whether radio group is disabled
     */
    disabled?: boolean;

    /**
     * Additional CSS classes
     */
    className?: string;

    /**
     * Size variant
     */
    size?: 'sm' | 'md' | 'lg';
}

export interface FieldLabelProps {
    /**
     * Label text
     */
    title?: string | React.ReactNode;

    /**
     * Description/helper text below label
     */
    description?: string | React.ReactNode;

    /**
     * Tooltip text on hover
     */
    tooltip?: string;

    /**
     * Suffix text/element to display after title
     */
    suffix?: string | React.ReactNode;

    /**
     * Image URL to display
     */
    imageUrl?: string;

    /**
     * HTML for attribute
     */
    htmlFor?: string;

    /**
     * Whether label text is bold
     */
    isBold?: boolean;

    /**
     * Font weight for the title
     */
    titleFontWeight?: 'light' | 'normal' | 'semibold' | 'bold';

    /**
     * Additional CSS classes
     */
    className?: string;

    /**
     * Additional CSS classes for the label element
     */
    labelClassName?: string;
}

export interface CopyFieldProps extends BaseFieldProps {
    /**
     * Success message after copy
     */
    successMessage?: string;

    /**
     * Duration to show success state (ms)
     */
    successDuration?: number;

    /**
     * Field label
     */
    label?: string;

    /**
     * Tooltip content
     */
    tooltip?: React.ReactNode;

    /**
     * Helper text
     */
    helperText?: string;

    /**
     * Button text
     */
    buttonText?: string;

    /**
     * Additional CSS classes for the container
     */
    containerClassName?: string;
}

export interface TextAreaProps extends BaseFieldProps {
    /**
     * Number of visible rows
     */
    rows?: number;

    /**
     * Maximum length
     */
    maxLength?: number;

    /**
     * Whether to allow resize
     */
    resize?: 'none' | 'both' | 'horizontal' | 'vertical';

    /**
     * Show character count
     */
    showCount?: boolean;

    /**
     * Helper text below the textarea
     */
    helperText?: string;

    /**
     * Error message or array of messages
     */
    errors?: string | string[];
}

export interface SelectProps<Option = any> extends BaseFieldProps {
    /**
     * Options array
     */
    options: Option[];

    /**
     * Whether the select is searchable
     */
    isSearchable?: boolean;

    /**
     * Whether to allow multiple selection
     */
    isMulti?: boolean;

    /**
     * Icon to display in the control
     */
    icon?: React.ReactNode;

    /**
     * Icon position
     */
    iconPosition?: 'left' | 'right';

    /**
     * Custom components for react-select
     */
    components?: any;

    /**
     * Prefix title for the selected value
     */
    selectedTitle?: string | ( ( option: any ) => string );

    /**
     * Portal target for menu
     */
    menuPortalTarget?: HTMLElement | null;

    /**
     * Menu position
     */
    menuPosition?: 'fixed' | 'absolute';

    /**
     * React Select class name prefix
     */
    classNamePrefix?: string;

    /**
     * Whether to blur input on select
     */
    blurInputOnSelect?: boolean;

    /**
     * Whether to close menu on select
     */
    closeMenuOnSelect?: boolean;

    /**
     * Whether to hide selected options
     */
    hideSelectedOptions?: boolean;
}

export interface SwitchProps {
    /**
     * Unique identifier
     */
    id?: string;

    /**
     * Whether switch is checked
     */
    checked?: boolean;

    /**
     * Change handler
     */
    onChange?: ( checked: boolean ) => void;

    /**
     * Label element or text
     */
    label?: React.ReactNode;

    /**
     * Helper text below the switch
     */
    helpText?: React.ReactNode;

    /**
     * Whether switch is disabled
     */
    disabled?: boolean;

    /**
     * Size variant
     */
    size?: 'sm' | 'md' | 'lg';

    /**
     * Color theme
     */
    color?: string;

    /**
     * Additional CSS classes
     */
    className?: string;

    /**
     * Container CSS classes
     */
    containerClassName?: string;
}

export interface FileUploadProps extends BaseFieldProps {
    /**
     * Allowed file types (e.g., ['image', 'video'])
     */
    allowedTypes?: string[];

    /**
     * Maximum file size in bytes
     */
    maxSize?: number;

    /**
     * Whether to allow multiple files
     */
    multiple?: boolean;

    /**
     * Button text
     */
    buttonText?: string;

    /**
     * Preview mode ('image' | 'file' | 'none')
     */
    previewMode?: 'image' | 'file' | 'none';

    /**
     * Label text
     */
    label?: string;

    /**
     * Callback when a URL is imported
     */
    onUrlImport?: ( url: string ) => void;

    /**
     * Callback when a media item is selected
     */
    onSelect?: ( media: any ) => void;
}

export interface RepeaterItem {
    /**
     * Unique identifier
     */
    id: string;

    /**
     * Display order
     */
    order: number;

    /**
     * Item title/label
     */
    title: string;

    /**
     * Whether item is required (cannot be deleted)
     */
    required?: boolean;

    /**
     * Additional item data
     */
    [ key: string ]: unknown;
}

export interface RepeaterProps {
    /**
     * Array of items
     */
    items: RepeaterItem[];

    /**
     * Change handler
     */
    onChange: ( items: RepeaterItem[] ) => void;

    /**
     * Label for add button
     */
    addButtonText?: string;

    /**
     * Whether items are sortable
     */
    sortable?: boolean;

    /**
     * Render function for each item
     */
    renderItem?: ( item: RepeaterItem ) => React.ReactNode;

    /**
     * Maximum number of items
     */
    maxItems?: number;

    /**
     * Minimum number of items
     */
    minItems?: number;
}

export interface ModalProps {
    /**
     * Whether modal is open
     */
    isOpen: boolean;

    /**
     * Close handler
     */
    onClose: () => void;

    /**
     * Confirm handler
     */
    onConfirm?: () => void;

    /**
     * Modal title
     */
    title?: string;

    /**
     * Modal content
     */
    children?: React.ReactNode;

    /**
     * Confirm button text
     */
    confirmText?: string;

    /**
     * Cancel button text
     */
    cancelText?: string;

    /**
     * Additional CSS classes
     */
    className?: string;

    /**
     * Whether to show footer buttons
     */
    showFooter?: boolean;
}

export interface TooltipProps {
    /**
     * Tooltip content
     */
    content: React.ReactNode;

    /**
     * Trigger element
     */
    children: React.ReactNode;

    /**
     * Position of tooltip
     */
    position?: 'top' | 'bottom' | 'left' | 'right';

    /**
     * Delay before showing (ms)
     */
    delay?: number;
}

export interface TimePickerProps {
    /**
     * Unique identifier
     */
    id?: string;

    /**
     * Time value as object or HH:MM string
     */
    value?: { hours: number; minutes: number } | string | any;

    /**
     * Change handler
     */
    onChange?: ( value: any ) => void;

    /**
     * 12-hour or 24-hour format display
     */
    is12Hour?: boolean;

    /**
     * Container CSS classes
     */
    containerClassName?: string;

    /**
     * Label text
     */
    label?: string;

    /**
     * Additional CSS classes
     */
    className?: string;
}

export interface ShowHideFieldProps extends BaseFieldProps {
    /**
     * Whether to show or hide the field value
     */
    showValue?: boolean;

    /**
     * Callback when visibility is toggled
     */
    onToggleVisibility?: ( show: boolean ) => void;

    /**
     * Success message for copy (if used as copy field)
     */
    successMessage?: string;

    /**
     * Helper text
     */
    helperText?: string;
}

export interface SocialButtonProps {
    /**
     * Social network
     */
    network: 'facebook' | 'google' | 'twitter' | string;

    /**
     * Button label
     */
    label?: string | React.ReactNode;

    /**
     * Click handler
     */
    onClick?: () => void;

    /**
     * Additional CSS classes
     */
    className?: string;

    /**
     * Whether button is disabled
     */
    disabled?: boolean;
}

export interface RadioOption {
    value: string | number;
    title: string | React.ReactNode;
    description?: string | React.ReactNode;
    icon?: string | React.ReactNode;
    image?: string;
    preview?: React.ReactNode;
}

export interface CustomizeRadioProps {
    options: RadioOption[];
    selectedValue: string | number;
    onChange: ( value: string | number ) => void;
    radioVariant?: 'simple' | 'card' | 'template' | 'radio_box';
    name?: string;
    className?: string;
    disabled?: boolean;
    divider?: boolean;
}

export interface ListItemProps {
    /**
     * Primary text content of the list item
     */
    primary: string | React.ReactNode;

    /**
     * Secondary/description text content
     */
    secondary?: string | React.ReactNode;

    /**
     * Icon or image element to display at the start of the list item
     */
    leadingElement?: React.ReactNode;

    /**
     * Elements to display at the end of the list item (actions, icons, etc.)
     */
    trailingElement?: React.ReactNode;

    /**
     * Whether the list item is currently selected
     */
    selected?: boolean;

    /**
     * Whether the list item is disabled
     */
    disabled?: boolean;

    /**
     * Function to call when the list item is clicked
     */
    onClick?: () => void;

    /**
     * Custom class name for the list item container
     */
    className?: string;

    /**
     * Variant configuration for the list item
     */
    variant?: {
        size?: 'sm' | 'md' | 'lg';
        layout?: 'default' | 'compact' | 'expanded';
    };

    /**
     * Whether the list item should show a hover effect
     */
    showHover?: boolean;

    /**
     * Whether the list item should show a divider at the bottom
     */
    showDivider?: boolean;

    /**
     * Additional props
     */
    [ key: string ]: any;
}

export interface ListProps {
    /**
     * Array of items to render in the list
     */
    items: Array< ListItemProps >;

    /**
     * Custom class name for the list container
     */
    className?: string;

    /**
     * Title of the list
     */
    title?: string;

    /**
     * Description or subtitle for the list
     */
    description?: string;

    /**
     * Whether to show dividers between list items
     */
    showDividers?: boolean;

    /**
     * Whether the list has a border
     */
    bordered?: boolean;

    /**
     * Whether the list has rounded corners
     */
    rounded?: boolean;

    /**
     * Background color of the list
     */
    bgColor?: string;

    /**
     * Maximum height of the list with overflow
     */
    maxHeight?: string | number;

    /**
     * Custom element to render at the top of the list
     */
    headerElement?: React.ReactNode;

    /**
     * Custom element to render at the bottom of the list
     */
    footerElement?: React.ReactNode;

    /**
     * Whether the list is in a loading state
     */
    loading?: boolean;

    /**
     * Message to display when there are no items
     */
    emptyMessage?: string | React.ReactNode;

    /**
     * Function to call when an item is selected
     */
    onSelect?: ( item: ListItemProps, index: number ) => void;

    /**
     * ID of the currently selected item
     */
    selectedId?: string | number;

    /**
     * Key name to use for item identification
     */
    itemKey?: string;

    /**
     * Whether to allow multiple item selection
     */
    multiSelect?: boolean;

    /**
     * Array of selected item IDs when multiSelect is true
     */
    selectedIds?: Array< string | number >;

    /**
     * Custom class names for the list wrapper
     */
    listWrapperClasses?: string;
}
