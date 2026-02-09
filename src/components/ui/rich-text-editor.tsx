import * as React from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Quote,
  List,
  ListOrdered,
  AlignLeft,
  Link,
  Image,
  MoreHorizontal,
  Undo,
  Redo,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  variant?: "full" | "simple";
}

function RichTextEditor({
  defaultValue = "",
  placeholder = "Start typing...",
  className = "",
  variant = "full",
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = React.useState("14 px");
  const [fontFamily, setFontFamily] = React.useState("Sans Serif");
  const [textStyle, setTextStyle] = React.useState("Paragraph");

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value.replace(" px", "");
    setFontSize(e.target.value);
    executeCommand("fontSize", "7");
    const fontElements = editorRef.current?.querySelectorAll("font[size='7']");
    fontElements?.forEach((element) => {
      element.removeAttribute("size");
      (element as HTMLElement).style.fontSize = size + "px";
    });
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontFamily(e.target.value);
    const fontMap: { [key: string]: string } = {
      "Sans Serif": "ui-sans-serif, system-ui, sans-serif",
      Serif: "ui-serif, Georgia, serif",
      Monospace: "ui-monospace, monospace",
    };
    executeCommand(
      "fontName",
      fontMap[e.target.value] || fontMap["Sans Serif"],
    );
  };

  const handleTextStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTextStyle(e.target.value);
    const formatMap: { [key: string]: string } = {
      Paragraph: "p",
      "Heading 1": "h1",
      "Heading 2": "h2",
      "Heading 3": "h3",
    };
    executeCommand("formatBlock", formatMap[e.target.value] || "p");
  };

  return (
    <div
      className={cn(
        "w-full rounded-md border border-input bg-background",
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-border px-3 py-2 flex-wrap">
        {variant === "simple" && (
          <>
            <button
              type="button"
              className="p-1.5 hover:bg-muted rounded"
              title="AI Assist"
            >
              <Sparkles className="size-4" />
            </button>
            <div className="w-px h-6 bg-border mx-1" />
          </>
        )}

        <select
          className="text-sm px-2 py-1 rounded border-0 bg-transparent hover:bg-muted cursor-pointer"
          value={textStyle}
          onChange={handleTextStyleChange}
        >
          <option>Paragraph</option>
          <option>Heading 1</option>
          <option>Heading 2</option>
          {variant === "full" && <option>Heading 3</option>}
        </select>

        <select
          className="text-sm px-2 py-1 rounded border-0 bg-transparent hover:bg-muted cursor-pointer"
          value={fontFamily}
          onChange={handleFontFamilyChange}
        >
          <option>Sans Serif</option>
          <option>Serif</option>
          {variant === "full" && <option>Monospace</option>}
        </select>

        {variant === "full" && (
          <select
            className="text-sm px-2 py-1 rounded border-0 bg-transparent hover:bg-muted cursor-pointer"
            value={fontSize}
            onChange={handleFontSizeChange}
          >
            <option>12 px</option>
            <option>14 px</option>
            <option>16 px</option>
            <option>18 px</option>
          </select>
        )}

        <div className="w-px h-6 bg-border mx-1" />

        <button
          type="button"
          className="p-1.5 hover:bg-muted rounded"
          title="Bold"
          onClick={() => executeCommand("bold")}
        >
          <Bold className="size-4" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-muted rounded"
          title="Italic"
          onClick={() => executeCommand("italic")}
        >
          <Italic className="size-4" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-muted rounded"
          title="Underline"
          onClick={() => executeCommand("underline")}
        >
          <Underline className="size-4" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-muted rounded"
          title="Strikethrough"
          onClick={() => executeCommand("strikeThrough")}
        >
          <Strikethrough className="size-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          type="button"
          className="p-1.5 hover:bg-muted rounded"
          title="Quote"
          onClick={() => executeCommand("formatBlock", "blockquote")}
        >
          <Quote className="size-4" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:bg-muted rounded"
          title="Bullet List"
          onClick={() => executeCommand("insertUnorderedList")}
        >
          <List className="size-4" />
        </button>
        {variant === "simple" && (
          <button
            type="button"
            className="p-1.5 hover:bg-muted rounded"
            title="Numbered List"
            onClick={() => executeCommand("insertOrderedList")}
          >
            <ListOrdered className="size-4" />
          </button>
        )}
        <button
          type="button"
          className="p-1.5 hover:bg-muted rounded"
          title="Align Left"
          onClick={() => executeCommand("justifyLeft")}
        >
          <AlignLeft className="size-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          type="button"
          className="p-1.5 hover:bg-muted rounded"
          title="Link"
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url) executeCommand("createLink", url);
          }}
        >
          <Link className="size-4" />
        </button>

        {variant === "full" && (
          <>
            <button
              type="button"
              className="p-1.5 hover:bg-muted rounded"
              title="Image"
              onClick={() => {
                const url = prompt("Enter image URL:");
                if (url) executeCommand("insertImage", url);
              }}
            >
              <Image className="size-4" />
            </button>

            <div className="w-px h-6 bg-border mx-1" />

            <button
              type="button"
              className="p-1.5 hover:bg-muted rounded"
              title="Undo"
              onClick={() => executeCommand("undo")}
            >
              <Undo className="size-4" />
            </button>
            <button
              type="button"
              className="p-1.5 hover:bg-muted rounded"
              title="Redo"
              onClick={() => executeCommand("redo")}
            >
              <Redo className="size-4" />
            </button>

            <button
              type="button"
              className="p-1.5 hover:bg-muted rounded ml-auto"
              title="More"
            >
              <MoreHorizontal className="size-4" />
            </button>
          </>
        )}
      </div>

      {/* Content Area */}
      <div
        className="relative resize-y overflow-auto min-h-[100px]"
        style={{ maxHeight: "500px" }}
      >
        <div
          ref={editorRef}
          contentEditable
          className="w-full h-full px-3 py-2 text-sm outline-none bg-transparent prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: defaultValue }}
          suppressContentEditableWarning
          data-placeholder={placeholder}
          onInput={(e) => {
            if (e.currentTarget.textContent?.trim() === "") {
              e.currentTarget.innerHTML = "";
            }
          }}
          style={{
            minHeight: variant === "full" ? "100px" : "120px",
          }}
        />
        <button
          type="button"
          className="absolute bottom-2 right-2 p-1.5 hover:bg-muted rounded"
        >
          <Sparkles className="size-4 text-muted-foreground" />
        </button>
      </div>

      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
        }
        [contenteditable]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}

export { RichTextEditor, type RichTextEditorProps };
