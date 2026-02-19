import React, { useState } from "react";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { FileText, Info, Eye, EyeOff, ArrowUpRight, RefreshCcw, CircleCheck } from "lucide-react";
import {
  Button,
  LabeledCheckbox,
  Input,
  CopyInput,
  RadioGroup,
  RadioImageCard,
  RadioIconCard,
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
  RichTextEditor,
  Separator,
  CombineInput,
  Badge,
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
  isNested,
  isGroupParent,
}: {
  element: SettingsElement;
  children: React.ReactNode;
  layout?: "horizontal" | "vertical" | "full-width";
  className?: string;
  isNested?: boolean;
  isGroupParent?: boolean;
}) {
  const hasLabel = Boolean(
    (element.label && element.label.length > 0) ||
      (element.title && element.title.length > 0),
  );

  const mergedClassName = cn(
    className,
    element.className,
    element.css_class,
    isGroupParent && "!pb-2",
    isNested && "!pt-2 !border-t-0 !border-none",
  );

  if (layout === "full-width") {
    return (
      <div
        className={cn("flex flex-col gap-3 w-full p-4", mergedClassName)}
        id={element.id}
        data-testid={`settings-field-${element.id}`}
      >
        {hasLabel && <FieldLabel element={element} />}
        <div className="w-full">{children}</div>
        {element.validationError && (
          <div className="text-sm text-destructive"><RawHTML>{element.validationError}</RawHTML></div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-12 gap-2 items-center w-full p-4",
        mergedClassName,
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
          <div className="text-sm text-destructive"><RawHTML>{element.validationError}</RawHTML></div>
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
          <span className={ cn( 'text-sm font-semibold', element?.is_danger ? 'text-destructive' : 'text-foreground' ) }>
            {displayLabel}
          </span>

          {IconComponent && (
            <IconComponent className={ cn( 'size-4', element?.is_danger ? 'text-destructive' : 'text-primary' ) } />
          )}

          {element.tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <button type="button" className="inline-flex">
                    <Info className={ cn( 'size-3.5 cursor-help', element?.is_danger ? 'text-destructive' : 'text-muted-foreground' ) } />
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
          <div className={ cn( 'text-xs leading-relaxed', element?.is_danger ? 'text-destructive' : 'text-muted-foreground' ) }>
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

export function TextField({ element, onChange, ...rest }: FieldComponentProps) {
  return (
    <FieldWrapper element={element} layout={ element.layout ?? "horizontal" } {...rest}>
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
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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

export function NumberField({ element, onChange, ...rest }: FieldComponentProps) {
  return (
    <FieldWrapper element={element} {...rest}>
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

export function TextareaField({ element, onChange, ...rest }: FieldComponentProps) {
  return (
    <FieldWrapper element={element} layout="full-width" {...rest}>
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
// Rich Text Field
// ============================================

export function RichTextField({ element, onChange, ...rest }: FieldComponentProps) {
  return (
    <FieldWrapper element={element} layout="full-width" {...rest}>
      <RichTextEditor
        value={String(element.value ?? element.default ?? "")}
        onChange={(value) => onChange(element.dependency_key!, value)}
        placeholder={
          element.placeholder ? String(element.placeholder) : undefined
        }
      />
    </FieldWrapper>
  );
}

// ============================================
// Google Analytics Field
// ============================================

export function GoogleAnalyticsField({ element, onChange, ...rest }: FieldComponentProps) {
  const value = element.value as any;
  const isConnected = value?.connected;

  if (!isConnected) {
    return (
      <FieldWrapper element={element} {...rest}>
        <a
          href={value?.auth_url || "#"}
          className="flex border border-border rounded-md overflow-hidden hover:border-primary transition-colors group h-10"
        >
          <div className="bg-muted/30 px-3 flex items-center justify-center border-r border-border group-hover:border-primary">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/500px-Google_%22G%22_logo.svg.png"
              alt="Google"
              className="size-4"
            />
          </div>
          <div className="px-3 flex items-center whitespace-nowrap">
            <span className="text-sm font-semibold text-foreground">Connect with Google</span>
          </div>
        </a>
      </FieldWrapper>
    );
  }

  const selectedProfile = (value?.profiles || []).find(
    (p: any) => String(p.value) === String(value?.profile_id)
  );

  return (
    <div className="w-full divide-y divide-border">
      <FieldWrapper
        element={{
          ...element,
          icon: "CircleCheck",
          description: `Successfully connected but you can disconnect and reconnect anytime if needed. <a href="${value?.disconnect_url || "#"}" class="text-primary hover:underline inline-flex items-center gap-1">Disconnect <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg></a>`,
        }}
      >
        <div />
      </FieldWrapper>

      <div className="grid grid-cols-12 gap-2 items-center w-full p-4">
        <div className="sm:col-span-8 col-span-12">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              Analytics Profile
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <button type="button" className="inline-flex">
                    <Info className="size-3.5 text-muted-foreground cursor-help" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">Select your profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="sm:col-span-4 col-span-12 flex sm:justify-end gap-2">
          <Select
            value={String(value?.profile_id || "")}
            onValueChange={(val) =>
              onChange(element.dependency_key!, { ...value, profile_id: val })
            }
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select your profile">
                {selectedProfile?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {(value?.profiles || []).map((p: any) => (
                <SelectItem key={p.value} value={String(p.value)}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="shrink-0 flex gap-2">
            <RefreshCcw className="size-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Select Field
// ============================================

export function SelectField({ element, onChange, ...rest }: FieldComponentProps) {
  const currentValue = String(element.value ?? element.default ?? "");
  const selectedOption = element.options?.find(
    (o) => String(o.value) === currentValue
  );
  const selectedLabel = selectedOption?.label ?? selectedOption?.title;

  return (
    <FieldWrapper element={element} {...rest}>
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

export function SwitchField({ element, onChange, ...rest }: FieldComponentProps) {
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
    <FieldWrapper element={element} {...rest}>
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

export function RadioCapsuleField({ element, onChange, ...rest }: FieldComponentProps) {
  const currentValue = String(element.value ?? element.default ?? "");

  const items =
    element.options?.map((option) => {
      const StartIcon = option.startIcon ? (LucideIcons as any)[option.startIcon] : null;
      const EndIcon = option.endIcon ? (LucideIcons as any)[option.endIcon] : null;

      return {
        value: String(option.value),
        label: String(option.label ?? option.title ?? ""),
        startIcon: StartIcon ? <StartIcon className="size-4" /> : null,
        endIcon: EndIcon ? <EndIcon className="size-4" /> : null,
      };
    }) ?? [];

  return (
    <FieldWrapper element={element} {...rest}>
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

export function MulticheckField({ element, onChange, ...rest }: FieldComponentProps) {
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
    <FieldWrapper element={element} layout="full-width" {...rest}>
      <div className="flex flex-col gap-4">
        {element.options?.map((option) => (
          <LabeledCheckbox
            key={String(option.value)}
            checked={currentValues.includes(String(option.value))}
            onCheckedChange={(checked) =>
              handleToggle(String(option.value), Boolean(checked))
            }
            label={option.label ?? option.title}
            image={option.image}
            className="rounded-[4px]"
            description={
              option.description ? (
                <div className="flex items-start gap-1.5 mt-1">
                  <Info className="size-3.5 shrink-0 mt-0.5" />
                  <RawHTML>{option.description}</RawHTML>
                </div>
              ) : undefined
            }
          />
        ))}
      </div>
    </FieldWrapper>
  );
}

// ============================================
// Preview Multicheck Field
// ============================================

export function PreviewMulticheckField({ element, onChange, ...rest }: FieldComponentProps) {
  const currentValues = element.value ?? element.default ?? {};

  const getValue = (optionValue: string) => {
    if (Array.isArray(currentValues)) {
        return currentValues.map(String).includes(optionValue);
    }
    if (typeof currentValues === 'object' && currentValues !== null) {
        return !!(currentValues as any)[optionValue];
    }
    return false;
  }

  const handleToggle = (optionValue: string, checked: boolean) => {
    if (Array.isArray(currentValues)) {
        const vals = currentValues.map(String);
        const updated = checked
          ? [...vals, optionValue]
          : vals.filter((v) => v !== optionValue);
        onChange(element.dependency_key!, updated);
    } else {
        const updated = {
            ...(typeof currentValues === 'object' ? currentValues : {}),
            [optionValue]: checked
        };
        onChange(element.dependency_key!, updated);
    }
  };

  // Create a wrapper element without label/description to avoid double rendering
  // but keep id and other properties for FieldWrapper
  const wrapperElement = {
    ...element,
    label: '',
    title: '',
    description: '',
    tooltip: '',
  };

  return (
    <FieldWrapper element={wrapperElement} layout="full-width" {...rest}>
      <div className="flex flex-col md:flex-row gap-8 items-start justify-between w-full">
        <div className="flex-1 flex flex-col gap-6">
          <FieldLabel element={{ ...element, image_url: undefined }} />
          <div className="flex flex-col gap-4">
            {element.options?.map((option) => (
              <LabeledCheckbox
                key={String(option.value)}
                checked={getValue(String(option.value))}
                onCheckedChange={(checked) =>
                  handleToggle(String(option.value), Boolean(checked))
                }
                label={option.label ?? option.title}
                image={option.image}
                className="rounded-[4px]"
                description={
                  option.description ? (
                    <div className="flex items-start gap-1.5 mt-1">
                      <Info className="size-3.5 shrink-0 mt-0.5" />
                      <RawHTML>{option.description}</RawHTML>
                    </div>
                  ) : undefined
                }
              />
            ))}
          </div>
        </div>

        {element.image_url && (
          <div className="shrink-0 w-full md:w-64 lg:w-80 mt-2 md:mt-0">
            <div className="aspect-[4/3] rounded-2xl border border-primary/10 bg-primary/5 flex items-center justify-center p-6 shadow-sm">
              <img src={element.image_url} alt="" className="max-w-full max-h-full object-contain" />
            </div>
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}

// ============================================
// Label-only Field (base_field_label)
// ============================================

export function LabelField({ element, ...rest }: FieldComponentProps) {
  return (
    <div
      className={cn("p-4 flex justify-between gap-4 items-center", rest.isNested && "!pt-0 !border-t-0 !border-none", rest.isGroupParent && "!pb-0")}
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

export function HtmlField({ element, ...rest }: FieldComponentProps) {
  return (
    <div className={cn("w-full p-4", element.css_class, rest.isNested && "!pt-0 !border-t-0 !border-none", rest.isGroupParent && "!pb-0")} id={element.id} data-testid={`settings-field-${element.id}`}>
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
  ...rest
}: FieldComponentProps) {
  const currentValue = String(element.value ?? element.default ?? "");
  const radioVariant = element.radio_variant || 'radio_box';

  return (
    <FieldWrapper element={element} layout="full-width" {...rest}>
      <RadioGroup
        value={currentValue}
        onValueChange={(val: any) => onChange(element.dependency_key!, val)}
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
          "[&>[data-slot=field-group]]:h-full",
          "[&_[data-slot=field-label]]:h-full [&_[data-slot=field-label]]:w-full",
          "[&_[data-slot=field]]:h-full",
          radioVariant === 'radio_box' && "lg:grid-cols-4",
        )}
      >
        {element.options?.map((option) => {
          const commonProps = {
            key: String(option.value),
            value: String(option.value),
            currentValue,
            label: option.label ?? option.title ?? '',
            description: option.description,
            disabled: element.disabled,
          };

          if (radioVariant === 'radio_box') {
            return (
              <RadioIconCard
                {...commonProps}
                icon={option.icon || option.image}
              />
            );
          }

          return (
            <RadioImageCard
              {...commonProps}
              image={option.image || option.icon}
              position="right"
            />
          );
        })}
      </RadioGroup>
    </FieldWrapper>
  );
}

export function NoticeField({ element, ...rest }: FieldComponentProps) {
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
        element.css_class,
        rest.isNested && "!pt-0 !border-t-0 !border-none",
        rest.isGroupParent && "!pb-0"
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

export function CopyField({ element, ...rest }: FieldComponentProps) {
  const value = String(element.value ?? element.default ?? "");

  return (
    <FieldWrapper element={element} layout={element.layout ?? "horizontal"} {...rest}>
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

export function InfoField({ element, ...rest }: FieldComponentProps) {
  const infoTitle = element.label || element.title;
  const infoDescription = element.description || element.notice_description;
  const linkUrl = element.link_url || element.doc_link;
  const linkTitle = element.link_title || element.doc_link_text;

  return (
    <Notice
      className={ cn( 'bg-primary/10 border-primary mx-4', element.css_class, rest.isNested && "!pt-0 !border-t-0 !border-none", rest.isGroupParent && "!pb-0" ) }
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
// Combine Input Field
// ============================================

export function CombineInputField({ element, onChange, ...rest }: FieldComponentProps) {
  const value = (element.value as any) || {};

  // If the field is automated, show a badge instead of the inputs
  if (element.is_automated) {
    return (
      <FieldWrapper element={element} {...rest}>
        <Badge variant="secondary" className="px-3 h-6 rounded-full font-medium">
          Automated
        </Badge>
      </FieldWrapper>
    );
  }

  // Find keys in the value object. Fallback to common Dokan keys if not found.
  const keys = Object.keys(value);
  const percentageKey =
    keys.find((k) => k.toLowerCase().includes("percentage")) ||
    "admin_percentage";
  const numberKey =
    keys.find(
      (k) =>
        k.toLowerCase().includes("fee") ||
        k.toLowerCase().includes("number") ||
        k.toLowerCase().includes("amount"),
    ) || "additional_fee";

  return (
    <FieldWrapper element={element} layout={element.layout ?? "horizontal"} {...rest}>
      <CombineInput
        percentageValue={value[percentageKey] ?? ""}
        numberValue={value[numberKey] ?? ""}
        moneySign={element.money_sign || "$"}
        swapped={element.swapped || false}
        percentagePlaceholder={element.percentage_placeholder}
        numberPlaceholder={element.number_placeholder}
        onPercentageChange={(val) =>
          onChange(element.dependency_key!, { ...value, [percentageKey]: val })
        }
        onNumberChange={(val) =>
          onChange(element.dependency_key!, { ...value, [numberKey]: val })
        }
      />
    </FieldWrapper>
  );
}

// ============================================
// Fallback Field (for unknown variants)
// ============================================

export function FallbackField({ element, ...rest }: FieldComponentProps) {
  return (
    <div className={cn("p-4 text-sm text-muted-foreground italic", rest.isNested && "!pt-0 !border-t-0 !border-none", rest.isGroupParent && "!pb-0")} id={element.id} data-testid={`settings-field-${element.id}`}>
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
