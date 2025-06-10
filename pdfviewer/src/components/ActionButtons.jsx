import React from 'react';
import { Download, Upload } from 'lucide-react';

const ActionButtons = ({ fileInputRef }) => {
  return (
    <div className="p-4 mt-auto">
      <div className="space-y-2">
        <button className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Upload className="h-4 w-4" />
          <span>Upload New PDF</span>
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
