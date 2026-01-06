import React from 'react';
import { RawHTML } from '@wordpress/element';
import { twMerge } from 'tailwind-merge';
import RadioButton from './RadioButton';
import type { RadioOptionProps } from './SimpleRadioOption';

const CardRadioOption = ( {
    option,
    isSelected,
    onSelect,
    disabled = false,
    name,
    divider = true,
}: RadioOptionProps ) => {
    const handleKeyDown = ( event: React.KeyboardEvent ) => {
        if ( event.key === 'Enter' || event.key === ' ' ) {
            event.preventDefault();
            if ( ! disabled ) {
                onSelect();
            }
        }
    };

    const borderClass = isSelected
        ? 'border-[#7047EB] bg-white'
        : 'border-[#D3D3D3] bg-white hover:border-gray-300';
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <div
            className={ twMerge(
                'relative border rounded-[4px] cursor-pointer transition-colors overflow-hidden',
                borderClass,
                disabledClass
            ) }
            onClick={ ! disabled ? onSelect : undefined }
            onKeyDown={ handleKeyDown }
            role="radio"
            aria-checked={ isSelected }
            tabIndex={ 0 }
        >
            <div
                className={ twMerge(
                    'flex items-center gap-2.5 p-[14px]',
                    divider && 'border-b border-[#E9E9E9] justify-between',
                    ! divider && 'flex-row-reverse justify-end'
                ) }
            >
                <div className="flex flex-col">
                    <span className="font-semibold text-[14px] text-[#25252D]">
                        { typeof option.title === 'string' ? (
                            <RawHTML>{ option.title }</RawHTML>
                        ) : (
                            option.title
                        ) }
                    </span>
                    { option.description && (
                        <div className="text-xs text-[#6B7280] mt-1">
                            { typeof option.description === 'string' ? (
                                <RawHTML>{ option.description }</RawHTML>
                            ) : (
                                option.description
                            ) }
                        </div>
                    ) }
                </div>
                <RadioButton checked={ isSelected } disabled={ disabled } />
            </div>

            { option.image && (
                <div className={ twMerge( 'p-4', ! divider && 'pt-0' ) }>
                    <img
                        src={ option.image }
                        alt={ typeof option.title === 'string' ? option.title : '' }
                        className="w-full h-auto"
                    />
                </div>
            ) }

            <input
                type="radio"
                name={ name }
                value={ option.value }
                checked={ isSelected }
                onChange={ onSelect }
                className="sr-only"
                disabled={ disabled }
            />
        </div>
    );
};

export default CardRadioOption;
