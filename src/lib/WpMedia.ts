export type TSize = {
    height: number;
    width: number;
    orientation: string;
    url: string;
};

export interface IWpMedia {
    alt: string;
    author: string;
    authorLink: string;
    authorName: string;
    caption: string;
    compat: { item: string; meta: string };
    context: string;
    date: Record< string, object >;
    dateFormatted: string;
    description: string;
    editLink: string;
    filename: string;
    filesizeHumanReadable: string;
    filesizeInBytes: number;
    height: number;
    icon: string;
    id: number;
    link: string;
    menuOrder: number;
    meta: boolean;
    mime: string;
    modified: Record< string, object >;
    name: string;
    nonces: { update: string; delete: string; edit: string };
    orientation: string;
    sizes: {
        full: TSize;
        medium: TSize;
        thumbnail: TSize;
    };
    status: string;
    subtype: string;
    title: string;
    type: string;
    uploadedTo: number;
    uploading: boolean;
    url: string;
    width: number;
}
export type IWpMediaData = Array< IWpMedia >;

export default function wpMedia(
    callback: ( media: IWpMediaData ) => void,
    media?: null
) {
    let fileFrame = null;

    if ( fileFrame ) {
        fileFrame.open();
        return;
    }

    const mediaOptions = {
        title: 'Select',
        button: {
            text: 'Select',
            close: false,
        },
        multiple: false,
    };

    // @ts-expect-error wp.media is not defined in the global scope
    fileFrame = media ? media : wp.media( mediaOptions );

    fileFrame.on( 'select', () => {
        const selection = fileFrame.state().get( 'selection' );

        const files = selection.map( ( attachment ) => {
            return attachment.toJSON();
        } );

        const file = files.pop();

        callback( file );
        console.log(fileFrame);
        fileFrame = null;
    } );

    fileFrame.on( 'close', () => {
        fileFrame = null;
    } );

    fileFrame.open();
}
