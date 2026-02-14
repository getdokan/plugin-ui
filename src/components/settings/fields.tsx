import { cn } from "@/lib/utils";
import { FileText, Info } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { RadioCard, RadioGroup } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import type { FieldComponentProps, SettingsElement } from "./settings-types";

// ============================================
// Shared Field Wrapper (label + description + tooltip + error)
// ============================================

function FieldWrapper({
  element,
  children,
  layout = "horizontal",
  className,
}: {
  element: SettingsElement;
  children: React.ReactNode;
  layout?: "horizontal" | "vertical" | "full-width";
  className?: string;
}) {
  const hasTitle = Boolean(element.title && element.title.length > 0);

  if (layout === "full-width") {
    return (
      <div
        className={cn("flex flex-col gap-3 w-full p-4", className)}
        id={element.id}
      >
        {hasTitle && <FieldLabel element={element} />}
        <div className="w-full">{children}</div>
        {element.validationError && (
          <p className="text-sm text-destructive">{element.validationError}</p>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-12 gap-2 items-center w-full p-4",
        className,
      )}
      id={element.id}
    >
      {hasTitle && (
        <div className="sm:col-span-8 col-span-12">
          <FieldLabel element={element} />
        </div>
      )}
      <div className={hasTitle ? "sm:col-span-4 col-span-12" : "col-span-12"}>
        {children}
      </div>
      {element.validationError && (
        <div className="col-span-12">
          <p className="text-sm text-destructive">{element.validationError}</p>
        </div>
      )}
    </div>
  );
}

function FieldLabel({ element }: { element: SettingsElement }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center gap-2">
        {element.image_url && (
          <img
            src={element.image_url}
            alt=""
            className="w-5 h-5 object-contain"
          />
        )}
        <span className="text-sm font-semibold text-foreground">
          {element.title}
        </span>
        {element.tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <button type="button" className="inline-flex">
                  <Info className="size-3.5 text-muted-foreground cursor-help" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">{element.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {element.description && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          {element.description}
        </p>
      )}
    </div>
  );
}

// ============================================
// Text Field
// ============================================

export function TextField({ element, onChange }: FieldComponentProps) {
  return (
    <FieldWrapper element={element}>
      <Input
        value={String(element.value ?? element.default ?? "")}
        onChange={(e) => onChange(element.dependency_key!, e.target.value)}
        placeholder={
          element.placeholder ? String(element.placeholder) : undefined
        }
        disabled={element.disabled}
        className="sm:max-w-56"
      />
    </FieldWrapper>
  );
}

// ============================================
// Number Field
// ============================================

export function NumberField({ element, onChange }: FieldComponentProps) {
  return (
    <FieldWrapper element={element}>
      <div className="flex items-center gap-1 sm:max-w-56">
        {element.prefix && (
          <span className="text-sm text-muted-foreground shrink-0">
            {element.prefix}
          </span>
        )}
        <Input
          type="number"
          value={String(element.value ?? element.default ?? "")}
          onChange={(e) =>
            onChange(
              element.dependency_key!,
              e.target.value === "" ? "" : Number(e.target.value),
            )
          }
          placeholder={
            element.placeholder ? String(element.placeholder) : undefined
          }
          disabled={element.disabled}
          min={element.min}
          max={element.max}
          step={element.increment}
        />
        {element.postfix && (
          <span className="text-sm text-muted-foreground shrink-0">
            {element.postfix}
          </span>
        )}
      </div>
    </FieldWrapper>
  );
}

// ============================================
// Textarea Field
// ============================================

export function TextareaField({ element, onChange }: FieldComponentProps) {
  return (
    <FieldWrapper element={element} layout="full-width">
      <Textarea
        value={String(element.value ?? element.default ?? "")}
        onChange={(e) => onChange(element.dependency_key!, e.target.value)}
        placeholder={
          element.placeholder ? String(element.placeholder) : undefined
        }
        disabled={element.disabled}
        rows={4}
      />
    </FieldWrapper>
  );
}

// ============================================
// Select Field
// ============================================

