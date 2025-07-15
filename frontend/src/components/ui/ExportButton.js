import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Image, Loader2 } from 'lucide-react';
import { exportToExcel, exportToCSV, exportVisualizationImage } from '../../utils/exportUtils';

const ExportButton = ({ 
  simulationData, 
  parameters, 
  currentScenario, 
  plotRef,
  filename = 'visualization',
  showExcel = true,
  showCSV = true,
  showImage = true,
  className = ''
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleExport = async (type) => {
    setIsExporting(true);
    setExportType(type);
    
    try {
      switch (type) {
        case 'excel':
          await exportToExcel(simulationData, parameters, currentScenario);
          break;
        case 'csv-timeseries':
          await exportToCSV(simulationData, 'timeSeries');
          break;
        case 'csv-analysis':
          await exportToCSV(simulationData, 'analysis');
          break;
        case 'csv-jacobian':
          await exportToCSV(simulationData, 'jacobian');
          break;
        case 'image-png':
          if (plotRef?.current) {
            await exportVisualizationImage(plotRef.current, filename, 'png');
          }
          break;
        case 'image-svg':
          if (plotRef?.current) {
            await exportVisualizationImage(plotRef.current, filename, 'svg');
          }
          break;
        default:
          throw new Error('Unknown export type');
      }
    } catch (error) {
      console.error('Export failed:', error);
      // You might want to show a toast notification here
    } finally {
      setIsExporting(false);
      setExportType('');
      setShowDropdown(false);
    }
  };

  const exportOptions = [];
  
  if (showExcel && simulationData) {
    exportOptions.push({
      key: 'excel',
      label: 'Excel Report',
      icon: FileSpreadsheet,
      description: 'Complete simulation data and analysis'
    });
  }
  
  if (showCSV && simulationData) {
    exportOptions.push(
      {
        key: 'csv-timeseries',
        label: 'CSV - Time Series',
        icon: FileText,
        description: 'Raw time series data'
      },
      {
        key: 'csv-analysis',
        label: 'CSV - Analysis',
        icon: FileText,
        description: 'Mathematical analysis results'
      },
      {
        key: 'csv-jacobian',
        label: 'CSV - Jacobian',
        icon: FileText,
        description: 'Jacobian matrix data'
      }
    );
  }
  
  if (showImage && plotRef?.current) {
    exportOptions.push(
      {
        key: 'image-png',
        label: 'PNG Image',
        icon: Image,
        description: 'High-quality PNG image'
      },
      {
        key: 'image-svg',
        label: 'SVG Image',
        icon: Image,
        description: 'Scalable vector graphics'
      }
    );
  }

  if (exportOptions.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isExporting}
        className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <>
            <Loader2 size={12} className="animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download size={12} />
            Export
          </>
        )}
      </button>
      
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-300 mb-2 px-2">
              Export Options
            </div>
            {exportOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.key}
                  onClick={() => handleExport(option.key)}
                  disabled={isExporting}
                  className="w-full flex items-center gap-3 px-2 py-2 text-left hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon size={16} className="text-gray-400" />
                  <div>
                    <div className="text-sm text-white font-medium">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-400">
                      {option.description}
                    </div>
                  </div>
                  {isExporting && exportType === option.key && (
                    <Loader2 size={12} className="animate-spin ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default ExportButton;