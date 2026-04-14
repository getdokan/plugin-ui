import React from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import wpMedia from '@/lib/WpMedia';

// ─── Single ───────────────────────────────────────────────────────────────────

export interface WpMediaUploadProps {
    value?: string;
    onChange: ( url: string ) => void;
    btnText?: string;
    className?: string;
    disabled?: boolean;
}

export function WpMediaUpload( {
    value,
    onChange,
    btnText = 'Upload Image',
    className,
    disabled,
}: WpMediaUploadProps ) {
    const handleUpload = () => {
        wpMedia( ( file ) => {
            const url = Array.isArray( file ) ? ( file[0]?.url ?? '' ) : ( file as { url: string } ).url;
            onChange( url );
        } );
    };

    return (
        <div className={ cn( 'flex flex-col items-end gap-2', className ) }>
            { value && (
                <div className="relative inline-flex">
                    <img
                        src={ value }
                        alt=""
                        className="h-16 w-16 rounded-md border border-border bg-muted object-contain p-1"
                    />
                    <button
                        type="button"
                        disabled={ disabled }
                        title="Remove"
                        onClick={ () => onChange( '' ) }
                        className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={ 10 } strokeWidth={ 3 } />
                    </button>
                </div>
            ) }
            <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={ disabled }
                onClick={ handleUpload }
                className="gap-1.5"
            >
                <Upload size={ 14 } />
                { value ? 'Change' : btnText }
            </Button>
        </div>
    );
}

// ─── Multiple ─────────────────────────────────────────────────────────────────

export interface WpMediaUploadMultipleProps {
    value?: string[];
    onChange: ( urls: string[] ) => void;
    btnText?: string;
    className?: string;
    disabled?: boolean;
}

export function WpMediaUploadMultiple( {
    value = [],
    onChange,
    btnText = 'Add Images',
    className,
    disabled,
}: WpMediaUploadMultipleProps ) {
    const handleUpload = () => {
        // @ts-expect-error wp.media is not defined in the global scope
        const frame = wp.media( {
            title: 'Select Images',
            button: { text: 'Add' },
            multiple: true,
        } );

        frame.once( 'select', () => {
            const selection = frame.state().get( 'selection' );
            const newUrls: string[] = [];
            selection.each( ( attachment: { toJSON: () => { url: string } } ) => {
                newUrls.push( attachment.toJSON().url );
            } );
            onChange( [ ...value, ...newUrls ] );
        } );

        frame.open();
    };

    const remove = ( index: number ) => {
        onChange( value.filter( ( _, i ) => i !== index ) );
    };

    return (
        <div className={ cn( 'flex flex-col items-end gap-2', className ) }>
            { value.length > 0 && (
                <div className="flex flex-wrap justify-end gap-2">
                    { value.map( ( url, i ) => (
                        <div key={ i } className="relative inline-flex">
                            <img
                                src={ url }
                                alt=""
                                className="h-14 w-14 rounded-md border border-border bg-muted object-contain p-1"
                            />
                            <button
                                type="button"
                                disabled={ disabled }
                                title="Remove"
                                onClick={ () => remove( i ) }
                                className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <X size={ 10 } strokeWidth={ 3 } />
                            </button>
                        </div>
                    ) ) }
                </div>
            ) }
            <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={ disabled }
                onClick={ handleUpload }
                className="gap-1.5"
            >
                <Upload size={ 14 } />
                { btnText }
            </Button>
        </div>
    );
}
