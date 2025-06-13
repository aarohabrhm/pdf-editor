import { useState } from 'react';
import PdfUploader from './components/PdfUploader';
import PdfViewer from './components/PdfViewer';
import EditorPane from './components/EditorPane';
import { usePdf } from './hooks/usePdf';

export default function App() {
  const [file, setFile] = useState(null);
  const { text, loading, error } = usePdf(file);
  const [content, setContent] = useState('<p>Edit PDF text here...</p>');

  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 bg-gray-800 text-white text-lg">PDF Editor</header>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r overflow-auto">
          <PdfUploader onLoad={setFile} />
          <PdfViewer file={file} />
          {loading && <p className="p-2">Extracting text...</p>}
          {error && <p className="text-red-500 p-2">{error}</p>}
        </div>
        <div className="w-1/2">
          <EditorPane content={content} onUpdate={setContent} />
        </div>
      </div>
    </div>
  );
}