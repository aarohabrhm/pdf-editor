import { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

function EditorPage() {
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [pdfText, setPdfText] = useState<string>("");

  // Initialize Tiptap editor
  const editor = useEditor({
    editorProps:{
      attributes:{
        class:"focus:outline-none min-h-screen"
      }
    },
    extensions: [StarterKit],
    content: "<p>Loading PDF content...</p>",
  });

  // Extract styled text from PDF using pdfjs
  const extractTextFromPdf = async (base64Data: string) => {
    try {
      const byteCharacters = atob(base64Data.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);

      const loadingTask = pdfjs.getDocument({ data: byteArray });
      const pdf = await loadingTask.promise;

      let htmlContent = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        let prevY = null;

        for (const item of content.items as any[]) {
          const text = item.str;
          const y = item.transform[5]; // y position
          const fontName = item.fontName?.toLowerCase() || "";

          // Line break if Y position changes significantly (paragraph)
          if (prevY !== null && Math.abs(prevY - y) > 10) {
            htmlContent += "<br /><br />";
          }
          prevY = y;

          // Style bold if detected in fontName
          const isBold = fontName.includes("bold");
          const isItalic = fontName.includes("italic") || fontName.includes("oblique");

          let styledText = text;
          if (isBold) styledText = `<strong>${styledText}</strong>`;
          if (isItalic) styledText = `<em>${styledText}</em>`;

          htmlContent += styledText + " ";
        }

        htmlContent += "<br /><br />"; // Page separator
      }

      setPdfText(htmlContent.trim());
    } catch (error) {
      console.error("Error extracting PDF text:", error);
    }
  };

  // Load and extract PDF
  useEffect(() => {
    const storedPdf = localStorage.getItem("pdf");
    if (storedPdf) {
      setPdfData(storedPdf);
      extractTextFromPdf(storedPdf);
    }
  }, []);

  // Load extracted content into editor
  useEffect(() => {
  if (editor && pdfText) {
    const htmlContent = pdfText
      .split(/\n{2,}/) // split on 2 or more newlines for paragraphs
      .map(para => `<p>${para.replace(/\n/g, '<br />')}</p>`)
      .join("");
    
    editor.commands.setContent(htmlContent);
  }
}, [editor, pdfText]);


  if (!pdfData) {
    return <div className="text-center mt-10">No PDF loaded.</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Left Side: Editor */}
      <div className="w-1/2 p-4 overflow-auto bg-[#FAFBFD] px-4">
        <div className="mb-4 ">
          <h2 className="font-semibold mb-2">Editing Area</h2>
          {editor && (
            <div className="border border-gray-200 p-8 min-h-screen shadow-2xl bg-[#FAFBFD]">
              <EditorContent editor={editor} />
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Live Preview */}
      <div className="w-1/2 p-4 bg-gray-100 overflow-auto">
        <h2 className="font-semibold mb-2">Live Preview</h2>
        <div className="bg-white p-8 rounded shadow-2xl min-h-screen">
          {editor && (
            <div
            dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
            className="prose max-w-none whitespace-pre-wrap break-words"
          />
          )}
        </div>
      </div>
    </div>
  );
}

export default EditorPage;
