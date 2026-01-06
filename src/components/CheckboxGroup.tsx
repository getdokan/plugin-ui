import { twMerge } from 'tailwind-merge';
import Checkbox from './Checkbox';
import type { CheckboxGroupProps } from '../types';

/**
 * CheckboxGroup Component
 *
 * A group of checkboxes for multiple selection.
 */
const CheckboxGroup = ( {
    value = [],
    options = [],
    onChange,
    disabled = false,
    className = '',
    direction = 'vertical',
    columns,
}: CheckboxGroupProps ) => {
    const handleChange = ( optionValue: string | number, checked: boolean ) => {
        let newValues: ( string | number )[];

        if ( checked ) {
            newValues = [ ...value, optionValue ];
        } else {
            newValues = value.filter( ( v ) => v !== optionValue );
        }

        onChange?.( newValues );
    };

    const layoutClass = columns
        ? `grid gap-3`
        : direction === 'horizontal'
        ? 'flex flex-wrap gap-x-6 gap-y-3'
        : 'flex flex-col gap-3';

    const gridStyle = columns
        ? { gridTemplateColumns: `repeat(${ columns }, minmax(0, 1fr))` }
        : undefined;

    return (
        <div className={ twMerge( layoutClass, className ) } style={ gridStyle }>
            { options.map( ( option ) => {
                const isChecked = value.includes( option.value );
                const isDisabled = disabled || option.disabled;

                return (
                    <Checkbox
                        key={ String( option.value ) }
                        checked={ isChecked }
                        onChange={ ( checked ) =>
                            handleChange( option.value, checked )
                        }
                        disabled={ isDisabled }
                        label={ option.label }
                        description={ option.description }
                    />
                );
            } ) }
        </div>
    );
};

export default CheckboxGroup;

