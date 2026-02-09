import * as React from "react";
import { Info } from "lucide-react";
import { cn, renderIcon } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";

export interface MatricsGroupItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode | React.ElementType;
  label: string;
  value: string | number;
  change?: string | number;
  changeDirection?: 'up' | 'down' | 'neutral';
  tooltip?: string | React.ReactNode;
  tooltipIcon?: React.ReactNode | React.ElementType;
}

export function MatricsGroupItem({
  icon,
  label,
  value,
  change,
  changeDirection = 'neutral',
  tooltip,
  tooltipIcon = Info,
  className,
  ...props
}: MatricsGroupItemProps) {
  return (
    <CardContent
      className={cn(
        "flex flex-col gap-2.5 p-5 flex-1 min-w-50 bg-background",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1">
        {renderIcon(icon, { className: "h-4.5 w-4.5 text-primary" })}
        <span className="text-[12px] font-normal text-muted-foreground">{label}</span>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger>
              {renderIcon(tooltipIcon, { className: "h-4 w-4 cursor-help text-muted-foreground" })}
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>
      
      <div className="flex flex-col gap-1">
        <span className="text-[18px] font-bold tracking-tight leading-none">{value}</span>
        {change && (
          <span
            className={cn(
              "text-[12px] leading-3.5 font-semibold mt-1",
              changeDirection === "up" && "text-success",
              changeDirection === "down" && "text-destructive",
              changeDirection === "neutral" && "text-muted-foreground"
            )}
          >
            {change}
          </span>
        )}
      </div>
    </CardContent>
  );
}

export interface MatricsGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onCardClick?: () => void;
}

export function MatricsGroup({ children, className, onCardClick = () => {}, ...props }: MatricsGroupProps) {
  return (
    <>
      <Card className={cn("rounded-[3px] group cursor-pointer p-0 m-0 gap-px flex-col md:flex-row flex-wrap bg-border ring-border! shadow-none", className)} {...props} onClick={ onCardClick ? onCardClick : () => {} }>
        {children}
      </Card>
    </>
  );
}
