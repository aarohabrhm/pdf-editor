import React from 'react';
import ToolSection from './ToolSection.jsx';
import ViewControls from './ViewControls.jsx';
import PropertiesPanel from './PropertiesPanel.jsx';
import ActionButtons from './ActionButtons.jsx';

const EditingPanel = ({
  selectedTool,
  setSelectedTool,
  zoom,
  onZoomIn,
  onZoomOut,
  fileInputRef
}) => {
  return (
    <div className="w-80 bg-white shadow-lg border-l">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">PDF Editor</h2>
        </div>

        {/* Tools Section */}
        <ToolSection
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
        />

        {/* View Controls */}
        <ViewControls
          zoom={zoom}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
        />

        {/* Properties Panel */}
        <PropertiesPanel selectedTool={selectedTool} />

        {/* Actions */}
        <ActionButtons fileInputRef={fileInputRef} />
      </div>
    </div>
  );
};

export default EditingPanel;