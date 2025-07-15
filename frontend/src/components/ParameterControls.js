import React, { useState, useCallback } from 'react';
import { RotateCcw, Info } from 'lucide-react';
import { DEFAULT_PARAMETERS, PARAMETER_CONSTRAINTS, PARAMETER_DESCRIPTIONS, SOLVER_METHODS } from '../utils/constants';

const ParameterControls = ({ parameters, onParameterChange, onReset, disabled = false }) => {
  const [showTooltip, setShowTooltip] = useState(null);

  const handleSliderChange = useCallback((paramName, value) => {
    const numValue = parseFloat(value);
    onParameterChange(paramName, numValue);
  }, [onParameterChange]);

  const handleInputChange = useCallback((paramName, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onParameterChange(paramName, numValue);
    }
  }, [onParameterChange]);

  const renderSliderGroup = (title, params, color = 'cyber-blue') => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white border-b border-border-color pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {params.map((param) => {
          const constraints = PARAMETER_CONSTRAINTS[param];
          const value = parameters[param];
          const displayValue = param.includes('lambda') ? 'λ' : param;
          
          return (
            <div key={param} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-300">
                    {displayValue === 'lambda' ? 'λ' : `${displayValue.charAt(0).toUpperCase() + displayValue.slice(1)}`}
                  </label>
                  <button
                    className="text-gray-400 hover:text-cyber-blue transition-colors"
                    onMouseEnter={() => setShowTooltip(param)}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <Info size={14} />
                  </button>
                </div>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleInputChange(param, e.target.value)}
                  min={constraints.min}
                  max={constraints.max}
                  step={constraints.step}
                  className="w-20 text-xs input-field"
                  disabled={disabled}
                />
              </div>
              
              <input
                type="range"
                min={constraints.min}
                max={constraints.max}
                step={constraints.step}
                value={value}
                onChange={(e) => handleSliderChange(param, e.target.value)}
                className="slider"
                disabled={disabled}
              />
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>{constraints.min}</span>
                <span>{constraints.max}</span>
              </div>
              
              {showTooltip === param && (
                <div className="absolute z-10 bg-card-bg border border-border-color rounded-lg p-3 shadow-lg max-w-xs">
                  <p className="text-sm text-gray-300">{PARAMETER_DESCRIPTIONS[param]}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderNumberInput = (param, label, unit = '') => {
    const constraints = PARAMETER_CONSTRAINTS[param];
    const value = parameters[param];
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <button
              className="text-gray-400 hover:text-cyber-blue transition-colors"
              onMouseEnter={() => setShowTooltip(param)}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <Info size={14} />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={value}
              onChange={(e) => handleInputChange(param, e.target.value)}
              min={constraints.min}
              max={constraints.max}
              step={constraints.step}
              className="w-20 input-field"
              disabled={disabled}
            />
            {unit && <span className="text-xs text-gray-500">{unit}</span>}
          </div>
        </div>
        
        {showTooltip === param && (
          <div className="absolute z-10 bg-card-bg border border-border-color rounded-lg p-3 shadow-lg max-w-xs">
            <p className="text-sm text-gray-300">{PARAMETER_DESCRIPTIONS[param]}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gradient">Simulation Parameters</h2>
        <button
          onClick={onReset}
          disabled={disabled}
          className="button-secondary flex items-center space-x-2"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      </div>

      {/* System Dynamics Parameters */}
      {renderSliderGroup('System Dynamics', ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'eta'])}

      {/* Vulnerability & Intelligence Parameters */}
      {renderSliderGroup('Vulnerability & Intelligence', ['theta', 'lambda', 'mu', 'nu', 'xi', 'rho', 'sigma'])}

      {/* Initial Conditions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-border-color pb-2">
          Initial Conditions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderNumberInput('x0', 'Defender Capability (x₀)')}
          {renderNumberInput('y0', 'Attacker Capability (y₀)')}
          {renderNumberInput('z0', 'System Vulnerability (z₀)')}
          {renderNumberInput('u0', 'Threat Intelligence (u₀)')}
        </div>
      </div>

      {/* Simulation Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-border-color pb-2">
          Simulation Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderNumberInput('time_span', 'Time Span', 'hours')}
          {renderNumberInput('resolution', 'Resolution', 'step')}
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-300">Solver Method</label>
              <button
                className="text-gray-400 hover:text-cyber-blue transition-colors"
                onMouseEnter={() => setShowTooltip('solver_method')}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <Info size={14} />
              </button>
            </div>
            <select
              value={parameters.solver_method}
              onChange={(e) => onParameterChange('solver_method', e.target.value)}
              className="w-full input-field"
              disabled={disabled}
            >
              {SOLVER_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
            
            {showTooltip === 'solver_method' && (
              <div className="absolute z-10 bg-card-bg border border-border-color rounded-lg p-3 shadow-lg max-w-xs">
                <p className="text-sm text-gray-300">{PARAMETER_DESCRIPTIONS.solver_method}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Parameter Summary */}
      <div className="bg-dark-bg rounded-lg p-4 border border-border-color">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Quick Summary</h4>
        <div className="text-xs text-gray-500 space-y-1">
          <div>Time: {parameters.time_span}h @ {parameters.resolution}s resolution</div>
          <div>Solver: {SOLVER_METHODS.find(m => m.value === parameters.solver_method)?.label}</div>
          <div>Initial State: D={parameters.x0}, A={parameters.y0}, V={parameters.z0}, I={parameters.u0}</div>
        </div>
      </div>
    </div>
  );
};

export default ParameterControls;