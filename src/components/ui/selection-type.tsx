import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const selectionItemVariants = cva(
  "flex items-center justify-between gap-3 rounded-lg border text-sm font-medium transition-all hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "border-input bg-background text-foreground",
        selected: "border-primary bg-background text-foreground",
      },
      size: {
        sm: "h-10 px-3 py-2",
        md: "h-11 px-4 py-2.5",
        lg: "h-12 px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface SelectionTypeContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
}

const SelectionTypeContext = React.createContext<SelectionTypeContextValue>({});

interface SelectionTypeProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

function SelectionType({
  className,
  value,
  onValueChange,
  children,
  ...props
}: SelectionTypeProps) {
  return (
    <SelectionTypeContext.Provider value={{ value, onValueChange }}>
      <div
        className={cn("flex flex-col gap-3 rounded-lg border border-dashed border-muted p-4", className)}
        {...props}
      >
        {children}
      </div>
    </SelectionTypeContext.Provider>
  );
}

interface SelectionItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof selectionItemVariants> {
  value: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

function SelectionItem({
  className,
  variant,
  size = "md",
  value,
  icon,
  endIcon,
  children,
  onClick,
  ...props
}: SelectionItemProps) {
  const context = React.useContext(SelectionTypeContext);
  const isSelected = context.value === value;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    context.onValueChange?.(value);
    onClick?.(e);
  };

  return (
    <button
      type="button"
      className={cn(
        selectionItemVariants({ variant: isSelected ? "selected" : variant, size }),
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {icon && (
        <span className={cn("shrink-0", isSelected ? "text-primary" : "text-muted-foreground")}>
          {icon}
        </span>
      )}
      <span className="flex-1 text-left">{children}</span>
      {endIcon && (
        <span className={cn("shrink-0", isSelected ? "text-primary" : "text-muted-foreground")}>
          {endIcon}
        </span>
      )}
    </button>
  );
}

export { SelectionType, SelectionItem, selectionItemVariants };
