import {
  Bold,
  Code,
  Italic,
  List,
  ListOrdered,
  SquareCode,
  Strikethrough,
} from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { BsEmojiSmile } from "react-icons/bs";

import Typography from "@/components/ui/typography";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { type Editor } from "@tiptap/react";
import { useTheme } from "next-themes";
import React from "react";

interface MenuBarProps {
  editor: Editor; // Use 'null' in case the editor might be null or undefined
}

function MenuBar({ editor }: MenuBarProps) {
  const { resolvedTheme } = useTheme();
  return (
    <div className="flex items-center flex-wrap gap-2 absolute z-10 top-0 left-0 w-full p-2 bg-neutral-100 dark:bg-neutral-900">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold")
            ? "border border-white"
            : "border border-black"
        }
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic")
            ? " border border-white"
            : " border border-black"
        }
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={
          editor.isActive("strike")
            ? " border border-white"
            : " border border-black"
        }
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      <Typography text="|" variant="h6" className="m-0" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive("bulletList")
            ? " border border-white"
            : " border border-black"
        }
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive("orderedList")
            ? " border border-white"
            : " border border-black"
        }
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <Typography text="|" variant="h6" className="m-0" />
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={
          editor.isActive("code")
            ? " border border-white"
            : " border border-black"
        }
      >
        <Code className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={
          editor.isActive("codeBlock")
            ? " border border-white"
            : " border border-black"
        }
      >
        <SquareCode className="w-4 h-4" />
      </button>
      <Typography text="|" variant="h6" className="m-0" />
      <Popover>
        <PopoverTrigger>
          <button>
            <BsEmojiSmile size={20} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
          <Picker
            theme={resolvedTheme}
            data={data}
            onEmojiSelect={(emoji) =>
              editor.chain().focus().insertContent(emoji.native).run()
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default MenuBar;
