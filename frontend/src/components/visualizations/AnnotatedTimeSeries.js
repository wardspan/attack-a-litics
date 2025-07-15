import React, { useState, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ChevronDown, ChevronUp, Info, TrendingUp, Clock, Eye } from 'lucide-react';
import { VARIABLES, PLOT_CONFIG } from '../../utils/constants';
import { VARIABLE_EXPLANATIONS } from '../../utils/explanationData';
import ExportButton from '../ui/ExportButton';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const AnnotatedTimeSeries = ({ 
  data, 
  loading, 
  error, 
  height = 400, 
  className = "",
  parameters = {},
  currentScenario = null
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const plotRef = useRef(null);

  const plotData = useMemo(() => {
    if (!data?.time_series) return [];

    const { time_series } = data;
    const { t, x, y, z, u } = time_series;

    return [
      {
        x: t,
        y: x,
        type: 'scatter',
        mode: 'lines',
        name: 'Defender Capability',
        line: { color: VARIABLES.x.color, width: 2 },
        hovertemplate: '<b>Defender Capability</b><br>' +
                      'Time: %{x:.1f} hours<br>' +
                      'Value: %{y:.2f}<br>' +
                      '<extra></extra>'
      },
      {
        x: t,
        y: y,
        type: 'scatter',
        mode: 'lines',
        name: 'Attacker Capability',
        line: { color: VARIABLES.y.color, width: 2 },
        hovertemplate: '<b>Attacker Capability</b><br>' +
                      'Time: %{x:.1f} hours<br>' +
                      'Value: %{y:.2f}<br>' +
                      '<extra></extra>'
      },
      {
        x: t,
        y: z,
        type: 'scatter',
        mode: 'lines',
        name: 'System Vulnerability',
        line: { color: VARIABLES.z.color, width: 2 },
        hovertemplate: '<b>System Vulnerability</b><br>' +
                      'Time: %{x:.1f} hours<br>' +
                      'Value: %{y:.2f}<br>' +
                      '<extra></extra>'
      },
      {
        x: t,
        y: u,
        type: 'scatter',
        mode: 'lines',
        name: 'Threat Intelligence',
        line: { color: VARIABLES.u.color, width: 2 },
        hovertemplate: '<b>Threat Intelligence</b><br>' +
                      'Time: %{x:.1f} hours<br>' +
                      'Value: %{y:.2f}<br>' +
                      '<extra></extra>'
      }
    ];
  }, [data]);

  const getAnnotations = useMemo(() => {
    if (!data?.time_series) return [];
    
    const annotations = [];
    const { time_series } = data;
    const { t, x, y, z, u } = time_series;
    
    // Find key events and trends
    const midPoint = Math.floor(t.length / 2);
    const endPoint = t.length - 1;
    
    // Add annotation for crossover points
    for (let i = 1; i < t.length; i++) {
      // Check if defender and attacker capabilities cross
      if ((x[i-1] < y[i-1] && x[i] > y[i]) || (x[i-1] > y[i-1] && x[i] < y[i])) {
        annotations.push({
          x: t[i],
          y: Math.max(x[i], y[i]),
          text: x[i] > y[i] ? 'Defender Advantage' : 'Attacker Advantage',
          showarrow: true,
          arrowhead: 2,
          arrowsize: 1,
          arrowwidth: 2,
          arrowcolor: x[i] > y[i] ? VARIABLES.x.color : VARIABLES.y.color,
          font: { size: 10, color: '#ffffff' },
          bgcolor: 'rgba(0,0,0,0.7)',
          bordercolor: x[i] > y[i] ? VARIABLES.x.color : VARIABLES.y.color,
          borderwidth: 1
        });
      }
    }
    
    // Add final state annotation
    annotations.push({
      x: t[endPoint],
      y: Math.max(x[endPoint], y[endPoint], z[endPoint], u[endPoint]),
      text: 'Final State',
      showarrow: true,
      arrowhead: 2,
      arrowsize: 1,
      arrowwidth: 2,
      arrowcolor: '#60a5fa',
      font: { size: 10, color: '#ffffff' },
      bgcolor: 'rgba(0,0,0,0.7)',
      bordercolor: '#60a5fa',
      borderwidth: 1
    });
    
    return annotations;
  }, [data, showAnnotations]);

  const layout = useMemo(() => ({
    title: {
      text: 'Cyber Conflict Evolution Over Time',
      font: { color: '#ffffff', size: 16 }
    },
    xaxis: {
      title: 'Time (hours)',
      color: '#ffffff',
      gridcolor: '#374151',
      zeroline: false
    },
    yaxis: {
      title: 'Capability Level',
      color: '#ffffff',
      gridcolor: '#374151',
      zeroline: false
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#ffffff' },
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(0,0,0,0.7)',
      bordercolor: '#374151',
      borderwidth: 1
    },
    height: height,
    margin: { l: 60, r: 40, t: 60, b: 60 },
    annotations: showAnnotations && data ? getAnnotations : []
  }), [height, showAnnotations, data, getAnnotations]);

  const getTrendAnalysis = () => {
    if (!data?.time_series) return null;
    
    const { time_series } = data;
    const { t, x, y, z, u } = time_series;
    const start = 0;
    const end = t.length - 1;
    
    const trends = {
      defender: x[end] - x[start],
      attacker: y[end] - y[start],
      vulnerability: z[end] - z[start],
      intelligence: u[end] - u[start]
    };
    
    return trends;
  };

  const VariableExplanation = ({ variable }) => {
    const explanation = VARIABLE_EXPLANATIONS[variable];
    if (!explanation) return null;
    
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-cyber-green">
          {explanation.name}
        </h4>
        
        <p className="text-sm text-gray-300">
          {explanation.realWorld}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <h5 className="text-xs font-semibold text-cyber-green mb-1">
              Examples
            </h5>
            <ul className="text-xs text-gray-400 space-y-1">
              {explanation.examples.map((example, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-cyber-green">•</span>
                  {example}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h5 className="text-xs font-semibold text-cyber-red mb-1">
              Factors that increase it
            </h5>
            <ul className="text-xs text-gray-400 space-y-1">
              {explanation.factors.increases.map((factor, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-cyber-red">↑</span>
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const TrendAnalysis = () => {
    const trends = getTrendAnalysis();
    if (!trends) return null;
    
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-cyber-green flex items-center gap-2">
          <TrendingUp size={16} />
          Trend Analysis
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(trends).map(([key, change]) => {
            const variableKey = key === 'defender' ? 'x' : 
                              key === 'attacker' ? 'y' : 
                              key === 'vulnerability' ? 'z' : 'u';
            const variable = VARIABLES[variableKey];
            
            return (
              <div key={key} className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    {variable.name}
                  </span>
                  <span className={`text-sm font-mono ${
                    change > 0 ? 'text-cyber-red' : 
                    change < 0 ? 'text-cyber-green' : 
                    'text-gray-400'
                  }`}>
                    {change > 0 ? '+' : ''}{change.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {change > 0 ? 'Increased' : change < 0 ? 'Decreased' : 'No change'} over simulation
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`card ${className}`}>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-blue mx-auto mb-2"></div>
          <p className="text-gray-400">Generating time series plot...</p>
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
    <div className={`card ${className}`}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyber-blue/20 rounded-full flex items-center justify-center">
              <Clock size={16} className="text-cyber-blue" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Time Series Analysis</h3>
              <p className="text-sm text-gray-400">
                How cyber capabilities evolve over time
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                showAnnotations 
                  ? 'bg-cyber-blue/20 text-cyber-blue' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Eye size={12} className="inline mr-1" />
              Annotations
            </button>
            <ExportButton
              simulationData={data}
              parameters={parameters}
              currentScenario={currentScenario}
              plotRef={plotRef}
              filename="timeseries"
              showExcel={true}
              showCSV={true}
              showImage={true}
            />
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs text-cyber-blue hover:text-cyber-blue/80 transition-colors"
            >
              {showExplanation ? 'Hide' : 'Show'} explanation
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {data ? (
          <Plot
            ref={plotRef}
            data={plotData}
            layout={layout}
            config={PLOT_CONFIG}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <Clock size={48} className="mx-auto mb-2 opacity-50" />
              <p>Run a simulation to see the time series analysis</p>
            </div>
          </div>
        )}
      </div>

      {showExplanation && (
        <div className="p-4 border-t border-gray-700 space-y-4">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-cyber-blue" />
            <h3 className="text-white font-semibold">What does this show?</h3>
          </div>
          
          <div className="text-sm text-gray-300 space-y-2">
            <p>
              This time series plot shows how the four key variables in our cyber conflict model 
              change over time. Each line represents a different aspect of the cyber warfare scenario:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(VARIABLES).map(([key, variable]) => (
              <button
                key={key}
                onClick={() => setSelectedVariable(selectedVariable === key ? null : key)}
                className={`p-3 rounded-lg border transition-all text-left ${
                  selectedVariable === key 
                    ? 'border-cyber-blue bg-cyber-blue/10' 
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: variable.color }}
                  />
                  <span className="text-sm font-medium text-white">
                    {variable.name}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {variable.description}
                </p>
              </button>
            ))}
          </div>
          
          {selectedVariable && (
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <VariableExplanation variable={selectedVariable} />
            </div>
          )}
          
          {data && <TrendAnalysis />}
          
          <div className="p-3 bg-cyber-blue/10 rounded-lg border border-cyber-blue/20">
            <h4 className="text-sm font-semibold text-cyber-blue mb-2">
              Interpreting the Plot
            </h4>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• <strong>Rising lines:</strong> Capabilities or vulnerabilities are increasing</li>
              <li>• <strong>Falling lines:</strong> Capabilities or vulnerabilities are decreasing</li>
              <li>• <strong>Oscillations:</strong> Cyclical behavior between attackers and defenders</li>
              <li>• <strong>Convergence:</strong> Variables reaching stable equilibrium</li>
              <li>• <strong>Crossover points:</strong> When advantage shifts between sides</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnotatedTimeSeries;