import { TimePicker as WPTimePicker } from '@wordpress/components';
import { twMerge } from 'tailwind-merge';
import type { TimePickerProps } from '../types';

/**
 * TimePicker Component
 *
 * A time selection input wrapper around WordPress TimePicker.TimeInput.
 */
const TimePicker = ( {
    containerClassName,
    value,
    onChange,
    is12Hour = true,
    label,
    className = '',
    ...props
}: TimePickerProps ) => {
    // Check if TimeInput exists, it was added in newer versions of @wordpress/components
    const TimeInput = ( WPTimePicker as any ).TimeInput || ( WPTimePicker as any );

    return (
        <div
            className={ twMerge(
                'inline-flex flex-col items-start gap-2',
                containerClassName
            ) }
        >
            <TimeInput
                value={ value }
                onChange={ onChange }
                is12Hour={ is12Hour }
                label={ label }
                className={ className }
                { ...props }
            />
        </div>
    );
};

export default TimePicker;

