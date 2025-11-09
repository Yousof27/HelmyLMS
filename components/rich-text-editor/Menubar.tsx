import { type Editor } from "@tiptap/react";
import { Toggle } from "../ui/toggle";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Italic,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  Underline,
  Undo,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";

interface MenubarProps {
  editor: Editor | null;
}

export function Menubar({ editor }: MenubarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="border border-b-input border-t-0 border-l-0 border-r-0 bg-background px-3 py-2">
      <div className="flex items-center space-x-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size={"sm"}
              pressed={editor.isActive("bold")}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "bg-accent! text-accent-foreground!" : ""}
            >
              <Bold />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Bold</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("italic")}
              onPressedChange={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "bg-accent! text-accent-foreground!" : ""}
            >
              <Italic />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Italic</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("underline")}
              onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "bg-accent! text-accent-foreground!" : ""}
            >
              <Underline />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Underline</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("strike")}
              onPressedChange={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "bg-accent! text-accent-foreground!" : ""}
            >
              <Strikethrough />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Strike</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 1 })}
              onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive("heading", { level: 1 }) ? "bg-accent! text-accent-foreground!" : ""}
            >
              <Heading1Icon className="size-5" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Heading 1</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 2 })}
              onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive("heading", { level: 2 }) ? "bg-accent! text-accent-foreground!" : ""}
            >
              <Heading2Icon className="size-5" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Heading 2</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 3 })}
              onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={editor.isActive("heading", { level: 3 }) ? "bg-accent! text-accent-foreground!" : ""}
            >
              <Heading3Icon className="size-5" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Heading 3</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("bulletList")}
              onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "bg-accent! text-accent-foreground!" : ""}
            >
              <List />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Bullet List</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("orderedList")}
              onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "bg-accent! text-accent-foreground!" : ""}
            >
              <ListOrdered />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Ordered List</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-2"></div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive({ TextAlign: "left" })}
              onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
              className={editor.isActive({ TextAlign: "left" }) ? "bg-accent! text-accent-foreground!" : ""}
            >
              <AlignLeft />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Left Alignment</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive({ TextAlign: "center" })}
              onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
              className={editor.isActive({ TextAlign: "center" }) ? "bg-accent! text-accent-foreground!" : ""}
            >
              <AlignCenter />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Center Alignment</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive({ TextAlign: "right" })}
              onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
              className={editor.isActive({ TextAlign: "right" }) ? "bg-accent! text-accent-foreground!" : ""}
            >
              <AlignRight />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Right Alignment</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-2"></div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size={"sm"} variant={"ghost"} type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
              <Undo />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size={"sm"} variant={"ghost"} type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
              <Redo />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
