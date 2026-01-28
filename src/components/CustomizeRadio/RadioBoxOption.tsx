import { RawHTML } from '@wordpress/element';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import type { RadioOptionProps } from './SimpleRadioOption';

const RadioBoxOption = ( {
    option,
    isSelected,
    onSelect,
    disabled = false,
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
        ? 'border-primary'
        : 'border-gray-200 hover:border-gray-300';
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

    let radioStrokeClass = 'stroke-gray-200';
    if ( isSelected ) {
        radioStrokeClass = 'stroke-primary';
    } else if ( disabled ) {
        radioStrokeClass = 'stroke-gray-300';
    }

    const titleText = typeof option.title === 'string' ? option.title : '';

    return (
        <button
            type="button"
            className={ twMerge(
                'border rounded-md p-2 flex flex-col justify-between gap-3 items-start h-24 w-40 transition-colors cursor-pointer',
                borderClass,
                disabledClass,
                disabled && 'cursor-not-allowed'
            ) }
            onClick={ ! disabled ? onSelect : undefined }
            onKeyDown={ handleKeyDown }
            disabled={ disabled }
            role="radio"
            aria-checked={ isSelected }
            aria-label={ titleText }
        >
            <div className="flex items-center justify-between w-full">
                <div>
                    { option.icon ? (
                        <div className="max-w-20">
                            { typeof option.icon === 'string' ? (
                                <img
                                    src={ option.icon }
                                    alt={ titleText }
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                option.icon
                            ) }
                        </div>
                    ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    className="stroke-gray-500"
                                    strokeWidth="2"
                                    fill="none"
                                />
                            </svg>
                        </div>
                    ) }
                </div>
                <div className="flex items-center justify-center w-[18px] h-[18px]">
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 18 18"
                        fill="none"
                        aria-hidden="true"
                    >
                        <circle
                            cx="9"
                            cy="9"
                            r="8"
                            className={ radioStrokeClass }
                            strokeWidth="1"
                            fill="none"
                        />
                        { isSelected && (
                            <circle
                                cx="9"
                                cy="9"
                                r="4"
                                className="fill-primary"
                            />
                        ) }
                    </svg>
                </div>
            </div>
            <span className="text-sm font-semibold text-gray-900">
                { typeof option.title === 'string' ? (
                    <RawHTML>{ option.title }</RawHTML>
                ) : (
                    option.title
                ) }
            </span>
        </button>
    );
};

export default RadioBoxOption;
