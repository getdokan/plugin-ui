import React from 'react';
import { twMerge } from 'tailwind-merge';
import type { ListItemProps } from '../../types';

/**
 * Reusable ListItem component that can be used in menus, selection lists, etc.
 */
const ListItem: React.FC< ListItemProps > = ( {
    primary,
    secondary,
    leadingElement,
    trailingElement,
    selected = false,
    disabled = false,
    onClick,
    className = '',
    variant = { size: 'md', layout: 'default' },
    showDivider = true,
    ...restProps
} ) => {
    // Merge variant with defaults
    const { size = 'md', layout = 'default' } = variant;

    // Calculate padding based on size
    const sizePadding = {
        sm: 'py-2 px-3',
        md: 'py-3 px-4',
        lg: 'py-4 px-5',
    }[ size ];

    // Calculate text sizes
    const textSizes = {
        sm: { primary: 'text-sm', secondary: 'text-xs' },
        md: { primary: 'text-base', secondary: 'text-sm' },
        lg: { primary: 'text-lg', secondary: 'text-base' },
    }[ size ];

    // Calculate layout-specific classes
    const layoutClasses = {
        default: '',
        compact: 'items-center',
        expanded: 'items-start',
    }[ layout ];

    // Combine classes for the container
    const containerClasses = twMerge(
        'flex w-full items-start hover:bg-gray-50 transition-colors duration-150',
        layoutClasses,
        sizePadding,
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        selected ? 'bg-indigo-50' : '',
        showDivider ? 'border-b border-gray-100 last:border-b-0' : '',
        className
    );

    // Handle click event
    const handleClick = () => {
        if ( ! disabled && onClick ) {
            onClick();
        }
    };

    // Handle keyboard events for accessibility
    const handleKeyDown = ( event: React.KeyboardEvent ) => {
        if (
            ! disabled &&
            onClick &&
            ( event.key === 'Enter' || event.key === ' ' )
        ) {
            event.preventDefault();
            onClick();
        }
    };

    return (
        <div
            className={ containerClasses }
            onClick={ handleClick }
            onKeyDown={ handleKeyDown }
            role={ onClick ? 'button' : undefined }
            tabIndex={ onClick && ! disabled ? 0 : undefined }
            { ...restProps }
        >
            { leadingElement && (
                <div className="flex-shrink-0">{ leadingElement }</div>
            ) }

            <div
                className={ twMerge(
                    'flex-grow',
                    leadingElement ? 'ml-3' : ''
                ) }
            >
                <div
                    className={ twMerge(
                        'text-gray-900 font-medium',
                        textSizes.primary
                    ) }
                >
                    { primary }
                </div>

                { secondary && (
                    <div
                        className={ twMerge(
                            'text-gray-500 mt-0.5',
                            textSizes.secondary
                        ) }
                    >
                        { secondary }
                    </div>
                ) }
            </div>

            { trailingElement && (
                <div className="flex-shrink-0 ml-auto">{ trailingElement }</div>
            ) }
        </div>
    );
};

export default ListItem;
