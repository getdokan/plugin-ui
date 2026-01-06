import { SimpleCheckbox } from '@getdokan/dokan-ui';
import { twMerge } from 'tailwind-merge';
import type { CheckboxProps } from '../types';

/**
 * Checkbox Component
 *
 * A single checkbox input wrapper around Dokan UI SimpleCheckbox.
 */
const Checkbox = ( {
    id,
    checked = false,
    onChange,
    label,
    description,
    disabled = false,
    indeterminate = false,
    className = '',
    inputProps = {},
}: CheckboxProps ) => {
    const handleChange = ( e: React.ChangeEvent< HTMLInputElement > ) => {
        onChange?.( e.target.checked );
    };

    const DokanSimpleCheckbox = SimpleCheckbox as any;

    return (
        <div className={ twMerge( 'inline-flex flex-col gap-1', className ) }>
            <DokanSimpleCheckbox
                id={ id }
                checked={ checked }
                onChange={ handleChange }
                disabled={ disabled }
                indeterminate={ indeterminate }
                label={ label }
                input={ {
                    ...inputProps,
                } }
            />
            { description && (
                <p className="ml-7 text-xs text-gray-500">{ description }</p>
            ) }
        </div>
    );
};

export default Checkbox;

