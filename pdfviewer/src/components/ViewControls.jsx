import React from 'react';
import { RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

const ViewControls = ({ zoom, onZoomIn, onZoomOut }) => {
  return (
    <div className="p-4 border-b">
      <h3 className="text-sm font-medium text-gray-700 mb-3">View</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Zoom</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onZoomOut}
              className="p-1 rounded hover:bg-gray-100"
              disabled={zoom <= 50}
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-sm w-12 text-center">{zoom}%</span>
            <button
              onClick={onZoomIn}
              className="p-1 rounded hover:bg-gray-100"
              disabled={zoom >= 200}
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>
        <button className="w-full flex items-center justify-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
          <RotateCw className="h-4 w-4" />
          <span className="text-sm">Rotate Page</span>
        </button>
      </div>
    </div>
  );
};

export default ViewControls;