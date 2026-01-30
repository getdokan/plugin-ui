import React, {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../utils/classnames";

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  /**
   * Whether switch is checked
   */
  checked?: boolean;

  /**
   * Default checked state (uncontrolled)
   */
  defaultChecked?: boolean;

  /**
   * Change handler
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Native onChange handler
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Label for the switch
   */
  label?: ReactNode;

  /**
   * Description below the switch
   */
  description?: ReactNode;

  /**
   * Additional CSS classes for the switch track
   */
  className?: string;

  /**
   * Additional CSS classes for the container
   */
  containerClassName?: string;
}

/**
 * Switch component following ShadCN pattern
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Switch checked={enabled} onCheckedChange={setEnabled} />
 *
 * // With label
 * <Switch
 *   label="Enable notifications"
 *   checked={notifications}
 *   onCheckedChange={setNotifications}
 * />
 *
 * // With description
 * <Switch
 *   label="Marketing emails"
 *   description="Receive emails about new products and features"
 *   checked={marketing}
 *   onCheckedChange={setMarketing}
 * />
 * ```
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      containerClassName,
      checked,
      defaultChecked,
      onCheckedChange,
      onChange,
      label,
      description,
      disabled,
      id: providedId,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      onCheckedChange?.(event.target.checked);
    };

    const switchElement = (
      <label
        htmlFor={id}
        className={cn(
          "peer relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full",
          "border-2 border-transparent shadow-sm transition-colors",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "has-[:checked]:bg-primary bg-input",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          id={id}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
          {...props}
        />
        <span
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
            "translate-x-0",
            "[input:checked~&]:translate-x-4",
          )}
        />
      </label>
    );

    if (!label && !description) {
      return switchElement;
    }

    return (
      <div className={cn("flex items-start gap-3", containerClassName)}>
        {switchElement}
        {(label || description) && (
          <div className="flex flex-col gap-0.5">
            {label && (
              <label
                htmlFor={id}
                className={cn(
                  "text-sm font-medium leading-none cursor-pointer",
                  disabled && "cursor-not-allowed opacity-70",
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;
