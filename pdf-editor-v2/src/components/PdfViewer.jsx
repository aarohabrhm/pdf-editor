import { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// ✅ Set the correct worker URL from CDN using the installed version
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfViewer({ file }) {
  const containerRef = useRef();

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const typedArray = new Uint8Array(reader.result);
        const pdf = await getDocument({ data: typedArray }).promise;

        // Clear any previous PDF renderings
        containerRef.current.innerHTML = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.2 });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport }).promise;
          containerRef.current.appendChild(canvas);
        }
      } catch (err) {
        console.error('Error rendering PDF:', err);
      }
    };

    reader.readAsArrayBuffer(file); // ✅ Correct usage here
  }, [file]);

  return <div ref={containerRef} className="p-4 overflow-auto max-h-screen" />;
}
