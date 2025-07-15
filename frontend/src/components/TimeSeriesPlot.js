import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { VARIABLES, PLOT_CONFIG } from '../utils/constants';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const TimeSeriesPlot = ({ data, loading = false, error = null, height = 500 }) => {
  const plotData = useMemo(() => {
    if (!data || !data.time_series) return [];

    const { time_series } = data;
    const { t, x, y, z, u } = time_series;

    return [
      {
        x: t,
        y: x,
        type: 'scatter',
        mode: 'lines',
        name: VARIABLES.x.name,
        line: { 
          color: VARIABLES.x.color, 
          width: 3,
          shape: 'spline',
          smoothing: 0.3
        },
        hovertemplate: '<b>%{fullData.name}</b><br>' +
                      'Time: %{x:.2f}h<br>' +
                      'Value: %{y:.2f}<br>' +
                      '<extra></extra>',
      },
      {
        x: t,
        y: y,
        type: 'scatter',
        mode: 'lines',
        name: VARIABLES.y.name,
        line: { 
          color: VARIABLES.y.color, 
          width: 3,
          shape: 'spline',
          smoothing: 0.3
        },
        hovertemplate: '<b>%{fullData.name}</b><br>' +
                      'Time: %{x:.2f}h<br>' +
                      'Value: %{y:.2f}<br>' +
                      '<extra></extra>',
      },
      {
        x: t,
        y: z,
        type: 'scatter',
        mode: 'lines',
        name: VARIABLES.z.name,
        line: { 
          color: VARIABLES.z.color, 
          width: 3,
          shape: 'spline',
          smoothing: 0.3
        },
        hovertemplate: '<b>%{fullData.name}</b><br>' +
                      'Time: %{x:.2f}h<br>' +
                      'Value: %{y:.2f}<br>' +
                      '<extra></extra>',
      },
      {
        x: t,
        y: u,
        type: 'scatter',
        mode: 'lines',
        name: VARIABLES.u.name,
        line: { 
          color: VARIABLES.u.color, 
          width: 3,
          shape: 'spline',
          smoothing: 0.3
        },
        hovertemplate: '<b>%{fullData.name}</b><br>' +
                      'Time: %{x:.2f}h<br>' +
                      'Value: %{y:.2f}<br>' +
                      '<extra></extra>',
      },
    ];
  }, [data]);

  const layout = useMemo(() => ({
    title: {
      text: 'Cyber Conflict Dynamics Over Time',
      font: { color: '#ffffff', size: 20 },
      x: 0.5,
    },
    xaxis: {
      title: { text: 'Time (hours)', font: { color: '#ffffff' } },
      gridcolor: '#404040',
      color: '#ffffff',
      showgrid: true,
      zeroline: false,
    },
    yaxis: {
      title: { text: 'Capability / Vulnerability Level', font: { color: '#ffffff' } },
      gridcolor: '#404040',
      color: '#ffffff',
      showgrid: true,
      zeroline: false,
    },
    plot_bgcolor: '#1a1a1a',
    paper_bgcolor: '#2d2d2d',
    font: { color: '#ffffff' },
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(45, 45, 45, 0.8)',
      bordercolor: '#404040',
      borderwidth: 1,
      font: { color: '#ffffff' },
    },
    hovermode: 'x unified',
    hoverlabel: {
      bgcolor: '#2d2d2d',
      bordercolor: '#404040',
      font: { color: '#ffffff' },
    },
    margin: { l: 60, r: 60, t: 60, b: 60 },
  }), []);

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center" style={{ height }}>
      <div className="text-center">
        <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
        <p className="text-gray-400">Running simulation...</p>
      </div>
    </div>
  );

  const ErrorMessage = ({ message }) => (
    <div className="flex items-center justify-center" style={{ height }}>
      <div className="text-center">
        <div className="text-cyber-red mb-2">⚠️</div>
        <p className="text-cyber-red font-medium">Simulation Error</p>
        <p className="text-gray-400 text-sm mt-2">{message}</p>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex items-center justify-center" style={{ height }}>
      <div className="text-center">
        <div className="text-gray-600 mb-2">📊</div>
        <p className="text-gray-400">Run a simulation to see the results</p>
        <p className="text-gray-500 text-sm mt-2">
          Adjust parameters and click "Run Simulation" to visualize the cyber conflict dynamics
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="card">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!data || !data.time_series) {
    return (
      <div className="card">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Time Series Analysis</h3>
        <p className="text-gray-400 text-sm">
          Evolution of system variables over time. Each line represents a different component of the cyber conflict.
        </p>
      </div>
      
      <div className="bg-dark-bg rounded-lg p-2">
        <Plot
          data={plotData}
          layout={layout}
          config={PLOT_CONFIG}
          style={{ width: '100%', height: `${height}px` }}
          useResizeHandler={true}
        />
      </div>
      
      {/* Variable Legend */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(VARIABLES).map(([key, variable]) => (
          <div key={key} className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: variable.color }}
            />
            <div>
              <div className="text-sm font-medium text-white">{variable.name}</div>
              <div className="text-xs text-gray-500">{variable.symbol}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Data Summary */}
      {data && data.time_series && (
        <div className="mt-4 bg-dark-bg rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Data Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-gray-500">Data Points</div>
              <div className="text-white font-medium">{data.time_series.t.length}</div>
            </div>
            <div>
              <div className="text-gray-500">Time Span</div>
              <div className="text-white font-medium">{data.metadata?.simulation_time || 'N/A'}h</div>
            </div>
            <div>
              <div className="text-gray-500">Resolution</div>
              <div className="text-white font-medium">{data.metadata?.resolution || 'N/A'}s</div>
            </div>
            <div>
              <div className="text-gray-500">Solver</div>
              <div className="text-white font-medium">{data.metadata?.solver_method || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSeriesPlot;