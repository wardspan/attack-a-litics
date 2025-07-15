import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { VARIABLES, PLOT_CONFIG } from '../utils/constants';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const PhasePlot = ({ data, loading = false, error = null, height = 500 }) => {
  const plotData = useMemo(() => {
    if (!data || !data.time_series) return [];

    const { time_series } = data;
    const { t, x, y, z, u } = time_series;

    // Create 3D trajectory plot with x, y, z as axes
    return [
      {
        x: x,
        y: y,
        z: z,
        type: 'scatter3d',
        mode: 'lines+markers',
        name: 'System Trajectory',
        line: { 
          color: z.map((val, idx) => idx / z.length), // Color gradient based on time
          colorscale: [
            [0, VARIABLES.x.color],
            [0.33, VARIABLES.y.color],
            [0.66, VARIABLES.z.color],
            [1, VARIABLES.u.color]
          ],
          width: 8,
        },
        marker: {
          size: 4,
          color: z.map((val, idx) => idx / z.length),
          colorscale: [
            [0, VARIABLES.x.color],
            [0.33, VARIABLES.y.color],
            [0.66, VARIABLES.z.color],
            [1, VARIABLES.u.color]
          ],
          showscale: true,
          colorbar: {
            title: 'Time Progress',
            titlefont: { color: '#ffffff' },
            tickfont: { color: '#ffffff' },
            bgcolor: 'rgba(45, 45, 45, 0.8)',
            bordercolor: '#404040',
            borderwidth: 1,
          },
        },
        hovertemplate: '<b>System State</b><br>' +
                      'Defender: %{x:.2f}<br>' +
                      'Attacker: %{y:.2f}<br>' +
                      'Vulnerability: %{z:.2f}<br>' +
                      '<extra></extra>',
      },
      // Add starting point marker
      {
        x: [x[0]],
        y: [y[0]],
        z: [z[0]],
        type: 'scatter3d',
        mode: 'markers',
        name: 'Start',
        marker: {
          size: 12,
          color: VARIABLES.x.color,
          symbol: 'circle',
          line: {
            color: '#ffffff',
            width: 2,
          },
        },
        hovertemplate: '<b>Initial State</b><br>' +
                      'Defender: %{x:.2f}<br>' +
                      'Attacker: %{y:.2f}<br>' +
                      'Vulnerability: %{z:.2f}<br>' +
                      '<extra></extra>',
      },
      // Add ending point marker
      {
        x: [x[x.length - 1]],
        y: [y[y.length - 1]],
        z: [z[z.length - 1]],
        type: 'scatter3d',
        mode: 'markers',
        name: 'End',
        marker: {
          size: 12,
          color: VARIABLES.y.color,
          symbol: 'diamond',
          line: {
            color: '#ffffff',
            width: 2,
          },
        },
        hovertemplate: '<b>Final State</b><br>' +
                      'Defender: %{x:.2f}<br>' +
                      'Attacker: %{y:.2f}<br>' +
                      'Vulnerability: %{z:.2f}<br>' +
                      '<extra></extra>',
      },
    ];
  }, [data]);

  const layout = useMemo(() => ({
    title: {
      text: '3D Phase Space Trajectory',
      font: { color: '#ffffff', size: 20 },
      x: 0.5,
    },
    scene: {
      xaxis: {
        title: { text: 'Defender Capability (x)', font: { color: '#ffffff' } },
        gridcolor: '#404040',
        color: '#ffffff',
        showgrid: true,
        zeroline: false,
        backgroundcolor: '#1a1a1a',
      },
      yaxis: {
        title: { text: 'Attacker Capability (y)', font: { color: '#ffffff' } },
        gridcolor: '#404040',
        color: '#ffffff',
        showgrid: true,
        zeroline: false,
        backgroundcolor: '#1a1a1a',
      },
      zaxis: {
        title: { text: 'System Vulnerability (z)', font: { color: '#ffffff' } },
        gridcolor: '#404040',
        color: '#ffffff',
        showgrid: true,
        zeroline: false,
        backgroundcolor: '#1a1a1a',
      },
      bgcolor: '#1a1a1a',
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.5 },
        center: { x: 0, y: 0, z: 0 },
        up: { x: 0, y: 0, z: 1 },
      },
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
    hovermode: 'closest',
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
        <p className="text-gray-400">Generating 3D visualization...</p>
      </div>
    </div>
  );

  const ErrorMessage = ({ message }) => (
    <div className="flex items-center justify-center" style={{ height }}>
      <div className="text-center">
        <div className="text-cyber-red mb-2">⚠️</div>
        <p className="text-cyber-red font-medium">Visualization Error</p>
        <p className="text-gray-400 text-sm mt-2">{message}</p>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex items-center justify-center" style={{ height }}>
      <div className="text-center">
        <div className="text-gray-600 mb-2">🎯</div>
        <p className="text-gray-400">3D Phase Space Visualization</p>
        <p className="text-gray-500 text-sm mt-2">
          Run a simulation to see the system trajectory in 3D space
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
        <h3 className="text-lg font-semibold text-white mb-2">3D Phase Space</h3>
        <p className="text-gray-400 text-sm">
          Interactive 3D visualization of the system trajectory. Each point represents the system state at a specific time.
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
      
      {/* Controls Guide */}
      <div className="mt-4 bg-dark-bg rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">3D Controls</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
          <div>
            <div className="font-medium text-gray-400">Rotate</div>
            <div>Click and drag</div>
          </div>
          <div>
            <div className="font-medium text-gray-400">Zoom</div>
            <div>Scroll wheel</div>
          </div>
          <div>
            <div className="font-medium text-gray-400">Pan</div>
            <div>Right-click and drag</div>
          </div>
        </div>
      </div>
      
      {/* Trajectory Analysis */}
      {data && data.time_series && (
        <div className="mt-4 bg-dark-bg rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Trajectory Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-gray-500">Initial State</div>
              <div className="text-white font-medium">
                D: {data.time_series.x[0]?.toFixed(2)}, 
                A: {data.time_series.y[0]?.toFixed(2)}, 
                V: {data.time_series.z[0]?.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Final State</div>
              <div className="text-white font-medium">
                D: {data.time_series.x[data.time_series.x.length - 1]?.toFixed(2)}, 
                A: {data.time_series.y[data.time_series.y.length - 1]?.toFixed(2)}, 
                V: {data.time_series.z[data.time_series.z.length - 1]?.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhasePlot;