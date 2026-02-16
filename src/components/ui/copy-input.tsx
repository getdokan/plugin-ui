import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface CopyInputProps extends Omit<React.ComponentPropsWithoutRef<typeof Input>, "onCopy"> {
  value: string;
  onCopy?: (value: string) => void;
  successDuration?: number;
}

export function CopyInput({
  value,
  className,
  onCopy,
  successDuration = 2000,
  ...props
}: CopyInputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    if (onCopy) onCopy(value);
    setTimeout(() => setCopied(false), successDuration);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Input
        value={value}
        readOnly
        className="pr-10"
        {...props}
      />
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        aria-label={copied ? "Copied" : "Copy"}
      >
        {copied ? (
          <Check className="size-4 text-success" />
        ) : (
          <Copy className="size-4" />
        )}
      </button>
    </div>
  );
}
