import { twMerge } from 'tailwind-merge';
import LucideIcon from './Icons/LucideIcon';
import type { RadioCapsuleProps } from '../types';

/**
 * RadioCapsule Component
 *
 * Styled pill/capsule radio buttons.
 */
const RadioCapsule = ( {
    name = 'radio-capsule',
    value,
    options = [],
    onChange,
    disabled = false,
    className = '',
    size = 'md',
}: RadioCapsuleProps ) => {
    const handleChange = ( optionValue: string | number ) => {
        if ( ! disabled ) {
            onChange?.( optionValue );
        }
    };

    const sizeClasses = {
        sm: 'px-3 py-1 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <div
            className={ twMerge( 'inline-flex rounded-lg bg-gray-100 p-1', className ) }
            role="radiogroup"
        >
            { options.map( ( option ) => {
                const isSelected = value === option.value;
                const isDisabled = disabled || option.disabled;

                return (
                    <button
                        key={ String( option.value ) }
                        type="button"
                        role="radio"
                        aria-checked={ isSelected }
                        onClick={ () => handleChange( option.value ) }
                        disabled={ isDisabled }
                        className={ twMerge(
                            sizeClasses[ size ],
                            'font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-dokan-btn ring-offset-1',
                            isSelected
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900',
                            isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        ) }
                    >
                        <span className="flex items-center gap-2">
                            { option.icon && typeof option.icon === 'string' ? (
                                <LucideIcon iconName={ option.icon } className="w-4 h-4" />
                            ) : (
                                option.icon
                            ) }
                            { option.label }
                        </span>
                    </button>
                );
            } ) }

            { /* Hidden radio inputs for form submission */ }
            <div className="sr-only" aria-hidden="true">
                { options.map( ( option ) => (
                    <input
                        key={ `input-${ option.value }` }
                        type="radio"
                        name={ name }
                        value={ option.value }
                        checked={ value === option.value }
                        onChange={ () => handleChange( option.value ) }
                        disabled={ disabled || option.disabled }
                    />
                ) ) }
            </div>
        </div>
    );
};

export default RadioCapsule;

