import type { SettingsElement, FieldComponentProps } from './settings-types';
import { useSettings } from './settings-context';
import {
    TextField,
    NumberField,
    TextareaField,
    SelectField,
    SwitchField,
    RadioCapsuleField,
    CustomizeRadioField,
    MulticheckField,
    LabelField,
    ShowHideField,
    ColorPickerField,
    HtmlField,
    NoticeField,
    FallbackField,
    CopyField,
    InfoField,
    RichTextField,
    GoogleAnalyticsField,
} from './fields';

// ============================================
// Field Renderer — dispatches by variant
// Wraps each variant with applyFilters from context
// (consumer passes applyFilters via Settings props,
//  e.g. @wordpress/hooks applyFilters or a custom function)
// ============================================

export function FieldRenderer({ element }: { element: SettingsElement }) {
    const { values, updateValue, shouldDisplay, hookPrefix, errors, applyFilters } = useSettings();

    // Check display status (dependency evaluation)
    if (!shouldDisplay(element)) {
        return null;
    }

    // Merge current value from context
    const mergedElement: SettingsElement = {
        ...element,
        value: element.dependency_key ? (values[element.dependency_key] ?? element.value) : element.value,
        validationError: element.dependency_key ? errors[element.dependency_key] : undefined,
    };

    const fieldProps: FieldComponentProps = {
        element: mergedElement,
        onChange: updateValue,
    };

    const variant = element.variant || '';
    const filterPrefix = hookPrefix || 'plugin_ui';

    // Dispatch by variant — each wrapped with applyFilters
    switch (variant) {
        case 'text':
            return applyFilters(
                `${filterPrefix}_settings_text_field`,
                <TextField {...fieldProps} />,
                mergedElement
            );

        case 'number':
            return applyFilters(
                `${filterPrefix}_settings_number_field`,
                <NumberField {...fieldProps} />,
                mergedElement
            );

        case 'textarea':
            return applyFilters(
                `${filterPrefix}_settings_textarea_field`,
                <TextareaField {...fieldProps} />,
                mergedElement
            );

        case 'rich_text':
            return applyFilters(
                `${filterPrefix}_settings_rich_text_field`,
                <RichTextField {...fieldProps} />,
                mergedElement
            );

        case 'select':
            return applyFilters(
                `${filterPrefix}_settings_select_field`,
                <SelectField {...fieldProps} />,
                mergedElement
            );

        case 'switch':
            return applyFilters(
                `${filterPrefix}_settings_switch_field`,
                <SwitchField {...fieldProps} />,
                mergedElement
            );

        case 'radio_capsule':
            return applyFilters(
                `${filterPrefix}_settings_radio_capsule_field`,
                <RadioCapsuleField {...fieldProps} />,
                mergedElement
            );

        case 'customize_radio':
            return applyFilters(
                `${filterPrefix}_settings_customize_radio_field`,
                <CustomizeRadioField {...fieldProps} />,
                mergedElement
            );

        case 'google_analytics':
            return applyFilters(
                `${filterPrefix}_settings_google_analytics_field`,
                <GoogleAnalyticsField {...fieldProps} />,
                mergedElement
            );

        case 'multicheck':
        case 'checkbox_group':
            return applyFilters(
                `${filterPrefix}_settings_multicheck_field`,
                <MulticheckField {...fieldProps} />,
                mergedElement
            );

        case 'base_field_label':
            return applyFilters(
                `${filterPrefix}_settings_label_field`,
                <LabelField {...fieldProps} />,
                mergedElement
            );

        case 'show_hide':
            return applyFilters(
                `${filterPrefix}_settings_show_hide_field`,
                <ShowHideField {...fieldProps} />,
                mergedElement
            );

        case 'color_picker':
        case 'select_color_picker':
            return applyFilters(
                `${filterPrefix}_settings_color_picker_field`,
                <ColorPickerField {...fieldProps} />,
                mergedElement
            );

        case 'html':
            return applyFilters(
                `${filterPrefix}_settings_html_field`,
                <HtmlField {...fieldProps} />,
                mergedElement
            );

        case 'notice':
            return applyFilters(
                `${filterPrefix}_settings_notice_field`,
                <NoticeField {...fieldProps} />,
                mergedElement
            );

        case 'copy_field':
            return applyFilters(
                `${filterPrefix}_settings_copy_field`,
                <CopyField {...fieldProps} />,
                mergedElement
            );

        case 'info':
            return applyFilters(
                `${filterPrefix}_settings_info_field`,
                <InfoField {...fieldProps} />,
                mergedElement
            );

        default:
            // Unknown variant — consumer must handle via applyFilters
            return applyFilters(
                `${filterPrefix}_settings_default_field`,
                <FallbackField {...fieldProps} />,
                mergedElement
            );
    }
}
