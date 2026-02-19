"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./input-group";

export interface CombineInputProps {
  percentageValue?: string | number;
  numberValue?: string | number;
  moneySign?: string;
  swapped?: boolean;
  onPercentageChange?: (value: string) => void;
  onNumberChange?: (value: string) => void;
  className?: string;
  percentagePlaceholder?: string;
  numberPlaceholder?: string;
}

/**
 * A combined input component that displays a percentage input and a number input with a variable money sign.
 * The two inputs can be swapped based on the `swapped` prop.
 */
export function CombineInput({
  percentageValue,
  numberValue,
  moneySign = "$",
  swapped = false,
  onPercentageChange,
  onNumberChange,
  className,
  percentagePlaceholder = "0",
  numberPlaceholder = "2500",
}: CombineInputProps) {
  const percentagePart = (
    <InputGroup className="w-32">
      <InputGroupInput
        type="number"
        value={percentageValue}
        onChange={(e) => onPercentageChange?.(e.target.value)}
        placeholder={percentagePlaceholder}
      />
      <InputGroupAddon
        align="inline-end"
        className="bg-muted/30 border-l border-input px-3 h-full flex items-center justify-center"
      >
        <InputGroupText className="text-foreground">%</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );

  const numberPart = (
    <InputGroup className="w-40">
      <InputGroupAddon
        align="inline-start"
        className="bg-muted/30 border-r border-input px-3 h-full flex items-center justify-center"
      >
        <InputGroupText className="text-foreground">{moneySign}</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        type="number"
        value={numberValue}
        onChange={(e) => onNumberChange?.(e.target.value)}
        placeholder={numberPlaceholder}
      />
    </InputGroup>
  );

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {swapped ? numberPart : percentagePart}
      <span className="text-muted-foreground font-light text-xl">+</span>
      {swapped ? percentagePart : numberPart}
    </div>
  );
}
