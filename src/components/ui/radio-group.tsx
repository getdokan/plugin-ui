import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { Field, FieldGroup, FieldLabel, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { CircleIcon } from "lucide-react"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid gap-3 w-full", className)}
      {...props}
    />
  )
}

interface RadioGroupItemProps extends RadioPrimitive.Root.Props {}

function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
  return (
    <RadioPrimitive.Root
      data-slot="radio"
      className={cn(
        "border-border data-checked:border-primary dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 flex items-center justify-center size-4.5 rounded-full shadow-xs transition-shadow focus-visible:ring-3 aria-invalid:ring-3 peer relative aspect-square shrink-0 border outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-indicator"
        className="text-primary flex items-center justify-center"
      >
        <CircleIcon className="size-2.5 fill-current" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

type OrientationVariants = "horizontal" | "vertical" | "responsive";
type PositionVariants = "left" | "right";

interface LabeledRadioProps extends RadioGroupItemProps {
  label: React.ReactNode;
  description?: React.ReactNode;
  orientation?: OrientationVariants;
  position?: PositionVariants;
}

function LabeledRadio({ 
  label, 
  description, 
  className,
  orientation = "horizontal",
  position = "left",
  disabled,
  ...props 
}: LabeledRadioProps) {
  return (
    <FieldGroup className={cn(disabled && "opacity-50")}>
      <Field 
        orientation={orientation} 
        data-disabled={disabled}
        className={cn(position === "right" && "flex-row-reverse")}
      >
        <RadioGroupItem
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

interface RadioCardProps extends LabeledRadioProps {}

function RadioCard({ 
  label, 
  description, 
  className,
  orientation = "horizontal",
  position = "left",
  disabled,
  ...props 
}: RadioCardProps) {
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
          <RadioGroupItem 
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

export { RadioGroup, RadioGroupItem, LabeledRadio, RadioCard }
export type { RadioGroupItemProps, LabeledRadioProps, RadioCardProps }
