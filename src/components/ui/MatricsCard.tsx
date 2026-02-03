import type { HTMLAttributes } from "react";
import { LucideIcon, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "./card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export interface MatricsCardProps extends HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  value: string | number;
  change?: {
    value: string | number;
    trend: "up" | "down" | "neutral";
  };
  label: string;
  tooltip?: string;
  variant?: "light" | "primary";
}

export function MatricsCard({
  icon: Icon,
  value = '',
  change,
  label = '',
  tooltip = '',
  variant = "light",
  className = '',
  ...props
}: MatricsCardProps) {
  return (
    <Card className={cn("p-6 rounded-[3px]", className)} {...props}>
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full",
            variant === "primary"
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary"
          )}
        >
          <Info className="h-6 w-6" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{value}</span>
            {change && (
              <span
                className={cn(
                  "text-sm font-medium",
                  change.trend === "up" && "text-success",
                  change.trend === "down" && "text-destructive",
                  change.trend === "neutral" && "text-muted-foreground"
                )}
              >
                {change.trend === "up" ? "+" : change.trend === "down" ? "-" : ""}
                {change.value}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>{label}</span>
            {tooltip && (
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  { tooltip ?? '' }
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}