export function SelectField({ element, onChange }: FieldComponentProps) {
  const currentValue = String(element.value ?? element.default ?? "");
  const selectedLabel = element.options?.find(
    (o) => String(o.value) === currentValue
  )?.title;

  return (
    <FieldWrapper element={element}>
      <Select
        value={currentValue}
        onValueChange={(val: any) => onChange(element.dependency_key!, val)}
        disabled={element.disabled}
      >
        <SelectTrigger className="sm:max-w-56">
          <SelectValue
            placeholder={
              element.placeholder ? String(element.placeholder) : "Select..."
            }
          >
            {selectedLabel}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {element.options?.map((option) => (
            <SelectItem key={String(option.value)} value={String(option.value)}>
              {option.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
}

// ============================================
// Switch Field
// ============================================

export function SwitchField({ element, onChange }: FieldComponentProps) {
  const isEnabled = element.enable_state
    ? element.value === element.enable_state.value
    : Boolean(element.value);

  const handleChange = (checked: boolean) => {
    if (element.enable_state && element.disable_state) {
      onChange(
        element.dependency_key!,
        checked ? element.enable_state.value : element.disable_state.value,
      );
    } else {
      onChange(element.dependency_key!, checked);
    }
  };

  return (
    <FieldWrapper element={element}>
      <div className="flex justify-end">
        <Switch
          checked={isEnabled}
          onCheckedChange={handleChange}
          disabled={element.disabled}
        />
      </div>
    </FieldWrapper>
  );
}

// ============================================
// Radio Capsule Field (using ToggleGroup)
// ============================================

export function RadioCapsuleField({ element, onChange }: FieldComponentProps) {
  const currentValue = String(element.value ?? element.default ?? "");

  return (
    <FieldWrapper element={element}>
      <ToggleGroup
        value={[currentValue]}
        onValueChange={(val: any) => {
          const selected = Array.isArray(val) ? val[0] : val;
          if (selected) onChange(element.dependency_key!, selected);
        }}
        className="justify-end"
      >
        {element.options?.map((option) => (
          <ToggleGroupItem
            key={String(option.value)}
            value={String(option.value)}
            className="text-xs px-3"
          >
            {option.title}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </FieldWrapper>
  );
}

// ============================================
// Multicheck Field
// ============================================

export function MulticheckField({ element, onChange }: FieldComponentProps) {
  const currentValues: string[] = Array.isArray(element.value)
    ? element.value.map(String)
    : Array.isArray(element.default)
    ? (element.default as any[]).map(String)
    : [];

  const handleToggle = (optionValue: string, checked: boolean) => {
    const updated = checked
      ? [...currentValues, optionValue]
      : currentValues.filter((v) => v !== optionValue);
    onChange(element.dependency_key!, updated);
  };

  return (
    <FieldWrapper element={element} layout="full-width">
      <div className="flex flex-col gap-2">
        {element.options?.map((option) => (
          <label
            key={String(option.value)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Checkbox
              checked={currentValues.includes(String(option.value))}
              onCheckedChange={(checked) =>
                handleToggle(String(option.value), Boolean(checked))
              }
            />
            <span className="text-sm">{option.title}</span>
          </label>
        ))}
      </div>
    </FieldWrapper>
  );
}

// ============================================
// Label-only Field (base_field_label)
// ============================================

export function LabelField({ element }: FieldComponentProps) {
  return (
    <div
      className="p-4 flex justify-between gap-4 items-center"
      id={element.id}
    >
      <FieldLabel element={element} />
      {element.doc_link && (
        <a
          href={element.doc_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground flex gap-1 items-center text-sm hover:text-foreground transition-colors shrink-0"
        >
          <FileText className="size-4" />
          Doc
        </a>
      )}
    </div>
  );
}

// ============================================
// HTML Field
// ============================================

export function HtmlField({ element }: FieldComponentProps) {
  return (
    <div className={cn("w-full p-4", element.css_class)} id={element.id}>
      {(element.title || element.description) && (
        <div className="mb-3">
          {element.title && (
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {element.title}
            </h3>
          )}
          {element.description && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {element.description}
            </p>
          )}
        </div>
      )}
      {element.html_content && (
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: element.html_content }}
        />
      )}
    </div>
  );
}

// ============================================
// Customize Radio Field (RadioCard)
// ============================================

export function CustomizeRadioField({
  element,
  onChange,
}: FieldComponentProps) {
  const currentValue = String(element.value ?? element.default ?? "");

  return (
    <FieldWrapper element={element} layout="full-width">
      <RadioGroup
        value={currentValue}
        onValueChange={(val: any) => onChange(element.dependency_key!, val)}
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
          "[&>[data-slot=field-group]]:h-full",
          "[&_[data-slot=field-label]]:h-full [&_[data-slot=field-label]]:w-full",
          "[&_[data-slot=field]]:h-full",
        )}
      >
        {element.options?.map((option) => (
          <RadioCard
            key={String(option.value)}
            value={String(option.value)}
            label={option.title}
            description={option.description}
            disabled={element.disabled}
          />
        ))}
      </RadioGroup>
    </FieldWrapper>
  );
}

// ============================================
// Fallback Field (for unknown variants)
// ============================================

export function FallbackField({ element }: FieldComponentProps) {
  return (
    <div className="p-4 text-sm text-muted-foreground italic" id={element.id}>
      Unsupported field type:{" "}
      <code className="text-xs bg-muted px-1 py-0.5 rounded">
        {element.variant}
      </code>
      {element.title && <span> — {element.title}</span>}
    </div>
  );
}

export { FieldLabel, FieldWrapper };
