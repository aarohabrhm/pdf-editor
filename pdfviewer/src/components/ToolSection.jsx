import React from 'react';
import { Move, Type, Square, Circle, Minus } from 'lucide-react';

const ToolSection = ({ selectedTool, setSelectedTool }) => {
  const tools = [
    { id: 'move', icon: Move, label: 'Move' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'line', icon: Minus, label: 'Line' }
  ];

  return (
    <div className="p-4 border-b">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Tools</h3>
      <div className="grid grid-cols-2 gap-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                selectedTool === tool.id
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{tool.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ToolSection;