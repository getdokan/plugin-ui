import { twMerge } from 'tailwind-merge';

export type LinkProps = React.AnchorHTMLAttributes< HTMLAnchorElement > & {
    children?: React.ReactNode;
    className?: string;
    href: string;
    as?: React.ElementType;
};

// A single Link component that handles all variants
export const Link = ( {
    children,
    className = '',
    href,
    as: Component = 'a', // Default to 'a' tag
    ...props
}: LinkProps ) => {
    return (
        <Component
            href={ Component === 'a' ? href : undefined }
            className={ twMerge( '!dokan-link', className ) }
            { ...props }
        >
            { children }
        </Component>
    );
};

export default Link;
