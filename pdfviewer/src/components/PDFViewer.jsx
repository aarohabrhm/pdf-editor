import React, { useEffect, useRef, useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { pdfjsLib } from '../utils/pdfjs';

const PDFViewer = ({
  pdfFile,
  pdfUrl,
  zoom,
  currentPage,
  totalPages,
  onFileUpload,
  onPageChange,
  fileInputRef
}) => {
  const canvasRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);

  useEffect(() => {
    if (!pdfUrl) return;

    // Load the PDF
    const loadPDF = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPDF();
  }, [pdfUrl]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    // Render the current page
    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale: zoom / 100 });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
      } catch (error) {
        console.error('Error rendering page:', error);
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, zoom]);

  return (
    <div className="flex-1 bg-white shadow-lg">
      <div className="h-full flex flex-col">
        {/* Upload Area */}
        {!pdfFile && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload PDF</h3>
                <p className="text-gray-500">Click to browse or drag and drop your PDF file</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={onFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* PDF Viewer */}
        {pdfFile && (
          <>
            {/* Viewer Controls */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div className="flex items-center space-x-4">
                <FileText className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{pdfFile.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onPageChange('prev')}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => onPageChange('next')}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            {/* PDF Display Area */}
            <div className="flex-1 overflow-auto bg-gray-200 p-4">
              <div className="mx-auto" style={{ width: `${zoom}%` }}>
                <canvas
                  ref={canvasRef}
                  className="bg-white shadow-lg"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;