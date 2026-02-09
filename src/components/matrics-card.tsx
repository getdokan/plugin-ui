import type { HTMLAttributes } from "react";
import { Info } from "lucide-react";
import { cn, renderIcon } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface MatricsCardProps extends HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode | React.ElementType;
  value: string | number | JSX.Element;
  count?: string | number;
  countDirection?: 'up' | 'down' | 'neutral';
  shortDescription: string | JSX.Element;
  tooltip?: string | JSX.Element;
  tooltipIcon?: React.ReactNode | React.ElementType;
  onCardClick?: () => void;
}

export function MatricsCard({
  icon = Info,
  value = '',
  count = '',
  countDirection = 'neutral',
  shortDescription = '',
  tooltip = '',
  className = '',
  tooltipIcon = Info,
  onCardClick = () => {},
  ...props
}: MatricsCardProps) {
  return (
    <Card className={cn("p-5 rounded-[3px] group cursor-pointer bg-background shadow-none! ring-border!", className)} {...props} onClick={ onCardClick ? onCardClick : () => {} }>
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-13 w-13 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
          )}
        >
          {
            renderIcon(icon, { className: "h-6 w-6" })
          }
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{value}</span>
            {count && (
              <span
                className={cn(
                  "text-[12px] leading-3.5 font-semibold",
                  countDirection === "up" && "text-success",
                  countDirection === "down" && "text-destructive",
                  countDirection === "neutral" && "text-muted-foreground"
                )}
              >
                {count}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[12px] font-normal text-muted-foreground">
            <span>{shortDescription}</span>
            {tooltip && (
              <Tooltip>
                <TooltipTrigger>
                  {
                    renderIcon(tooltipIcon, { className: "h-4 w-4 cursor-help" })
                  }
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