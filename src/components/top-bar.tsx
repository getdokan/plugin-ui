import React from "react";
import { cn } from "@/lib/utils";
import { Badge, Button } from "@/components/ui";
import { CrownIcon } from "@/components/crown-icon";
import { Separator } from "@base-ui/react";
import { renderIcon } from "@/lib/utils";

type TopBarVersion = {
  version: string;
  isPro: boolean;
  proBadgeBg?: string;
  proBadgeColor?: string;
  proBadgeBorderColor?: string;
  className?: string;
  icon?: React.ReactNode;
}

type TopBarProps = {
  logo: React.ReactNode;
  versions?: Array<TopBarVersion>;
  className?: string;
  rightSideComponents?: React.ReactNode;
}

function TopBar({className, logo, versions = [], rightSideComponents = <></>}: TopBarProps) {
  return (
    <div className={ cn( 'max-h-16.5 w-full px-5 py-3.25 md:py-5 bg-background flex flex-row justify-between', className ) }>
      {/*Logo and version*/}
      <div className="flex flex-col md:flex-row h-10 md:h-7.5 gap-1 md:gap-6.25">
        <div className="h-4.75 md:h-7.5">
          { logo ?? '' }
        </div>
        <div className="h-4.25 md:h-full w-auto flex flex-row items-center gap-2.5 mt-0">
          {
            versions.map(({version, isPro, className, icon, proBadgeBg = '#FFBC00', proBadgeColor = '#000000', proBadgeBorderColor = '#F2A200'}, index) => {
              let Component = <></>;
              if ( isPro ) {
                Component = (
                  <Badge variant="outline" className={ cn( 'h-full p-0 md:px-2 md:py-0.5 md:pr-px flex flex-row items-center border-none! md:border! md:border-solid!', className ) }>
                    <span>{version}</span>
                    <span className="h-4 w-4 md:h-6.5 md:w-6.5 flex justify-center items-center rounded-full" style={{backgroundColor: proBadgeBg, color: proBadgeColor, border: '1px solid',borderColor: proBadgeBorderColor}}>
                    {renderIcon(icon || CrownIcon, { className: "text-card-foreground text-[10px] md:text-[14px]" })}
                  </span>
                  </Badge>
                );
              } else {
                Component = (
                  <Badge variant="outline" className={ cn( 'h-full border-none! md:border! md:border-solid! p-0 md:px-2 md:py-0.5', className ) }>
                    {version}
                  </Badge>
                );
              }

              return <>
              { Component }
              {
                versions.length - 1 !== index && <Separator orientation="vertical" className="w-px! h-full! md:hidden! bg-muted-foreground!" />
              }
              </>
            })
          }
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-10 md:h-7.5 gap-1 md:gap-6.25">
        <div className="h-full w-auto flex flex-row items-center gap-2.5">
          { rightSideComponents }
        </div>
      </div>
    </div>
  );
}

type TopBarProBtnProps = React.ComponentProps<typeof Button> & {
  className?: string;
  upgradeText?: string;
  icon?: React.ReactNode;
  crownIconProps?: React.ComponentProps<typeof CrownIcon>;
}

const ProBtn = ( { className, children, upgradeText = '', icon, crownIconProps = {}, ...props }: TopBarProBtnProps ) => {
  return (
    <Button variant="outline" className={ cn( 'h-full shadow-none outline-none border! border-solid! text-[14px] text-card-foreground bg-[#FFBC00]', className ) } { ...props }>
      {
        children ? children : <>
          { upgradeText }
          {renderIcon(icon || CrownIcon, crownIconProps)}
        </>
      }
    </Button>
  );
}

TopBar.UpgradeBtn = ProBtn;

export {
  TopBar,
  TopBarProps,
}