import React from "react";
import { Button } from "@base-ui/react";
import { Upload } from "lucide-react";
import { cn, renderIcon } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import wpMedia, { IWpMedia, IWpMediaData } from "@/lib/WpMedia";
type FileUploadProps = {
  btnText?: string;
  text?: string,
  description?: string,
  onUpload: (file: IWpMedia | IWpMediaData | null) => void,
  icon?: React.ReactNode,
  className?: string,
  variant?: 'button' | 'button-text',
  handlerType?: 'default' | 'custom',
}

function FileUpload( {
  btnText,
  text,
  description, 
  onUpload, 
  icon,
  className, 
  handlerType = 'default', 
  variant = 'button',
}: FileUploadProps ) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging] = React.useState(false);

  const handle = (_e?: React.MouseEvent | React.ChangeEvent) => {
    if (handlerType === 'default') {
      wpMedia( onUpload );
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const Wrapper = (props) => {
    const wrapperClasses = cn( 
      variant === 'button-text' ? 'flex flex-col px-0 py-4 gap-2.5 justify-start rounded-[5px] ring-0! border-none! shadow-none' : 'flex flex-col p-4 gap-2.5 justify-center items-center rounded-[5px] bg-muted! text-center ring-0! border! border-border! border-dashed! shadow-none',
      isDragging && 'border-primary bg-primary/10',
      className 
    );

    return (
      <Card 
        className={ wrapperClasses }
      >
        { props.children }
      </Card>
    );
  }

  return (
    <>
      <Wrapper>
        {
          variant === 'button' && (
            <>
              <Button
                className="border! border-border p-[6px_16px] rounded-sm bg-background cursor-pointer"
                onClick={ handle }
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium! text-[14px]! leading-5!">
                    { btnText }
                  </span>
                  {renderIcon(icon || Upload, { size: 16 })}
                </div>
              </Button>

              <p className="text-muted-foreground p-0! m-0! font-normal text-[12px]">
                { description }
              </p>
            </>
          )
        }

        {
          variant === 'button-text' && (
            <div className="flex flex-row gap-2.5">
              <Button
                className="border! border-primary! text-primary! p-[6px_16px] rounded-sm bg-background cursor-pointer"
                onClick={ handle }
              >
                <span className="font-medium! text-[14px]! leading-5!">
                    { btnText }
                  </span>
              </Button>

              <div className="flex flex-col items-start min-w-25">
                <span className="font-medium! text-[14px]! leading-5! text-primary hover:underline cursor-pointer" onClick={ handle }>
                  { text }
                </span>

                <p className="text-muted-foreground p-0! m-0! font-normal text-[12px]">
                  { description }
                </p>
              </div>
            </div>
          )
        }
      </Wrapper>
    </>
  );
}

export {
  FileUpload,
  FileUploadProps,
};