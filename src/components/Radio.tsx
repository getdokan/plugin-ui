import { twMerge } from 'tailwind-merge';
import type { RadioProps } from '../types';

/**
 * Radio Component
 *
 * A radio button group wrapper.
 */
const Radio = ( {
    name,
    value,
    options = [],
    onChange,
    disabled = false,
    className = '',
    direction = 'vertical',
    columns,
}: RadioProps ) => {
    const handleChange = ( e: React.ChangeEvent< HTMLInputElement > ) => {
        onChange?.( e.target.value );
    };

    const layoutClass = columns
        ? `grid gap-3`
        : direction === 'horizontal'
        ? 'flex flex-wrap gap-4'
        : 'flex flex-col gap-3';

    const gridStyle = columns
        ? { gridTemplateColumns: `repeat(${ columns }, minmax(0, 1fr))` }
        : undefined;

    return (
        <div className={ twMerge( layoutClass, className ) } style={ gridStyle }>
            { options.map( ( option ) => {
                const optionId = `${ name }-${ option.value }`;
                const isChecked = value === option.value;
                const isDisabled = disabled || option.disabled;

                return (
                    <label
                        key={ String( option.value ) }
                        htmlFor={ optionId }
                        className={ twMerge(
                            'flex items-start gap-3 cursor-pointer',
                            isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                        ) }
                    >
                        <div className="flex items-center h-5">
                            <input
                                id={ optionId }
                                type="radio"
                                name={ name }
                                value={ option.value }
                                checked={ isChecked }
                                onChange={ handleChange }
                                disabled={ isDisabled }
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-700">
                                { option.label }
                            </span>
                            { option.description && (
                                <p className="text-xs text-gray-500">
                                    { option.description }
                                </p>
                            ) }
                        </div>
                    </label>
                );
            } ) }
        </div>
    );
};

export default Radio;

