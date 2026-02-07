import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { Field, FieldGroup, FieldLabel, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { CheckIcon, MinusIcon } from "lucide-react"


interface CheckboxProps extends CheckboxPrimitive.Root.Props {}

function Checkbox({ className, indeterminate, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      indeterminate={indeterminate}
      className={cn(
        "border-border data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-checked:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground data-indeterminate:border-primary aria-invalid:aria-checked:border-primary aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 flex size-4 items-center justify-center rounded border shadow-xs transition-shadow focus-visible:ring-3 aria-invalid:ring-3 peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="[&>svg]:size-3.5 grid place-content-center text-current transition-none"
      >
        {indeterminate ? <MinusIcon /> : <CheckIcon />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

type OrientationVariants = "horizontal" | "vertical" | "responsive";
type PositionVariants = "left" | "right";


interface LabeledCheckboxProps extends CheckboxProps {
  label: React.ReactNode;
  description?: React.ReactNode;
  orientation?: OrientationVariants;
  position?: PositionVariants;
}

function LabeledCheckbox({ 
  label, 
  description, 
  className,
  orientation = "horizontal",
  position = "left",
  disabled,
  ...props 
}: LabeledCheckboxProps) {
  return (
    <FieldGroup className={cn(disabled && "opacity-50")}>
      <Field 
        orientation={orientation} 
        data-disabled={disabled}
        className={cn(position === "right" && "flex-row-reverse")}
      >
        <Checkbox
          className={cn("disabled:opacity-100", className)}
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

interface CheckboxCardProps extends LabeledCheckboxProps {}

function CheckboxCard({ 
  label, 
  description, 
  className,
  orientation = "horizontal",
  position = "left",
  disabled,
  ...props 
}: CheckboxCardProps) {
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
          <Checkbox 
            className={cn("disabled:opacity-100", className)}
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

export { Checkbox, LabeledCheckbox, CheckboxCard }
export type { CheckboxProps, LabeledCheckboxProps, CheckboxCardProps }
