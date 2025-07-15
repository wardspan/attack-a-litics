import React, { useState } from 'react';
import { Settings, Clock, Zap, HelpCircle, CheckCircle } from 'lucide-react';
import { SOLVER_EXPLANATIONS } from '../../utils/explanationData';

const SolverSettings = ({ 
  parameters, 
  onParametersChange, 
  className = "" 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSolverHelp, setShowSolverHelp] = useState(false);

  const handleParameterChange = (name, value) => {
    onParametersChange({
      ...parameters,
      [name]: value
    });
  };

  const getRecommendedSolver = () => {
    // Simple heuristic for solver recommendation
    const timeSpan = parameters.time_span || 24;
    const resolution = parameters.resolution || 0.1;
    
    if (timeSpan > 48 && resolution < 0.05) {
      return 'DOP853'; // Long simulation with high precision
    } else if (resolution < 0.01) {
      return 'Radau'; // Very fine resolution might indicate stiffness
    } else if (timeSpan < 12) {
      return 'RK23'; // Short simulation, speed over accuracy
    } else {
      return 'RK45'; // Default recommendation
    }
  };

  const getSolverColor = (solver) => {
    const recommended = getRecommendedSolver();
    if (solver === recommended) return 'cyber-green';
    if (solver === parameters.solver_method) return 'cyber-blue';
    return 'gray-400';
  };

  const formatValue = (value, type) => {
    if (type === 'time') {
      return `${value}h`;
    } else if (type === 'resolution') {
      return value.toFixed(3);
    }
    return value.toString();
  };

  const QuickSolverSelect = () => (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-cyber-green">
        Quick Solver Selection
      </h4>
      
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(SOLVER_EXPLANATIONS).slice(0, 4).map(([solver, info]) => (
          <button
            key={solver}
            onClick={() => handleParameterChange('solver_method', solver)}
            className={`p-3 rounded-lg border transition-all text-left ${
              parameters.solver_method === solver
                ? 'border-cyber-blue bg-cyber-blue/10'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full bg-${getSolverColor(solver)}`} />
              <span className="text-sm font-medium text-white">{solver}</span>
              {solver === getRecommendedSolver() && (
                <CheckCircle size={12} className="text-cyber-green" />
              )}
            </div>
            <p className="text-xs text-gray-400">
              {info.whenToUse}
            </p>
          </button>
        ))}
      </div>
      
      <button
        onClick={() => setShowSolverHelp(!showSolverHelp)}
        className="text-xs text-cyber-blue hover:text-cyber-blue/80 transition-colors flex items-center gap-1"
      >
        <HelpCircle size={12} />
        {showSolverHelp ? 'Hide solver details' : 'Show solver details'}
      </button>
    </div>
  );

  const SolverDetails = () => (
    <div className="space-y-4">
      <div className="p-3 bg-cyber-blue/10 rounded-lg border border-cyber-blue/20">
        <h4 className="text-sm font-semibold text-cyber-blue mb-2">
          Recommended for your settings: {getRecommendedSolver()}
        </h4>
        <p className="text-xs text-gray-300">
          {SOLVER_EXPLANATIONS[getRecommendedSolver()]?.description}
        </p>
      </div>
      
      <div className="space-y-3">
        {Object.entries(SOLVER_EXPLANATIONS).map(([solver, info]) => (
          <div key={solver} className="p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleParameterChange('solver_method', solver)}
                  className={`w-3 h-3 rounded-full border-2 ${
                    parameters.solver_method === solver
                      ? 'bg-cyber-blue border-cyber-blue'
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                />
                <span className="text-sm font-medium text-white">
                  {info.name}
                </span>
                {solver === getRecommendedSolver() && (
                  <span className="text-xs text-cyber-green">Recommended</span>
                )}
              </div>
            </div>
            
            <p className="text-xs text-gray-400 mb-2">
              {info.description}
            </p>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <h5 className="text-cyber-green font-medium mb-1">Advantages</h5>
                <ul className="text-gray-400 space-y-1">
                  {info.advantages.slice(0, 2).map((advantage, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-cyber-green">•</span>
                      {advantage}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="text-cyber-red font-medium mb-1">Limitations</h5>
                <ul className="text-gray-400 space-y-1">
                  {info.disadvantages.slice(0, 2).map((disadvantage, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-cyber-red">•</span>
                      {disadvantage}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SimulationParameters = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-cyber-green">
        Simulation Parameters
      </h4>
      
      <div className="space-y-3">
        {/* Time Span */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-cyber-blue" />
              <span className="text-sm font-medium text-white">Time Span</span>
            </div>
            <span className="text-sm text-gray-400">
              {formatValue(parameters.time_span || 24, 'time')}
            </span>
          </div>
          
          <input
            type="range"
            min="6"
            max="168"
            step="6"
            value={parameters.time_span || 24}
            onChange={(e) => handleParameterChange('time_span', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>6h</span>
            <span>1 week</span>
            <span>168h</span>
          </div>
          
          <p className="text-xs text-gray-500">
            Longer simulations show more system evolution but take more time to compute
          </p>
        </div>

        {/* Resolution */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-cyber-purple" />
              <span className="text-sm font-medium text-white">Resolution</span>
            </div>
            <span className="text-sm text-gray-400">
              {formatValue(parameters.resolution || 0.1, 'resolution')}
            </span>
          </div>
          
          <input
            type="range"
            min="0.01"
            max="1.0"
            step="0.01"
            value={parameters.resolution || 0.1}
            onChange={(e) => handleParameterChange('resolution', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>0.01 (High)</span>
            <span>0.1 (Medium)</span>
            <span>1.0 (Low)</span>
          </div>
          
          <p className="text-xs text-gray-500">
            Lower values = more accurate but slower computation
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`card ${className}`}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyber-purple/20 rounded-full flex items-center justify-center">
              <Settings size={16} className="text-cyber-purple" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Simulation Settings</h3>
              <p className="text-sm text-gray-400">
                Configure solver and simulation parameters
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-cyber-blue hover:text-cyber-blue/80 transition-colors"
          >
            {showAdvanced ? 'Basic' : 'Advanced'}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {!showAdvanced ? (
          <>
            <QuickSolverSelect />
            {showSolverHelp && <SolverDetails />}
          </>
        ) : (
          <SolverDetails />
        )}
        
        <SimulationParameters />
        
        {/* Current Settings Summary */}
        <div className="p-3 bg-gray-800/50 rounded-lg">
          <h4 className="text-sm font-semibold text-cyber-green mb-2">
            Current Settings
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-400">Solver:</span>
              <span className="ml-2 text-white">{parameters.solver_method || 'RK45'}</span>
            </div>
            <div>
              <span className="text-gray-400">Time:</span>
              <span className="ml-2 text-white">{parameters.time_span || 24}h</span>
            </div>
            <div>
              <span className="text-gray-400">Resolution:</span>
              <span className="ml-2 text-white">{parameters.resolution || 0.1}</span>
            </div>
            <div>
              <span className="text-gray-400">Steps:</span>
              <span className="ml-2 text-white">
                ~{Math.ceil((parameters.time_span || 24) / (parameters.resolution || 0.1))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolverSettings;