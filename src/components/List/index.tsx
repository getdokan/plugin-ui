import React, { Fragment, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import ListItem from './ListItem';
import type { ListProps } from '../../types';

/**
 * List component that renders a collection of ListItem components
 */
const List: React.FC< ListProps > = ( {
    items = [],
    className = '',
    title,
    description,
    showDividers = true,
    bordered = false,
    rounded = true,
    bgColor = 'bg-white',
    maxHeight,
    headerElement,
    footerElement,
    loading = false,
    emptyMessage = 'No items to display',
    onSelect,
    selectedId,
    itemKey = 'id',
    multiSelect = false,
    selectedIds = [],
    listWrapperClasses = '',
} ) => {
    // Generate container classes
    const containerClasses = twMerge(
        bgColor,
        bordered ? 'border border-gray-200' : '',
        rounded ? 'rounded-lg' : '',
        'overflow-hidden',
        className
    );

    // Generate list classes
    const listClasses = twMerge(
        'w-full overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent',
        listWrapperClasses
    );

    // Keyboard navigation state and refs
    const [ focusedIndex, setFocusedIndex ] = useState< number | null >( null );
    const itemRefs = useRef< ( HTMLDivElement | null )[] >( [] );

    useEffect( () => {
        if ( focusedIndex !== null && itemRefs.current[ focusedIndex ] ) {
            itemRefs.current[ focusedIndex ]?.focus();
        }
    }, [ focusedIndex ] );

    // Render loading state
    if ( loading ) {
        return (
            <div className={ containerClasses }>
                { title && (
                    <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">{ title }</h3>
                        { description && (
                            <p className="text-sm text-gray-500 mt-0.5">
                                { description }
                            </p>
                        ) }
                    </div>
                ) }
                <div className="p-4 flex items-center justify-center">
                    <div className="animate-pulse flex space-x-4 w-full">
                        <div className="flex-1 space-y-4 py-1">
                            { [ 1, 2, 3 ].map( ( i ) => (
                                <div
                                    key={ i }
                                    className="h-12 bg-gray-100 rounded w-full"
                                ></div>
                            ) ) }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Render empty state
    if ( items.length === 0 ) {
        return (
            <div className={ containerClasses }>
                { title && (
                    <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">{ title }</h3>
                        { description && (
                            <p className="text-sm text-gray-500 mt-0.5">
                                { description }
                            </p>
                        ) }
                    </div>
                ) }
                <div className="p-8 flex flex-col items-center justify-center text-center text-gray-500">
                    { typeof emptyMessage === 'string' ? (
                        <p className="text-sm italic">{ emptyMessage }</p>
                    ) : (
                        emptyMessage
                    ) }
                </div>
            </div>
        );
    }

    return (
        <div className={ twMerge( 'shadow-sm', containerClasses ) }>
            { /* List header */ }
            { ( title || headerElement ) && (
                <div className="px-4 py-3 border-b border-gray-100">
                    { headerElement || (
                        <Fragment>
                            { title && (
                                <h3 className="font-semibold text-gray-900">
                                    { title }
                                </h3>
                            ) }
                            { description && (
                                <p className="text-sm text-gray-500 mt-0.5">
                                    { description }
                                </p>
                            ) }
                        </Fragment>
                    ) }
                </div>
            ) }

            { /* List items */ }
            <div
                className={ listClasses }
                style={ maxHeight ? { maxHeight } : undefined }
            >
                { items.map( ( item, index ) => {
                    const itemId = item[ itemKey as keyof typeof item ];
                    const isSelected = multiSelect
                        ? selectedIds.includes( itemId )
                        : selectedId === itemId;

                    return (
                        <ListItem
                            key={ itemId || index }
                            { ...item }
                            selected={ item.selected || isSelected }
                            showDivider={
                                index < items.length - 1 && showDividers
                            }
                            onClick={ () => {
                                if ( item.onClick ) {
                                    item.onClick();
                                } else if ( onSelect ) {
                                    onSelect( item, index );
                                }
                            } }
                        />
                    );
                } ) }
            </div>

            { /* List footer */ }
            { footerElement && (
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                    { footerElement }
                </div>
            ) }
        </div>
    );
};

export default List;
