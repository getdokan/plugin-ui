import React from "react";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  variant?: 'circle' | 'square';
  children?: React.ReactNode;
  backgroundColor?: string;
}
function Logo({className, variant = 'circle', children, backgroundColor = 'white'}: LogoProps) {
  return (
    <div className={ cn( 'flex justify-center items-center p-2.5', variant === 'circle' ? 'rounded-full w-10 h-10' : 'rounded-[10px] w-13 h-13', className ) } style={{ backgroundColor }}>
      { children }
    </div>
  );
}

export { Logo, type LogoProps };