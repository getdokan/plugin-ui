import { SearchableSelect } from '@getdokan/dokan-ui';
import ValueContainer from "./select/ValueContainer";
import Option from "./select/Option";
import MultiValue from "./select/MultiValue";
import SingleValue from "./select/SingleValue";
import Control from "./select/Control";
import DropdownIndicator from "./select/DropdownIndicator";
import styles from "./select/styles";
import type { SelectProps } from '../types';

/**
 * Select Component
 *
 * A searchable select component wrapper around Dokan UI SearchableSelect.
 */
function Select< Option = any >( props: SelectProps ) {
    const {
        options = [],
        value,
        onChange,
        isSearchable = true,
        isMulti = false,
        icon,
        iconPosition = 'left',
        components,
        selectedTitle,
        menuPortalTarget,
        menuPosition = 'fixed',
        className = '',
        ...otherProps
    } = props;

    // Default portal target for the dropdown menu so it isn't clipped by parent containers
    const defaultMenuPortalTarget =
        typeof document !== 'undefined' ? document.body : undefined;

    return (
        <SearchableSelect
            options={ options as any }
            value={ value as any }
            onChange={ onChange as any }
            isSearchable={ isSearchable }
            isMulti={ isMulti }
            components={ {
                Control,
                DropdownIndicator,
                SingleValue,
                ValueContainer,
                MultiValue,
                Option,
                ...components,
            } as any }
            styles={ styles }
            className={ className }
            classNamePrefix={ ( props as any ).classNamePrefix ?? 'react-select' }
            blurInputOnSelect={ ( props as any ).blurInputOnSelect ?? true }
            closeMenuOnSelect={ ( props as any ).closeMenuOnSelect ?? true }
            hideSelectedOptions={ ( props as any ).hideSelectedOptions ?? false }
            menuPortalTarget={ menuPortalTarget ?? defaultMenuPortalTarget }
            menuPosition={ menuPosition }
            { ...( otherProps as any ) }
        />
    );
}

export default Select;
