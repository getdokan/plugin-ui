import { forwardRef } from '@wordpress/element';
import { SimpleInput } from '@getdokan/dokan-ui';
import { twMerge } from 'tailwind-merge';
import type { TextFieldProps } from '../types';

/**
 * TextField Component
 *
 * A versatile text input component wrapper around Dokan UI SimpleInput.
 */
const TextField = forwardRef< HTMLInputElement, TextFieldProps >(
    (
        {
            id,
            value,
            onChange,
            placeholder,
            disabled = false,
            readOnly = false,
            className = '',
            type = 'text',
            prefix,
            suffix,
            maxLength,
            helperText,
            errors,
            showCharCount = false,
            actionsButtons,
            inputProps = {},
            status = 'default',
            ...otherProps
        },
        ref
    ) => {
        const handleChange = ( e: React.ChangeEvent< HTMLInputElement > ) => {
            onChange?.( e.target.value );
        };

        const errorMessages = typeof errors === 'string' ? [ errors ] : errors || [];
        const DokanSimpleInput = SimpleInput as any;

        return (
            <div className={ twMerge( 'flex flex-col gap-1', className ) }>
                <div className={ twMerge( 'flex items-center flex-1 gap-4 w-full' ) }>
                    <div className="flex-1">
                        <DokanSimpleInput
                            { ...otherProps }
                            id={ id }
                            value={ value as string }
                            onChange={ handleChange }
                            disabled={ disabled }
                            readOnly={ readOnly }
                            helpText={ helperText }
                            errors={ errorMessages }
                            counter={ showCharCount || !! maxLength }
                            className={ twMerge(
                                'rounded h-10 w-full focus:!ring-0 focus:!outline-0',
                                disabled ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : '',
                                inputProps.className || ''
                            ) }
                            input={ {
                                type,
                                maxLength,
                                placeholder,
                                ...inputProps,
                            } }
                            ref={ ref as any }
                            addOnLeft={ prefix || null }
                            addOnRight={ suffix || null }
                        />
                    </div>
                    { actionsButtons && (
                        <div className="flex items-center gap-2">
                            { actionsButtons }
                        </div>
                    ) }
                </div>
            </div>
        );
    }
);

TextField.displayName = 'TextField';

export default TextField;
