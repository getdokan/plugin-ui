import React, { useState } from "react";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { FileText, Info, Eye, EyeOff, ArrowUpRight } from "lucide-react";
import {
  Checkbox,
  Input,
  CopyInput,
  RadioGroup,
  RadioImageCard,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  ColorPicker,
  Alert,
  AlertDescription,
  AlertTitle,
  Notice,
  NoticeTitle,
} from "../ui";
import { ButtonToggleGroup } from "../button-toggle-group";
import type { FieldComponentProps, SettingsElement } from "./settings-types";
import { RawHTML } from '@wordpress/element';

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
  const hasLabel = Boolean(
    (element.label && element.label.length > 0) ||
      (element.title && element.title.length > 0),
  );

  if (layout === "full-width") {
    return (
      <div
        className={cn("flex flex-col gap-3 w-full p-4", className)}
        id={element.id}
        data-testid={`settings-field-${element.id}`}
      >
        {hasLabel && <FieldLabel element={element} />}
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
      data-testid={`settings-field-${element.id}`}
    >
      {hasLabel && (
        <div className="sm:col-span-8 col-span-12">
          <FieldLabel element={element} />
        </div>
      )}
      <div
        className={
          hasLabel
            ? "sm:col-span-4 col-span-12 flex sm:justify-end"
            : "col-span-12"
        }
      >
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
  const displayLabel = element.label || element.title || '';
  const IconComponent = element.icon ? (LucideIcons as any)[element.icon] : null;

  return (
    <div className="flex items-start gap-3">
      {element.image_url && (
        <img
          src={element.image_url}
          alt=""
          className="w-11 h-11 object-contain border border-border rounded-md p-2"
        />
      )}
      <div className="flex flex-col gap-1 w-full">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {displayLabel}
          </span>

          {IconComponent && (
            <IconComponent className="size-4 text-primary" />
          )}

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
          <div className="text-xs text-muted-foreground leading-relaxed">
            <RawHTML>{element.description}</RawHTML>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Text Field
// ============================================

export function TextField({ element, onChange }: FieldComponentProps) {
  return (
    <FieldWrapper element={element} layout={ element.layout ?? "horizontal" }>
      <Input
        value={String(element.value ?? element.default ?? "")}
        onChange={(e) => onChange(element.dependency_key!, e.target.value)}
        placeholder={
          element.placeholder ? String(element.placeholder) : undefined
        }
        disabled={element.disabled}
        className="max-w-56 md:max-w-full"
      />
    </FieldWrapper>
  );
}

// ============================================
// Show/Hide Field (Password-like)
// ============================================

export function ShowHideField({ element, onChange }: FieldComponentProps) {
  const [show, setShow] = useState(false);

  return (
    <FieldWrapper element={element} layout={ element.layout ?? "horizontal" }>
      <div className="relative max-w-56 md:max-w-full w-full">
        <Input
          type={show ? "text" : "password"}
          value={String(element.value ?? element.default ?? "")}
          onChange={(e) => onChange(element.dependency_key!, e.target.value)}
          placeholder={
            element.placeholder ? String(element.placeholder) : undefined
          }
          disabled={element.disabled}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={show ? "Hide" : "Show"}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </FieldWrapper>
  );
}

// ============================================
// Number Field
// ============================================

export function NumberField({ element, onChange }: FieldComponentProps) {
  return (
    <FieldWrapper element={element}>
      <div className="flex items-center gap-1 relative max-w-56 md:max-w-full w-full">
        {element.prefix && (
          <span className="text-sm text-muted-foreground shrink-0 absolute left-3 top-1/2 -translate-y-1/2 hover:text-foreground transition-colors">
            <RawHTML>{element.prefix}</RawHTML>
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
          className={ cn(  element?.postfix && 'pr-10', element?.prefix && 'pl-10' ) }
        />
        {element.postfix && (
          <span className="text-sm text-muted-foreground shrink-0 absolute right-3 top-1/2 -translate-y-1/2 hover:text-foreground transition-colors">
            <RawHTML>{element.postfix}</RawHTML>
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
  const selectedOption = element.options?.find(
    (o) => String(o.value) === currentValue
  );
  const selectedLabel = selectedOption?.label ?? selectedOption?.title;

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
              {option.label ?? option.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
}

// ============================================
// Color Picker Field
// ============================================

export function ColorPickerField({ element, onChange }: FieldComponentProps) {
  const value = String(element.value ?? element.default ?? "#000000");

  return (
    <FieldWrapper element={element} layout={element.layout ?? "horizontal"}>
      <ColorPicker
        value={value}
        onChange={(newColor) => onChange(element.dependency_key!, newColor)}
        disabled={element.disabled}
        aria-label={element.label || element.title}
      />
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
      <Switch
        checked={isEnabled}
        onCheckedChange={handleChange}
        disabled={element.disabled}
      />
    </FieldWrapper>
  );
}

// ============================================
// Radio Capsule Field (using ButtonToggleGroup)
// ============================================

export function RadioCapsuleField({ element, onChange }: FieldComponentProps) {
  const currentValue = String(element.value ?? element.default ?? "");

  const items =
    element.options?.map((option) => ({
      value: String(option.value),
      label: String(option.label ?? option.title ?? ""),
    })) ?? [];

  return (
    <FieldWrapper element={element}>
      <ButtonToggleGroup
        items={items}
        value={currentValue}
        onChange={(val) => onChange(element.dependency_key!, val)}
        variant="outline"
      />
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
            <span className="text-sm">{option.label ?? option.title}</span>
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
      data-testid={`settings-field-${element.id}`}
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
          { element?.doc_link_text ?? '' }
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
    <div className={cn("w-full p-4", element.css_class)} id={element.id} data-testid={`settings-field-${element.id}`}>
      {(element.label || element.title || element.description) && (
        <div className="mb-3">
          {(element.label || element.title) && (
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {element.label || element.title}
            </h3>
          )}
          {element.description && (
            <div className="text-xs text-muted-foreground leading-relaxed">
              <RawHTML>{element.description}</RawHTML>
            </div>
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
          <RadioImageCard
            key={String(option.value)}
            value={String(option.value)}
            currentValue={currentValue}
            label={option.label ?? option.title ?? ''}
            image={option.image}
            description={option.description}
            disabled={element.disabled}
            position="right"
          />
        ))}
      </RadioGroup>
    </FieldWrapper>
  );
}

export function NoticeField({ element }: FieldComponentProps) {
  const noticeTitle = element.notice_title || element.label || element.title;
  const noticeDescription = element.notice_description || element.description;
  const linkUrl = element.link_url || element.doc_link;
  const linkTitle = element.link_title || element.doc_link_text;
  const noticeType = element.notice_type || 'warning';

  // Use Figma colors for warning variant as requested for Printful alerts
  const isWarning = noticeType === 'warning';
  
  return (
    <Alert
      variant={noticeType as any}
      className={cn(
        "border rounded-lg p-5",
        element.css_class
      )}
      id={element.id} data-testid={`settings-field-${element.id}`}
    >
      <Info className={cn("size-6", isWarning && "text-warning-foreground")} strokeWidth={2} />
      {noticeTitle && (
        <AlertTitle className={cn("font-bold text-base m-0 leading-tight", isWarning && "text-warning-foreground")}>
          {noticeTitle}
        </AlertTitle>
      )}
      {(noticeDescription || linkUrl) && (
        <AlertDescription className={cn("text-sm m-0 leading-relaxed", isWarning && "text-warning-foreground")}>
          {noticeDescription && <RawHTML>{noticeDescription}</RawHTML>}
          {linkUrl && (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-sm font-bold underline underline-offset-4 hover:opacity-80 transition-opacity w-fit flex items-center gap-1.5 mt-2",
                isWarning && "text-warning-foreground"
              )}
            >
              {linkTitle || "Learn more"}
            </a>
          )}
        </AlertDescription>
      )}
    </Alert>
  );
}

// ============================================
// Copy Field
// ============================================

export function CopyField({ element }: FieldComponentProps) {
  const value = String(element.value ?? element.default ?? "");

  return (
    <FieldWrapper element={element} layout={element.layout ?? "horizontal"}>
      <CopyInput
        value={value}
        placeholder={element.placeholder ? String(element.placeholder) : undefined}
        disabled={element.disabled}
        className="max-w-56 md:max-w-full"
      />
    </FieldWrapper>
  );
}

// ============================================
// Info Field
// ============================================

export function InfoField({ element }: FieldComponentProps) {
  const infoTitle = element.label || element.title;
  const infoDescription = element.description || element.notice_description;
  const linkUrl = element.link_url || element.doc_link;
  const linkTitle = element.link_title || element.doc_link_text;

  return (
    <Notice
      className={ cn( 'bg-primary/10 border-primary mx-4', element.css_class ) }
      id={element.id}
      data-testid={`settings-field-${element.id}`}
    >
      <NoticeTitle className="flex items-center flex-wrap gap-x-2 gap-y-1">
        {infoTitle && <span className="text-foreground"><RawHTML>{infoTitle}</RawHTML></span>}
        {linkUrl && (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-0.5"
          >
            <RawHTML>{linkTitle || "Learn more"}</RawHTML>
            <ArrowUpRight className="size-3.5" />
          </a>
        )}
      </NoticeTitle>
      {infoDescription && (
        <div className="text-sm text-muted-foreground leading-relaxed">
          <RawHTML>{infoDescription}</RawHTML>
        </div>
      )}
    </Notice>
  );
}

// ============================================
// Fallback Field (for unknown variants)
// ============================================

export function FallbackField({ element }: FieldComponentProps) {
  return (
    <div className="p-4 text-sm text-muted-foreground italic" id={element.id} data-testid={`settings-field-${element.id}`}>
      Unsupported field type:{" "}
      <code className="text-xs bg-muted px-1 py-0.5 rounded">
        {element.variant}
      </code>
      {(element.label || element.title) && (
        <span> — {element.label || element.title}</span>
      )}
    </div>
  );
}

export { FieldLabel, FieldWrapper };
