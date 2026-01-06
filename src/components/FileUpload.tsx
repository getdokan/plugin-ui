import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { twMerge } from 'tailwind-merge';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import TextField from './TextField';
import type { FileUploadProps } from '../types';

/**
 * FileUpload Component
 *
 * A file upload using WordPress media library, styled like Dokan Lite.
 */
const FileUpload = ( {
    id,
    value,
    onChange,
    onUrlImport,
    onSelect,
    disabled = false,
    className = '',
    allowedTypes = [ 'image' ],
    buttonText,
    placeholder,
}: FileUploadProps ) => {
    const handleSelect = useCallback(
        ( media: any ) => {
            if ( media && media.url ) {
                onChange?.( media.url );
                onSelect?.( media );
                onUrlImport?.( media.url );
            }
        },
        [ onChange, onSelect, onUrlImport ]
    );

    const renderChooseButton = ( open: () => void ) => {
        return (
            <button
                type="button"
                onClick={ open }
                disabled={ disabled }
                className={ twMerge(
                    'bg-white min-w-[120px] border border-gray-300 rounded px-4 h-10 flex items-center justify-center font-semibold text-[13px] text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500',
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                ) }
            >
                { buttonText || __( '+ Choose File', 'wedevs-plugin-ui' ) }
            </button>
        );
    };

    return (
        <div className={ twMerge( 'w-full', className ) }>
            <MediaUploadCheck>
                <MediaUpload
                    onSelect={ handleSelect }
                    allowedTypes={ allowedTypes }
                    value={ value as string }
                    render={ ( { open } ) => (
                        <TextField
                            id={ id }
                            value={ value as string }
                            placeholder={ placeholder || __( 'No file selected', 'wedevs-plugin-ui' ) }
                            readOnly
                            disabled={ true }
                            className="text-gray-500 bg-gray-100"
                            actionsButtons={ renderChooseButton( open ) }
                        />
                    ) }
                />
            </MediaUploadCheck>
        </div>
    );
};

export default FileUpload;

