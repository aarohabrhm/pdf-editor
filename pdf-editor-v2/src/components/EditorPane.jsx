import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function EditorPane({ content, onUpdate }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => onUpdate(editor.getHTML()),
  });

  return (
    <div className="p-4 h-full overflow-auto">
      <EditorContent editor={editor} />
    </div>
  );
}
