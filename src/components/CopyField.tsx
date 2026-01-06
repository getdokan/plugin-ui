import { useCallback, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { twMerge } from 'tailwind-merge';
import TextField from './TextField';
import { CopyIcon } from './Icons'; // Assuming we have a CopyIcon or similar
import type { CopyFieldProps } from '../types';

/**
 * CopyField Component
 *
 * A read-only text field with a copy action button.
 */
const CopyField = ( {
    id,
    value,
    placeholder,
    disabled = false,
    className = '',
    successMessage,
    successDuration = 2000,
    label,
    helperText,
    buttonText,
    containerClassName = '',
}: CopyFieldProps ) => {
    const [ copied, setCopied ] = useState( false );

    const handleCopy = useCallback( async () => {
        if ( ! value || disabled ) return;

        try {
            await navigator.clipboard.writeText( String( value ) );
            setCopied( true );
            setTimeout( () => setCopied( false ), successDuration );
        } catch ( err ) {
            // Fallback for older browsers
            const textArea = document.createElement( 'textarea' );
            textArea.value = String( value );
            document.body.appendChild( textArea );
            textArea.select();
            document.execCommand( 'copy' );
            document.body.removeChild( textArea );
            setCopied( true );
            setTimeout( () => setCopied( false ), successDuration );
        }
    }, [ value, disabled, successDuration ] );

    const renderCopyButton = () => {
        return (
            <button
                type="button"
                onClick={ handleCopy }
                disabled={ disabled || ! value }
                className={ twMerge(
                    'flex items-center justify-center bg-white gap-2 px-4 py-2 border rounded-md font-medium text-sm transition-all duration-200',
                    copied
                        ? 'bg-green-50 text-green-600 border-green-300'
                        : 'text-gray-700 hover:bg-gray-50 border-gray-300',
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                ) }
            >
                <span className="w-4 h-4 flex items-center justify-center">
                    { copied ? (
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={ 2 }
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={ 2 }
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                    ) }
                </span>
                <span>
                    { copied
                        ? successMessage || __( 'Copied', 'wedevs-plugin-ui' )
                        : buttonText || __( 'Copy', 'wedevs-plugin-ui' ) }
                </span>
            </button>
        );
    };

    return (
        <div className={ twMerge( 'w-full', containerClassName ) }>
            <TextField
                id={ id }
                value={ value as string }
                placeholder={ placeholder }
                readOnly
                disabled={ disabled }
                className={ className }
                helperText={ helperText }
                actionsButtons={ renderCopyButton() }
                inputProps={ {
                    className: 'bg-gray-50',
                } }
            />
        </div>
    );
};

export default CopyField;

