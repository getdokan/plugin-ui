import { ToggleSwitch } from '@getdokan/dokan-ui';
import { twMerge } from 'tailwind-merge';
import type { SwitchProps } from '../types';

/**
 * Switch Component
 *
 * A toggle switch input wrapper around Dokan UI ToggleSwitch.
 */
const Switch = ( {
    id,
    checked = false,
    onChange,
    label,
    disabled = false,
    className = '',
    containerClassName = '',
    color = 'primary',
    helpText,
}: SwitchProps ) => {
    const DokanToggleSwitch = ToggleSwitch as any;

    return (
        <div className={ twMerge( 'inline-flex flex-col gap-1', containerClassName ) }>
            <DokanToggleSwitch
                id={ id }
                checked={ checked }
                onChange={ onChange }
                disabled={ disabled }
                label={ label }
                color={ color }
                helpText={ helpText }
                className={ className }
            />
        </div>
    );
};

export default Switch;

