import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { useState } from 'react';
import { WpMediaUpload, WpMediaUploadMultiple } from './WpMediaUpload';

// ── Mock wp.media for Storybook (not available outside WordPress) ─────────────

const SAMPLE_IMAGE = 'https://placehold.co/400x400/e2e8f0/475569?text=Logo';
const SAMPLE_IMAGES = [
    'https://placehold.co/400x400/e2e8f0/475569?text=Image+1',
    'https://placehold.co/400x400/dbeafe/1d4ed8?text=Image+2',
    'https://placehold.co/400x400/dcfce7/15803d?text=Image+3',
];

function mockWpMedia( multiple = false ) {
    ( window as any ).wp = {
        media: ( _options: object ) => {
            let selectCb: (() => void) | null = null;
            const urls = multiple ? SAMPLE_IMAGES.slice( 0, 2 ) : [ SAMPLE_IMAGE ];
            return {
                on: ( event: string, cb: () => void ) => {
                    if ( event === 'select' ) selectCb = cb;
                },
                once: ( event: string, cb: () => void ) => {
                    if ( event === 'select' ) selectCb = cb;
                },
                open: () => {
                    // Simulate async media selection
                    setTimeout( () => selectCb?.(), 300 );
                },
                state: () => ( {
                    get: ( key: string ) => {
                        if ( key !== 'selection' ) return null;
                        if ( multiple ) {
                            const items = urls.map( ( url ) => ( { toJSON: () => ( { url } ) } ) );
                            return {
                                map: ( fn: ( a: any ) => any ) => items.map( fn ),
                                each: ( fn: ( a: any ) => void ) => items.forEach( fn ),
                                pop: () => items.pop(),
                            };
                        }
                        const item = { toJSON: () => ( { url: urls[0] } ) };
                        return {
                            map: ( fn: ( a: any ) => any ) => [ item ].map( fn ),
                            each: ( fn: ( a: any ) => void ) => [ item ].forEach( fn ),
                            first: () => item,
                            pop: () => item.toJSON(),
                        };
                    },
                } ),
            };
        },
    };
}

// ── Single ────────────────────────────────────────────────────────────────────

const SingleMeta = {
    title: 'WordPress/WpMediaUpload',
    component: WpMediaUpload,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    args: {
        onChange: fn(),
    },
    argTypes: {
        value: { control: 'text' },
        btnText: { control: 'text' },
        disabled: { control: 'boolean' },
    },
    decorators: [
        ( Story: any ) => {
            mockWpMedia( false );
            return <Story />;
        },
    ],
} satisfies Meta<typeof WpMediaUpload>;

export default SingleMeta;

type SingleStory = StoryObj<typeof SingleMeta>;

export const Empty: SingleStory = {
    args: {
        btnText: 'Upload Logo',
    },
};

export const WithPreview: SingleStory = {
    args: {
        value: SAMPLE_IMAGE,
        btnText: 'Upload Logo',
    },
};

export const Disabled: SingleStory = {
    args: {
        value: SAMPLE_IMAGE,
        btnText: 'Upload Logo',
        disabled: true,
    },
};

/** Interactive — click "Upload Image" to simulate a media library selection. */
function InteractiveRender( args: React.ComponentProps<typeof WpMediaUpload> ) {
    const [ value, setValue ] = useState( args.value ?? '' );
    return <WpMediaUpload { ...args } value={ value } onChange={ setValue } />;
}

export const Interactive: SingleStory = {
    render: ( args ) => <InteractiveRender { ...args } />,
    args: {},
};

// ── Multiple ──────────────────────────────────────────────────────────────────

function MultipleRender( { initial = [] }: { initial?: string[] } ) {
    const [ values, setValues ] = useState<string[]>( initial );
    mockWpMedia( true );
    return (
        <WpMediaUploadMultiple
            value={ values }
            onChange={ setValues }
            btnText="Add Images"
        />
    );
}

export const Multiple: StoryObj<typeof WpMediaUploadMultiple> = {
    render: () => <MultipleRender />,
};

export const MultipleWithExisting: StoryObj<typeof WpMediaUploadMultiple> = {
    render: () => <MultipleRender initial={ SAMPLE_IMAGES } />,
};
