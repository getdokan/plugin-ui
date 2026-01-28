import { RawHTML } from '@wordpress/element';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import type { RadioOption } from '../../types';
import RadioButton from './RadioButton';

export interface RadioOptionProps {
    option: RadioOption;
    isSelected: boolean;
    onSelect: () => void;
    disabled?: boolean;
    name?: string;
    divider?: boolean;
}

const SimpleRadioOption: React.FC< RadioOptionProps > = ( {
    option,
    isSelected,
    onSelect,
    disabled = false,
} ) => {
    const handleKeyDown = ( event: React.KeyboardEvent ) => {
        if ( event.key === 'Enter' || event.key === ' ' ) {
            event.preventDefault();
            if ( ! disabled ) {
                onSelect();
            }
        }
    };

    const borderClass = isSelected
        ? 'border-primary bg-white'
        : 'border-gray-200 bg-white hover:border-gray-300';
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

    const titleText = typeof option.title === 'string' ? option.title : '';

    return (
        <div
            className={ twMerge(
                'relative border rounded-md p-3.5 transition-colors',
                borderClass,
                disabledClass,
                disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            ) }
            onClick={ ! disabled ? onSelect : undefined }
            onKeyDown={ handleKeyDown }
            role="radio"
            aria-checked={ isSelected }
            aria-label={ titleText }
            tabIndex={ disabled ? -1 : 0 }
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-900 leading-snug mb-1">
                        { typeof option.title === 'string' ? (
                            <RawHTML>{ option.title }</RawHTML>
                        ) : (
                            option.title
                        ) }
                    </h3>
                    { option.description && (
                        <div className="font-normal text-xs text-gray-600 leading-relaxed">
                            { typeof option.description === 'string' ? (
                                <RawHTML>{ option.description }</RawHTML>
                            ) : (
                                option.description
                            ) }
                        </div>
                    ) }
                </div>
                <div className="ml-4 flex-shrink-0">
                    <RadioButton checked={ isSelected } disabled={ disabled } />
                </div>
            </div>
        </div>
    );
};

export default SimpleRadioOption;
