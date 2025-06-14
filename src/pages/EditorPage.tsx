import { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";
import { Toolbar } from "./Toolbar";


pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

function EditorPage() {
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [pdfText, setPdfText] = useState<string>("");

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-screen"
      }
    },
    extensions: [
      StarterKit,
      BulletList,
      Heading,
      Document,
      Paragraph,
      Text,
      HardBreak,
      ListItem,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "<p></p>",
  });

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
        htmlContent += `<div class="pdf-page border border-dashed border-gray-300 p-4 my-6">`;

        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        let prevY = null;
        let currentParagraph = "";

        for (const item of content.items as any[]) {
          const text = item.str;
          const transform = item.transform;
          const y = transform[5];
          const fontSize = Math.floor(transform[0]);
          const fontName = item.fontName?.toLowerCase() || "";

          const isBold = fontName.includes("bold");
          const isItalic = fontName.includes("italic") || fontName.includes("oblique");

          let tag = "span";
          if (fontSize >= 22) tag = "h1";
          else if (fontSize >= 18) tag = "h2";
          else if (fontSize >= 14) tag = "h3";

          let styledText = text;
          if (isBold) styledText = `<strong>${styledText}</strong>`;
          if (isItalic) styledText = `<em>${styledText}</em>`;

          if (tag !== "span") {
            styledText = `<${tag}>${styledText}</${tag}>`;
          }

          if (prevY !== null && Math.abs(prevY - y) > 12) {
            if (currentParagraph.trim()) {
              htmlContent += `<p>${currentParagraph.trim()}</p>`;
              currentParagraph = "";
            }
          }

          prevY = y;
          currentParagraph += styledText + " ";
        }

        if (currentParagraph.trim()) {
          htmlContent += `<p>${currentParagraph.trim()}</p>`;
        }

        htmlContent += `</div>`;
      }

      setPdfText(htmlContent.trim());
    } catch (error) {
      console.error("Error extracting PDF text:", error);
    }
  };

  useEffect(() => {
    const storedPdf = localStorage.getItem("pdf");
    if (storedPdf) {
      setPdfData(storedPdf);
      extractTextFromPdf(storedPdf);
    }
  }, []);

  useEffect(() => {
    if (editor && pdfText) {
      editor.commands.setContent(pdfText);
    }
  }, [editor, pdfText]);

  const handleExport = async () => {
  const sourceElement = document.getElementById("pdf-preview");
  if (!sourceElement) return;

  try {
    
    // Clone the preview node to avoid affecting the UI
    const clone = sourceElement.cloneNode(true) as HTMLElement;

    // Replace unsupported oklch(...) colors in the clone
    const allElements = clone.querySelectorAll("*");
    allElements.forEach((el) => {
      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor;
      const color = style.color;

      if (bg.includes("oklch")) {
        (el as HTMLElement).style.backgroundColor = "white";
      }
      if (color.includes("oklch")) {
        (el as HTMLElement).style.color = "black";
      }
    });

    // Add to hidden container
    const hiddenContainer = document.createElement("div");
    hiddenContainer.style.position = "fixed";
    hiddenContainer.style.top = "-9999px";
    hiddenContainer.style.left = "-9999px";
    hiddenContainer.style.zIndex = "-1";
    hiddenContainer.appendChild(clone);
    document.body.appendChild(hiddenContainer);

    // Convert to canvas
    const canvas = await html2canvas(clone, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("edited.pdf");

    // Cleanup
    document.body.removeChild(hiddenContainer);
  } catch (err) {
    console.error("Export failed:", err);
  }
};




  if (!pdfData) {
    return <div className="text-center mt-10">No PDF loaded.</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Left Side: Editor */}
      <div className="w-1/2 p-4 overflow-auto bg-[#FAFBFD] px-4">
        <div className="mb-4">
          <Toolbar editor={editor} />
          {editor && (
            <div className="border border-gray-200 p-8 min-h-screen shadow-2xl bg-[#FAFBFD]">
              <EditorContent editor={editor} />
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Live Preview */}
      <div className="w-1/2 p-4 bg-gray-100 overflow-auto">
        <h2 className="font-semibold mb-2">Preview</h2>
        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 float-right mb-4"
        >
          Export as PDF
        </button>
        <div className="bg-white p-8 rounded shadow-2xl min-h-screen" id="pdf-preview">
          {editor && (
            <div
              className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default EditorPage;
