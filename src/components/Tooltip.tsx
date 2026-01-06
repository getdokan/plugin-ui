import { Tooltip as TooltipUI } from '@getdokan/dokan-ui';
import { TooltipProps as TooltipUIProps } from '@getdokan/dokan-ui/dist/components/Tooltip';
import { Info } from 'lucide-react';

export interface TooltipProps extends Partial< TooltipUIProps > {
    children?: React.ReactNode;
}

const Tooltip = ( { children, ...props }: TooltipProps ) => {
    return (
        <TooltipUI
            { ...props }
            contentClass="dokan-layout"
            content={
                <div className="z-50 select-none rounded-[5px] max-w-[285px] bg-black px-3.5 py-1.5 text-xs text-white break-words">
                    { props?.content }
                </div>
            }
        >
            { children || (
                <span className="flex items-center cursor-help text-gray-400 hover:text-gray-600 transition-colors">
                    <Info size="1rem" />
                </span>
            ) }
        </TooltipUI>
    );
};

export default Tooltip;
