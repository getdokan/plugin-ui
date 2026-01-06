import { forwardRef } from '@wordpress/element';
import { TextArea as DokanTextArea } from '@getdokan/dokan-ui';
import { twMerge } from 'tailwind-merge';
import type { TextAreaProps } from '../types';

/**
 * TextArea Component
 *
 * A multi-line text input wrapper around Dokan UI TextArea.
 */
const TextArea = forwardRef< HTMLTextAreaElement, TextAreaProps >(
    (
        {
            id,
            value,
            onChange,
            placeholder,
            disabled = false,
            readOnly = false,
            className = '',
            rows = 4,
            maxLength,
            showCount = false,
            helperText,
            errors,
            ...otherProps
        },
        ref
    ) => {
        const handleChange = ( e: React.ChangeEvent< HTMLTextAreaElement > ) => {
            onChange?.( e.target.value );
        };

        const errorMessages = typeof errors === 'string' ? [ errors ] : errors || [];
        const DokanTextAreaComponent = DokanTextArea as any;

        return (
            <div className={ twMerge( 'w-full', className ) }>
                <DokanTextAreaComponent
                    { ...otherProps }
                    id={ id }
                    value={ value as string }
                    onChange={ handleChange }
                    disabled={ disabled }
                    readOnly={ readOnly }
                    helpText={ helperText }
                    errors={ errorMessages }
                    counter={ showCount || !! maxLength }
                    className={ twMerge(
                        'rounded w-full focus:!ring-0 focus:!outline-0',
                        disabled ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : ''
                    ) }
                    input={ {
                        rows,
                        maxLength,
                        placeholder,
                    } }
                    ref={ ref as any }
                />
            </div>
        );
    }
);

TextArea.displayName = 'TextArea';

export default TextArea;
