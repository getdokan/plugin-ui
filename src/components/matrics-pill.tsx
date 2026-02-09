import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn, renderIcon } from "@/lib/utils";

type MatricsPillProps = {
  className?: string;
  iconWrapperClassName?: string;
  iconClassName?: string;
  textClassName?: string;
  countClassName?: string;
  icon: React.ReactNode | React.ElementType
  text: string,
  count: number
}

function MatricsPill( { className = '', icon, text, countClassName, count, textClassName, iconClassName, iconWrapperClassName }: MatricsPillProps ) {
  return (
    <Badge variant="outline" className={ cn( 'p-2.5 border! h-auto flex flex-row justify-between gap-2.5', className ) }>
      <span className={ cn( 'flex items-center gap-2' ) }>
        <span className={cn( 'w-5! h-5! ml-2.5 text-muted-foreground', iconWrapperClassName )}>
          {renderIcon(icon, { size: 20, className: iconClassName })}
        </span>
        <span className={cn( 'font-semibold text-[14px]', textClassName )}>{text}</span>
      </span>
      <span className={ cn( 'text-destructive-foreground bg-destructive w-9 h-9 rounded-full flex justify-center items-center', countClassName ) }>{ count }</span>
    </Badge>
  );
}

export {
  MatricsPill,
  MatricsPillProps,
}