import React from 'react';

const PropertiesPanel = ({ selectedTool }) => {
  return (
    <div className="p-4 border-b">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Properties</h3>
      {selectedTool === 'text' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Font Size</label>
            <input
              type="number"
              defaultValue="12"
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Color</label>
            <input
              type="color"
              defaultValue="#000000"
              className="w-full h-10 border rounded-lg"
            />
          </div>
        </div>
      )}
      {(selectedTool === 'rectangle' || selectedTool === 'circle' || selectedTool === 'line') && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Stroke Color</label>
            <input
              type="color"
              defaultValue="#000000"
              className="w-full h-10 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Stroke Width</label>
            <input
              type="number"
              defaultValue="2"
              min="1"
              max="10"
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesPanel;