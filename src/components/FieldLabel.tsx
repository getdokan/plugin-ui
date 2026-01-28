import { RawHTML } from '@wordpress/element';
import { twMerge } from 'tailwind-merge';
import Tooltip from './Tooltip';
import type { FieldLabelProps } from '../types';

/**
 * FieldLabel Component
 *
 * A label with optional description, tooltip, and suffix.
 * @param root0
 * @param root0.title
 * @param root0.description
 * @param root0.tooltip
 * @param root0.suffix
 * @param root0.imageUrl
 * @param root0.htmlFor
 * @param root0.isBold
 * @param root0.titleFontWeight
 * @param root0.className
 * @param root0.labelClassName
 */
const FieldLabel = ( {
    title,
    description,
    tooltip,
    suffix,
    imageUrl,
    htmlFor,
    isBold = true,
    titleFontWeight,
    className = '',
    labelClassName = '',
}: FieldLabelProps ) => {
    if ( ! title && ! description ) {
        return null;
    }

    const getFontWeightClass = () => {
        if ( titleFontWeight ) {
            switch ( titleFontWeight ) {
                case 'light':
                    return 'font-light';
                case 'normal':
                    return 'font-normal';
                case 'semibold':
                    return 'font-semibold';
                case 'bold':
                    return 'font-bold';
            }
        }
        return isBold ? 'font-semibold' : 'font-normal';
    };

    const renderText = (
        contentText: string | React.ReactNode,
        wrapperClass: string
    ) => {
        if ( ! contentText ) {
            return null;
        }
        return (
            <div className={ wrapperClass }>
                <RawHTML>{ contentText.toString() }</RawHTML>
            </div>
        );
    };

    return (
        <div
            className={ twMerge(
                'flex items-start gap-4 max-w-xl',
                className
            ) }
        >
            { imageUrl && (
                <img
                    src={ imageUrl }
                    alt=""
                    className="max-w-20 rounded-md border border-gray-200"
                />
            ) }
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    { title && (
                        <label
                            htmlFor={ htmlFor }
                            className={ twMerge(
                                'text-sm text-gray-900',
                                getFontWeightClass(),
                                labelClassName
                            ) }
                        >
                            { typeof title === 'string' ? (
                                <RawHTML>{ title }</RawHTML>
                            ) : (
                                title
                            ) }
                        </label>
                    ) }
                    { tooltip && <Tooltip content={ tooltip } /> }
                    { suffix && (
                        <span className="text-sm text-gray-500">
                            { suffix }
                        </span>
                    ) }
                </div>
                { renderText(
                    ( description || '' ).toString(),
                    'text-xs text-gray-500 font-light'
                ) }
            </div>
        </div>
    );
};

export default FieldLabel;
