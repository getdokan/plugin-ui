import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ============================================
   Card Root
   ============================================ */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  ),
);

Card.displayName = "Card";

/* ============================================
   Card Header
   ============================================ */

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  ),
);

CardHeader.displayName = "CardHeader";

/* ============================================
   Card Title
   ============================================ */

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
  className?: string;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  ),
);

CardTitle.displayName = "CardTitle";

/* ============================================
   Card Description
   ============================================ */

export interface CardDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
  className?: string;
}

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

/* ============================================
   Card Content
   ============================================ */

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  ),
);

CardContent.displayName = "CardContent";

/* ============================================
   Card Footer
   ============================================ */

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  ),
);

CardFooter.displayName = "CardFooter";

export default Card;
