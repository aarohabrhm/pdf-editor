import { useState } from 'react';
import PdfViewer from './components/PdfViewer';
import EditorPane from './components/EditorPane';
import { extractPdfText } from './utils/extractPdfText';

export default function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      const text = await extractPdfText(file);
      setExtractedText(text);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 overflow-auto bg-gray-100">
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="m-4" />
        {pdfFile && <PdfViewer file={pdfFile} />}
      </div>
      <div className="w-1/2 bg-white">
        <EditorPane text={extractedText} />
      </div>
    </div>
  );
}
