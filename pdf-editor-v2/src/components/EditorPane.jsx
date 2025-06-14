import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

export default function EditorPane({ text }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: text || 'Loading...',
  });

  useEffect(() => {
    if (editor && text) {
      editor.commands.setContent(text);
    }
  }, [text, editor]);

  return (
    <div className="p-4 border-l overflow-auto max-h-screen w-full">
      <h2 className="text-lg font-semibold mb-2">Editable PDF Text</h2>
      <EditorContent editor={editor} />
    </div>
  );
}
