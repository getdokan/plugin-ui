import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { Field, FieldGroup, FieldLabel, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field"
import { cn } from "@/lib/utils"

interface SwitchProps extends SwitchPrimitive.Root.Props {
  size?: "sm" | "default"
}

function Switch({
  className,
  size = "default",
  ...props
}: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "data-checked:bg-primary data-unchecked:bg-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 dark:data-unchecked:bg-input/80 shrink-0 rounded-full border border-transparent shadow-xs focus-visible:ring-3 aria-invalid:ring-3 data-[size=default]:h-[18.4px] data-[size=default]:w-7.5 data-[size=sm]:h-3.5 data-[size=sm]:w-6 peer group/switch relative inline-flex items-center transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="bg-background dark:data-unchecked:bg-foreground dark:data-checked:bg-primary-foreground rounded-full group-data-[size=default]/switch:size-3.5 group-data-[size=sm]/switch:size-2.5 ml-0.5 group-data-[size=default]/switch:data-checked:ml-3 group-data-[size=sm]/switch:data-checked:ml-2.5 rtl:mr-0.5 rtl:ml-0 rtl:group-data-[size=default]/switch:data-checked:mr-3.5 rtl:group-data-[size=sm]/switch:data-checked:mr-2.5 rtl:group-data-[size=default]/switch:data-checked:ml-0 rtl:group-data-[size=sm]/switch:data-checked:ml-0 pointer-events-none flex ring-0 transition-[margin] duration-200 ease-in-out"
      />
    </SwitchPrimitive.Root>
  )
}

type OrientationVariants = "horizontal" | "vertical" | "responsive";
type PositionVariants = "left" | "right";

interface LabeledSwitchProps extends SwitchProps {
  label: React.ReactNode;
  description?: React.ReactNode;
  orientation?: OrientationVariants;
  position?: PositionVariants;
}

function LabeledSwitch({ 
  label, 
  description, 
  className,
  orientation = "horizontal",
  position = "left",
  disabled,
  ...props 
}: LabeledSwitchProps) {
  return (
    <FieldGroup className={cn(disabled && "opacity-50")}>
      <Field 
        orientation={orientation} 
        data-disabled={disabled}
        className={cn(position === "right" && "flex-row-reverse")}
      >
        <Switch
          className={cn("data-disabled:opacity-100", className)}
          disabled={disabled}
          {...props}
        />
        <FieldContent>
          <FieldLabel htmlFor={props.id}>
            {label}
          </FieldLabel>
          {description && (
            <FieldDescription>
              {description}
            </FieldDescription>
          )}
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}

interface SwitchCardProps extends LabeledSwitchProps {}

function SwitchCard({ 
  label, 
  description, 
  className,
  orientation = "horizontal",
  position = "left",
  disabled,
  ...props 
}: SwitchCardProps) {
  return (
    <FieldGroup className={cn(disabled && "opacity-50")}>
      <FieldLabel className={cn(
        "transition-colors has-data-checked:bg-transparent dark:has-data-checked:bg-transparent has-data-checked:border-primary", 
        !disabled && "hover:border-primary"
      )}>
        <Field 
          orientation={orientation} 
          data-disabled={disabled}
          className={cn(position === "right" && "flex-row-reverse")}
        >
          <Switch 
            className={cn("data-disabled:opacity-100", className)}
            disabled={disabled}
            {...props} 
          />
          <FieldContent>
            <FieldTitle>{label}</FieldTitle>
            {description && (
              <FieldDescription>
                {description}
              </FieldDescription>
            )}
          </FieldContent>
        </Field>
      </FieldLabel>
    </FieldGroup>
  )
}

export { Switch, LabeledSwitch, SwitchCard }
export type { SwitchProps, LabeledSwitchProps, SwitchCardProps }
