import React from "react";
import { File, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn, renderIcon } from "@/lib/utils";

type FileViewProps = {
  fileType?: 'image' | 'file',
  fileName: string,
  imageUrl?: string,
  fileSize: string,
  onRemove?: () => void
  icon?: React.ReactNode | React.ElementType
  removeIcon?: React.ReactNode | React.ElementType
  className?: string
  closeBtnClassName?: string
  fileInfoClassName?: string
  fileNameClassName?: string
  fileSizeClassName?: string
  infoWrapperClassName?: string
  fileWrapperClassName?: string
  fileClassName?: string
}
function FileView({ fileType = 'file', fileName, fileSize, imageUrl = '', onRemove, icon, removeIcon, className, closeBtnClassName, fileInfoClassName, fileNameClassName, fileSizeClassName, infoWrapperClassName, fileWrapperClassName, fileClassName }: FileViewProps) {
  return (
    <Card className={cn( 'flex flex-row items-center justify-between h-21.5 w-auto rounded-[5px] bg-muted! ring-0! border-none! shadow-none py-0! px-5!', className )}>
      <div className={ cn( 'flex flex-row gap-3', infoWrapperClassName ) }>
        <div className={ cn( 'flex h-8.5 w-8.5 items-center justify-center rounded-[5px] bg-primary text-primary-foreground', fileWrapperClassName ) }>
          {
            fileType === 'image' ? <img src={ imageUrl } alt={ fileName } className={ cn( 'h-full w-full object-cover rounded-[5px]', fileClassName ) } /> : renderIcon(icon || File, { size: 20, className: fileClassName })
          }
        </div>
        <div className={ cn( 'flex-1 flex flex-col gap-1 min-w-0', fileInfoClassName ) }>
          <p className={ cn( 'text-[13px] font-semibold truncate p-0! m-0! leading-none!', fileNameClassName ) }>
            { fileName }
          </p>
          <p className={ cn( 'text-[12px] font-normal text-muted-foreground p-0! m-0! leading-none!', fileSizeClassName ) }>
            { fileSize }
          </p>
        </div>
      </div>
      {
        onRemove && (
          <button
            onClick={ ( e ) => {
              e.preventDefault();
              onRemove();
            } }
            className={cn( 'flex items-center justify-center w-8 h-8 rounded-full hover:bg-destructive/10 transition-colors cursor-pointer border-0 bg-transparent text-muted-foreground hover:text-destructive', closeBtnClassName ) }
            aria-label='Remove'
          >
            {renderIcon(removeIcon || X, { size: 20 })}
          </button>
        )
      }
    </Card>
  );
}
export {
  FileView,
  FileViewProps,
}