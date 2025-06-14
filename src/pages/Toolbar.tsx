import {
  Undo,
  Redo,
  Bold,
  Italic,
  Strikethrough,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { Toggle } from "@/components/ui/toggle";

type Props = {
  editor: Editor | null;
};

export const Toolbar = ({ editor }: Props) => {
  if (!editor) return null;

  return (
    <div className="flex justify-center items-center gap-1 border border-gray-200 bg-white rounded-3xl px-4 py-1 shadow-sm mb-4 w-fit mx-auto">
      {/* Undo / Redo */}
        <Toggle
        pressed={false}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        >
        <Undo className="w-4 h-4" />
        </Toggle>
        <Toggle
        pressed={false}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        >
        <Redo className="w-4 h-4" />
        </Toggle>
      {/* Headings */}
      <Toggle
        pressed={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="w-4 h-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="w-4 h-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="w-4 h-4" />
      </Toggle>

      {/* Text styles */}
      <Toggle
        pressed={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="w-4 h-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="w-4 h-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="w-4 h-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline?.().run()}
        disabled={!editor.can().chain().focus().toggleUnderline?.().run()}
      >
        <Underline className="w-4 h-4" />
      </Toggle>

      {/* Alignments */}
      <Toggle
        pressed={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="w-4 h-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="w-4 h-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="w-4 h-4" />
      </Toggle>
      <Toggle
        pressed={editor.isActive({ textAlign: 'justify' })}
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <AlignJustify className="w-4 h-4" />
      </Toggle>
    </div>
  );
};
