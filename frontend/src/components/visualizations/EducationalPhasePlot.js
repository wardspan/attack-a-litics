import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Compass, Info, Eye, RotateCcw, Target, PlayCircle } from 'lucide-react';
import { VARIABLES, PLOT_CONFIG } from '../../utils/constants';
import { CONCEPT_EXPLANATIONS } from '../../utils/explanationData';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const EducationalPhasePlot = ({ 
  data, 
  loading, 
  error, 
  height = 400, 
  className = "" 
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAxes, setSelectedAxes] = useState({ x: 'x', y: 'y', z: 'z' });
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [showPoints, setShowPoints] = useState(false);

  const plotData = useMemo(() => {
    if (!data?.time_series) return [];

    const { time_series } = data;
    const { t } = time_series;
    
    const xData = time_series[selectedAxes.x];
    const yData = time_series[selectedAxes.y];
    const zData = time_series[selectedAxes.z];
    
    const traces = [];
    
    // Main trajectory
    if (showTrajectory) {
      traces.push({
        x: xData,
        y: yData,
        z: zData,
        type: 'scatter3d',
        mode: 'lines',
        name: 'Trajectory',
        line: {
          color: t.map((time, i) => i / (t.length - 1)), // Color gradient based on time
          colorscale: 'Viridis',
          width: 4,
          showscale: true,
          colorbar: {
            title: 'Time Progress',
            titlefont: { color: '#ffffff' },
            tickfont: { color: '#ffffff' },
            len: 0.7,
            thickness: 15,
            x: 1.02
          }
        },
        hovertemplate: 
          `<b>Phase Point</b><br>` +
          `${VARIABLES[selectedAxes.x]?.name || selectedAxes.x}: %{x:.2f}<br>` +
          `${VARIABLES[selectedAxes.y]?.name || selectedAxes.y}: %{y:.2f}<br>` +
          `${VARIABLES[selectedAxes.z]?.name || selectedAxes.z}: %{z:.2f}<br>` +
          `<extra></extra>`
      });
    }
    
    // Start point
    traces.push({
      x: [xData[0]],
      y: [yData[0]],
      z: [zData[0]],
      type: 'scatter3d',
      mode: 'markers',
      name: 'Start',
      marker: {
        color: '#2ed573',
        size: 8,
        symbol: 'circle',
        line: { color: '#ffffff', width: 2 }
      },
      hovertemplate: 
        `<b>Starting Point</b><br>` +
        `${VARIABLES[selectedAxes.x]?.name || selectedAxes.x}: %{x:.2f}<br>` +
        `${VARIABLES[selectedAxes.y]?.name || selectedAxes.y}: %{y:.2f}<br>` +
        `${VARIABLES[selectedAxes.z]?.name || selectedAxes.z}: %{z:.2f}<br>` +
        `<extra></extra>`
    });
    
    // End point
    const endIndex = xData.length - 1;
    traces.push({
      x: [xData[endIndex]],
      y: [yData[endIndex]],
      z: [zData[endIndex]],
      type: 'scatter3d',
      mode: 'markers',
      name: 'End',
      marker: {
        color: '#ff4757',
        size: 8,
        symbol: 'diamond',
        line: { color: '#ffffff', width: 2 }
      },
      hovertemplate: 
        `<b>End Point</b><br>` +
        `${VARIABLES[selectedAxes.x]?.name || selectedAxes.x}: %{x:.2f}<br>` +
        `${VARIABLES[selectedAxes.y]?.name || selectedAxes.y}: %{y:.2f}<br>` +
        `${VARIABLES[selectedAxes.z]?.name || selectedAxes.z}: %{z:.2f}<br>` +
        `<extra></extra>`
    });
    
    // Optional: show all points
    if (showPoints) {
      traces.push({
        x: xData,
        y: yData,
        z: zData,
        type: 'scatter3d',
        mode: 'markers',
        name: 'All Points',
        marker: {
          color: t.map((time, i) => i / (t.length - 1)),
          colorscale: 'Viridis',
          size: 3,
          opacity: 0.6
        },
        showlegend: false,
        hovertemplate: 
          `<b>Time: %{text:.1f}h</b><br>` +
          `${VARIABLES[selectedAxes.x]?.name || selectedAxes.x}: %{x:.2f}<br>` +
          `${VARIABLES[selectedAxes.y]?.name || selectedAxes.y}: %{y:.2f}<br>` +
          `${VARIABLES[selectedAxes.z]?.name || selectedAxes.z}: %{z:.2f}<br>` +
          `<extra></extra>`,
        text: t
      });
    }
    
    return traces;
  }, [data, selectedAxes, showTrajectory, showPoints]);

  const layout = useMemo(() => ({
    title: {
      text: '3D Phase Space Visualization',
      font: { 
        color: '#ffffff', 
        size: 16,
        family: 'Inter, system-ui, sans-serif'
      }
    },
    scene: {
      xaxis: {
        title: { 
          text: VARIABLES[selectedAxes.x]?.name || selectedAxes.x,
          font: { size: 14, color: '#ffffff' }
        },
        color: '#ffffff',
        gridcolor: '#374151',
        zeroline: false,
        backgroundcolor: 'rgba(0,0,0,0)',
        tickfont: { size: 11, color: '#ffffff' }
      },
      yaxis: {
        title: { 
          text: VARIABLES[selectedAxes.y]?.name || selectedAxes.y,
          font: { size: 14, color: '#ffffff' }
        },
        color: '#ffffff',
        gridcolor: '#374151',
        zeroline: false,
        backgroundcolor: 'rgba(0,0,0,0)',
        tickfont: { size: 11, color: '#ffffff' }
      },
      zaxis: {
        title: { 
          text: VARIABLES[selectedAxes.z]?.name || selectedAxes.z,
          font: { size: 14, color: '#ffffff' }
        },
        color: '#ffffff',
        gridcolor: '#374151',
        zeroline: false,
        backgroundcolor: 'rgba(0,0,0,0)',
        tickfont: { size: 11, color: '#ffffff' }
      },
      bgcolor: 'rgba(0,0,0,0)',
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.5 }
      }
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { 
      family: 'Inter, system-ui, sans-serif',
      size: 12,
      color: '#E5E7EB'
    },
    legend: {
      x: 0,
      y: 1,
      bgcolor: 'rgba(0,0,0,0.8)',
      bordercolor: 'rgba(255,255,255,0.2)',
      borderwidth: 1,
      font: { size: 12, color: '#ffffff' }
    },
    height: height,
    margin: { l: 0, r: 0, t: 40, b: 0 }
  }), [selectedAxes, height]);

  const AxisSelector = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-3">
        Select Variables for Axes
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['x', 'y', 'z'].map(axis => (
          <div key={axis} className="space-y-2">
            <label className="block text-sm text-gray-300 mb-2 font-medium uppercase">
              {axis}-axis
            </label>
            <select
              value={selectedAxes[axis]}
              onChange={(e) => setSelectedAxes(prev => ({ ...prev, [axis]: e.target.value }))}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-200 text-sm"
            >
              {Object.entries(VARIABLES).map(([key, variable]) => (
                <option key={key} value={key}>
                  {variable.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );

  const ViewControls = () => (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => setShowTrajectory(!showTrajectory)}
        className={`text-xs px-3 py-1.5 rounded-md transition-colors border ${
          showTrajectory 
            ? 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30' 
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'
        }`}
      >
        <RotateCcw size={12} className="inline mr-1" />
        <span className="hidden sm:inline">Trajectory</span>
      </button>
      
      <button
        onClick={() => setShowPoints(!showPoints)}
        className={`text-xs px-3 py-1.5 rounded-md transition-colors border ${
          showPoints 
            ? 'bg-cyber-purple/20 text-cyber-purple border-cyber-purple/30' 
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'
        }`}
      >
        <Target size={12} className="inline mr-1" />
        <span className="hidden sm:inline">All Points</span>
      </button>
    </div>
  );

  const PhaseSpaceExplanation = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Info size={16} className="text-cyber-blue" />
        <h3 className="text-white font-semibold">Understanding Phase Space</h3>
      </div>
      
      <div className="text-sm text-gray-300 space-y-3">
        <p>
          Phase space is a powerful way to visualize how dynamic systems evolve over time.
          Instead of plotting variables against time, we plot them against each other.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <h4 className="text-sm font-semibold text-cyber-green mb-2">
              What You're Seeing
            </h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• <strong>Trajectory:</strong> Path the system follows over time</li>
              <li>• <strong>Color gradient:</strong> Blue (start) → Yellow (end)</li>
              <li>• <strong>Green circle:</strong> Starting point</li>
              <li>• <strong>Red diamond:</strong> End point</li>
            </ul>
          </div>
          
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <h4 className="text-sm font-semibold text-cyber-blue mb-2">
              Interpretation Guide
            </h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• <strong>Straight line:</strong> Monotonic change</li>
              <li>• <strong>Curved path:</strong> Complex interactions</li>
              <li>• <strong>Loops:</strong> Oscillatory behavior</li>
              <li>• <strong>Convergence:</strong> Approaching equilibrium</li>
            </ul>
          </div>
        </div>
        
        <div className="p-3 bg-cyber-blue/10 rounded-lg border border-cyber-blue/20">
          <h4 className="text-sm font-semibold text-cyber-blue mb-2">
            Phase Space Insights
          </h4>
          <p className="text-xs text-gray-300">
            The shape and direction of the trajectory reveal important information about 
            system behavior that might not be obvious from time series plots alone.
            Try different axis combinations to explore various aspects of the system dynamics.
          </p>
        </div>
      </div>
    </div>
  );

  const TrajectoryAnalysis = () => {
    if (!data?.time_series) return null;
    
    const { time_series } = data;
    const startIdx = 0;
    const endIdx = time_series.t.length - 1;
    
    const analysis = {
      totalDistance: 0,
      avgSpeed: 0,
      direction: 'unknown'
    };
    
    // Calculate trajectory characteristics
    const xData = time_series[selectedAxes.x];
    const yData = time_series[selectedAxes.y];
    const zData = time_series[selectedAxes.z];
    
    for (let i = 1; i < xData.length; i++) {
      const dx = xData[i] - xData[i-1];
      const dy = yData[i] - yData[i-1];
      const dz = zData[i] - zData[i-1];
      analysis.totalDistance += Math.sqrt(dx*dx + dy*dy + dz*dz);
    }
    
    analysis.avgSpeed = analysis.totalDistance / (time_series.t[endIdx] - time_series.t[startIdx]);
    
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-cyber-green flex items-center gap-2">
          <PlayCircle size={16} />
          Trajectory Analysis
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="text-xs text-gray-400">Total Distance</div>
            <div className="text-sm font-mono text-white">
              {analysis.totalDistance.toFixed(2)} units
            </div>
          </div>
          
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="text-xs text-gray-400">Average Speed</div>
            <div className="text-sm font-mono text-white">
              {analysis.avgSpeed.toFixed(3)} units/h
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-gray-800/50 rounded-lg">
          <div className="text-xs text-gray-400 mb-1">Start → End</div>
          <div className="text-sm font-mono text-white">
            [{xData[startIdx].toFixed(2)}, {yData[startIdx].toFixed(2)}, {zData[startIdx].toFixed(2)}] → [{xData[endIdx].toFixed(2)}, {yData[endIdx].toFixed(2)}, {zData[endIdx].toFixed(2)}]
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`card ${className}`}>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-blue mx-auto mb-2"></div>
          <p className="text-gray-400">Generating 3D phase plot...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`card ${className}`}>
        <div className="p-6 text-center">
          <p className="text-cyber-red">Error loading plot: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`card ${className} phase-space-panel`} style={{ minWidth: '450px' }}>
      <div className="p-6 border-b border-gray-700">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyber-purple/20 rounded-full flex items-center justify-center">
              <Compass size={16} className="text-cyber-purple" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg panel-title">
                3D Phase Space Visualization
              </h3>
              <p className="text-sm text-gray-400">
                3D trajectory of system evolution
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ViewControls />
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs text-cyber-blue hover:text-cyber-blue/80 transition-colors whitespace-nowrap px-3 py-1.5 rounded-md border border-cyber-blue/30 hover:bg-cyber-blue/10"
            >
              {showExplanation ? 'Hide' : 'Show'} explanation
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <AxisSelector />
        </div>
        
        {data ? (
          <div className="w-full" style={{ minHeight: '400px' }}>
            <Plot
              data={plotData}
              layout={layout}
              config={PLOT_CONFIG}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <Compass size={48} className="mx-auto mb-2 opacity-50" />
              <p>Run a simulation to see the phase space visualization</p>
            </div>
          </div>
        )}
      </div>

      {showExplanation && (
        <div className="p-4 border-t border-gray-700 space-y-4">
          <PhaseSpaceExplanation />
          
          {data && <TrajectoryAnalysis />}
          
          <div className="p-3 bg-cyber-purple/10 rounded-lg border border-cyber-purple/20">
            <h4 className="text-sm font-semibold text-cyber-purple mb-2">
              Try Different Combinations
            </h4>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• <strong>Defender vs Attacker:</strong> Shows direct conflict dynamics</li>
              <li>• <strong>Vulnerability vs Intelligence:</strong> Shows information-security relationship</li>
              <li>• <strong>All three:</strong> Complete system state evolution</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationalPhasePlot;