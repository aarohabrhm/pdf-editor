import React, { useState, useRef } from 'react';
import PDFViewer from './PDFViewer';
import EditingPanel from './EditingPanel';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFEditor = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTool, setSelectedTool] = useState('move');
  const [annotations, setAnnotations] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    } else {
      alert('Please upload a valid PDF file');
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  
  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Pane - PDF Viewer */}
      <PDFViewer
        pdfFile={pdfFile}
        pdfUrl={pdfUrl}
        zoom={zoom}
        currentPage={currentPage}
        totalPages={totalPages}
        onFileUpload={handleFileUpload}
        onPageChange={handlePageChange}
        fileInputRef={fileInputRef}
      />

      {/* Right Pane - Editing Tools */}
      <EditingPanel
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        fileInputRef={fileInputRef}
      />
    </div>
  );
};

export default PDFEditor;