import { useState } from '@wordpress/element';
import { twMerge } from 'tailwind-merge';
import { LucideIcon, GoogleIcon } from './Icons';
import type { SocialButtonProps } from '../types';

/**
 * SocialButton Component
 *
 * A specialized button for social login/actions.
 */
const SocialButton = ( {
    network = 'google',
    label,
    onClick,
    className = '',
    disabled = false,
}: SocialButtonProps ) => {
    const [ hovered, setHovered ] = useState( false );

    const getNetworkConfig = ( net: string, isHovered: boolean ) => {
        switch ( net ) {
            case 'google':
                return {
                    icon: <GoogleIcon />,
                    border: isHovered ? 'border-[#7047eb]' : 'border-[#e9e9e9]',
                    text: 'Sign in with Google',
                    textColor: isHovered ? 'text-[#7047eb]' : 'text-black',
                    bg: 'bg-white',
                };
            case 'facebook':
                return {
                    icon: <LucideIcon iconName="Facebook" className="text-[#1877F2]" />,
                    border: isHovered ? 'border-[#1877F2]' : 'border-[#e9e9e9]',
                    text: 'Sign in with Facebook',
                    textColor: isHovered ? 'text-[#1877F2]' : 'text-black',
                    bg: 'bg-white',
                };
            case 'twitter':
                return {
                    icon: <LucideIcon iconName="Twitter" className="text-[#1DA1F2]" />,
                    border: isHovered ? 'border-[#1DA1F2]' : 'border-[#e9e9e9]',
                    text: 'Sign in with Twitter',
                    textColor: isHovered ? 'text-[#1DA1F2]' : 'text-black',
                    bg: 'bg-white',
                };
            default:
                return {
                    icon: <LucideIcon iconName="Share2" />,
                    border: 'border-[#e9e9e9]',
                    text: '',
                    textColor: 'text-black',
                    bg: 'bg-white',
                };
        }
    };

    const config = getNetworkConfig( network, hovered );

    return (
        <button
            type="button"
            onClick={ onClick }
            disabled={ disabled }
            className={ twMerge(
                'flex flex-row min-w-[180px] max-w-full items-center p-0 rounded-[5px] overflow-hidden font-medium text-[14px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
                config.bg,
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                className
            ) }
            onMouseEnter={ () => setHovered( true ) }
            onMouseLeave={ () => setHovered( false ) }
        >
            { /* Left icon section */ }
            <div
                className={ twMerge(
                    'h-10 w-[49px] flex items-center justify-center border bg-white rounded-l-[5px]',
                    config.border
                ) }
            >
                { config.icon }
            </div>
            { /* Right label section */ }
            <div
                className={ twMerge(
                    'h-10 flex-1 flex items-center justify-center px-4 border border-l-0 bg-white rounded-r-[5px]',
                    config.border
                ) }
            >
                <span className={ twMerge( 'whitespace-nowrap transition-colors duration-200', config.textColor ) }>
                    { label || config.text }
                </span>
            </div>
        </button>
    );
};

export default SocialButton;
