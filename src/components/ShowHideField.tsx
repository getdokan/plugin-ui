import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { twMerge } from 'tailwind-merge';
import TextField from './TextField';
import { EyeIcon, EyeOffIcon } from './Icons';
import type { ShowHideFieldProps } from '../types';

/**
 * ShowHideField Component
 *
 * A text field that toggles between password and text type.
 */
const ShowHideField = ( {
    id,
    value,
    onChange,
    disabled = false,
    helperText,
    placeholder,
    className = '',
    showValue: initialShowValue = false,
    onToggleVisibility,
}: ShowHideFieldProps ) => {
    const [ showValue, setShowValue ] = useState( initialShowValue );

    const handleToggleVisibility = () => {
        const nextShowValue = ! showValue;
        setShowValue( nextShowValue );
        onToggleVisibility?.( nextShowValue );
    };

    const renderToggleButton = () => {
        return (
            <button
                type="button"
                onClick={ handleToggleVisibility }
                className={ twMerge(
                    'flex w-24 items-center justify-center bg-white gap-2 px-4 py-2 border border-gray-300 hover:border-gray-400 rounded-md text-gray-700 font-medium text-sm transition-all duration-200',
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                ) }
                disabled={ disabled }
            >
                <span className="w-4 h-4 flex items-center justify-center">
                    { showValue ? <EyeOffIcon /> : <EyeIcon /> }
                </span>
                <span>{ showValue ? __( 'Hide', 'wedevs-plugin-ui' ) : __( 'View', 'wedevs-plugin-ui' ) }</span>
            </button>
        );
    };

    return (
        <div className={ twMerge( 'w-full', className ) }>
            <TextField
                id={ id }
                value={ value as string }
                onChange={ onChange }
                disabled={ disabled }
                type={ showValue ? 'text' : 'password' }
                placeholder={ placeholder }
                helperText={ helperText }
                actionsButtons={ renderToggleButton() }
                inputProps={ {
                    className: ! showValue ? 'tracking-wider' : '',
                } }
            />
        </div>
    );
};

export default ShowHideField;
