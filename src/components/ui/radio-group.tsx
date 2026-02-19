import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { Field, FieldGroup, FieldLabel, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { CircleIcon } from "lucide-react"
import { RawHTML } from "@wordpress/element";

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
        "border-muted transition-colors has-data-checked:bg-transparent dark:has-data-checked:bg-transparent has-data-checked:border-primary", 
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

interface RadioImageCardProps extends LabeledRadioProps {
  currentValue: any;
  image: any;
}

function RadioImageCard({
  label,
  description,
  className,
  orientation = "horizontal",
  position = "left",
  disabled,
  currentValue = '',
  image = '',
  ...props
  }: RadioImageCardProps) {
  return (
    <FieldGroup className={cn(disabled && "opacity-50")}>
      <FieldLabel className={cn(
        "transition-colors has-data-checked:bg-transparent dark:has-data-checked:bg-transparent p-0 group cursor-pointer group",
        currentValue === props.value && 'border-primary!',
        !disabled && "hover:border-primary"
      )}>
        <Field
          orientation={orientation}
          data-disabled={disabled}
          className="flex flex-col p-0!"
          data-testid={`settings-field-${props.id}`}
        >
          <div className={cn( 'w-full flex flex-row items-center justify-between gap-3 border-b border-border group-hover:border-primary p-3', position === "right" && "flex-row-reverse", currentValue === props.value && 'border-primary!')}>
            <RadioGroupItem
              className={cn("disabled:opacity-100", className)}
              disabled={disabled}
              {...props}
            />
            <FieldTitle className="font-bold"><RawHTML>{label as any}</RawHTML></FieldTitle>
          </div>
          <FieldContent className={cn('p-3 flex items-center justify-center')} >
            <div className="flex flex-col items-start gap-3 w-full">
              {description && (
                <FieldDescription className="text-center">
                  {description}
                </FieldDescription>
              )}
              {image && (
                <img src={image} alt={typeof label === 'string' ? label : 'Option image'} className="w-full h-auto object-contain" />
              )}
            </div>
          </FieldContent>
        </Field>
      </FieldLabel>
    </FieldGroup>
  )
}

interface RadioIconCardProps extends LabeledRadioProps {
  currentValue: any;
  icon: any;
}

function RadioIconCard({
  label,
  description,
  className,
  orientation = "horizontal",
  position = "left",
  disabled,
  currentValue = '',
  icon = '',
  ...props
}: RadioIconCardProps) {
  return (
    <FieldGroup className={cn(disabled && "opacity-50")}>
      <FieldLabel className={cn(
        "transition-colors p-4 group cursor-pointer border rounded-xl border-border",
        "has-data-checked:border-primary",
        !disabled && "hover:border-primary"
      )}>
        <Field
          orientation={orientation}
          data-disabled={disabled}
          className="flex flex-col p-0! gap-4"
          data-testid={`settings-field-${props.id}`}
        >
          <div className="w-full flex flex-row items-center justify-between">
            {icon && (
               <div className="size-10 flex items-center justify-center rounded-lg overflow-hidden bg-muted/30">
                  {typeof icon === 'string' ? (
                    <img src={icon} alt="" className="size-full object-contain rounded-md" />
                  ) : (
                    icon
                  )}
               </div>
            )}
            <RadioGroupItem
              className={cn("disabled:opacity-100 ml-auto", className)}
              disabled={disabled}
              {...props}
            />
          </div>
          <div className="flex gap-1 w-full">
             <FieldTitle className="font-semibold text-sm text-foreground"><RawHTML>{label as any}</RawHTML></FieldTitle>
          </div>
        </Field>
      </FieldLabel>
    </FieldGroup>
  )
}

export { RadioGroup, RadioGroupItem, LabeledRadio, RadioCard, RadioImageCard, RadioIconCard }
export type { RadioGroupItemProps, LabeledRadioProps, RadioCardProps, RadioImageCardProps, RadioIconCardProps }
