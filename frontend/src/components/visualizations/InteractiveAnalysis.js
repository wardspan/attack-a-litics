import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Activity,
  Calculator,
  Eye,
  HelpCircle
} from 'lucide-react';
import StabilityEducation from '../education/StabilityEducation';
import { VARIABLES } from '../../utils/constants';

const InteractiveAnalysis = ({ 
  data, 
  loading, 
  error, 
  className = "" 
}) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [showTooltips, setShowTooltips] = useState(true);

  const analysisData = useMemo(() => {
    if (!data) return null;
    
    const { time_series, jacobian, eigenvalues, stability, metadata } = data;
    
    // Calculate final values
    const finalValues = {
      x: time_series.x[time_series.x.length - 1],
      y: time_series.y[time_series.y.length - 1],
      z: time_series.z[time_series.z.length - 1],
      u: time_series.u[time_series.u.length - 1]
    };
    
    // Calculate changes
    const changes = {
      x: finalValues.x - time_series.x[0],
      y: finalValues.y - time_series.y[0],
      z: finalValues.z - time_series.z[0],
      u: finalValues.u - time_series.u[0]
    };
    
    // Calculate rates at final time
    const rates = {
      x: (time_series.x[time_series.x.length - 1] - time_series.x[time_series.x.length - 2]) / 0.1,
      y: (time_series.y[time_series.y.length - 1] - time_series.y[time_series.y.length - 2]) / 0.1,
      z: (time_series.z[time_series.z.length - 1] - time_series.z[time_series.z.length - 2]) / 0.1,
      u: (time_series.u[time_series.u.length - 1] - time_series.u[time_series.u.length - 2]) / 0.1
    };
    
    return {
      finalValues,
      changes,
      rates,
      jacobian,
      eigenvalues,
      stability,
      metadata
    };
  }, [data]);

  const Tooltip = ({ content, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    if (!showTooltips) return children;
    
    return (
      <div 
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
        {isVisible && (
          <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg border border-gray-700 max-w-xs">
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </div>
        )}
      </div>
    );
  };

  const SummaryTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-cyber-green font-semibold">
            <span className="w-2 h-2 bg-cyber-green rounded-full"></span>
            Final State Values
          </h4>
          
          <div className="space-y-2">
            {Object.entries(VARIABLES).map(([key, variable]) => (
              <div key={key} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <Tooltip content={variable.description}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: variable.color }}
                    />
                    <span className="text-sm text-gray-300">{variable.name}</span>
                  </div>
                </Tooltip>
                <span className="font-mono text-white font-medium text-sm">
                  {analysisData.finalValues[key].toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-cyber-blue font-semibold">
            <span className="w-2 h-2 bg-cyber-blue rounded-full"></span>
            Net Changes
          </h4>
          
          <div className="space-y-2">
            {Object.entries(VARIABLES).map(([key, variable]) => {
              const change = analysisData.changes[key];
              const changeColor = change > 0 ? 'text-cyber-red' : 
                                 change < 0 ? 'text-cyber-green' : 'text-gray-400';
              
              return (
                <div key={key} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <Tooltip content={`Total change in ${variable.name} over simulation`}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: variable.color }}
                      />
                      <span className="text-sm text-gray-300">{variable.name}</span>
                    </div>
                  </Tooltip>
                  <div className="flex items-center gap-2">
                    {change > 0 ? <TrendingUp size={14} className="text-cyber-red" /> : 
                     change < 0 ? <TrendingDown size={14} className="text-cyber-green" /> : 
                     <div className="w-3 h-3 rounded-full bg-gray-400" />}
                    <span className={`font-mono font-medium text-sm ${changeColor} net-change-value`}>
                      {change > 0 ? '+' : ''}{change.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-800/30 rounded-lg">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Duration</div>
          <div className="text-lg font-semibold text-white">
            {analysisData.metadata.simulation_time}h
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Data Points</div>
          <div className="text-lg font-semibold text-white">
            {analysisData.metadata.data_points}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Solver</div>
          <div className="text-lg font-semibold text-white">
            {analysisData.metadata.solver_method}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-sm font-semibold text-cyber-blue mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-cyber-blue rounded-full"></span>
            System Stability
          </h4>
          <div className="space-y-2">
            <div className="text-base text-white capitalize font-medium">
              {analysisData.stability}
            </div>
            <div className="text-xs text-gray-400">
              Click the Stability tab for detailed analysis
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-sm font-semibold text-cyber-purple mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-cyber-purple rounded-full"></span>
            Dominant Eigenvalue
          </h4>
          <div className="space-y-2">
            <div className="text-base font-mono text-white font-medium">
              {analysisData.eigenvalues[0].toFixed(6)}
            </div>
            <div className="text-xs text-gray-400">
              {analysisData.eigenvalues[0] > 0 ? 'Unstable direction' : 'Stable direction'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const RatesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Calculator size={16} className="text-cyber-green" />
        <h4 className="text-sm font-semibold text-cyber-green">
          Current Rates of Change
        </h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(VARIABLES).map(([key, variable]) => {
          const rate = analysisData.rates[key];
          const rateColor = rate > 0 ? 'text-cyber-red' : 
                           rate < 0 ? 'text-cyber-green' : 'text-gray-400';
          
          return (
            <div key={key} className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: variable.color }}
                />
                <span className="text-sm font-medium text-white">
                  {variable.name}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {rate > 0 ? <TrendingUp size={14} className="text-cyber-red" /> : 
                 rate < 0 ? <TrendingDown size={14} className="text-cyber-green" /> : 
                 <div className="w-3 h-3 rounded-full bg-gray-400" />}
                <span className={`text-lg font-mono ${rateColor}`}>
                  {rate > 0 ? '+' : ''}{rate.toFixed(4)}
                </span>
                <span className="text-xs text-gray-400">units/h</span>
              </div>
              
              <div className="mt-2 text-xs text-gray-400">
                {rate > 0 ? 'Currently increasing' : 
                 rate < 0 ? 'Currently decreasing' : 'Currently stable'}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 bg-cyber-blue/10 rounded-lg border border-cyber-blue/20">
        <h4 className="text-sm font-semibold text-cyber-blue mb-2">
          Understanding Rates
        </h4>
        <div className="text-xs text-gray-300 space-y-1">
          <p>• <strong>Positive rates:</strong> Variable is increasing at the final time</p>
          <p>• <strong>Negative rates:</strong> Variable is decreasing at the final time</p>
          <p>• <strong>Near-zero rates:</strong> Variable is approaching equilibrium</p>
          <p>• <strong>Large magnitudes:</strong> Rapid changes occurring</p>
        </div>
      </div>
    </div>
  );

  const JacobianTab = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={16} className="text-cyber-purple" />
        <h4 className="text-sm font-semibold text-cyber-purple">
          Jacobian Matrix Analysis
        </h4>
      </div>
      
      {analysisData.jacobian && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-2 text-cyber-green">Variable</th>
                <th className="text-center p-2 text-cyber-green">
                  <Tooltip content="Impact on Defender rate">D</Tooltip>
                </th>
                <th className="text-center p-2 text-cyber-green">
                  <Tooltip content="Impact on Attacker rate">A</Tooltip>
                </th>
                <th className="text-center p-2 text-cyber-green">
                  <Tooltip content="Impact on Vulnerability rate">V</Tooltip>
                </th>
                <th className="text-center p-2 text-cyber-green">
                  <Tooltip content="Impact on Intelligence rate">T</Tooltip>
                </th>
              </tr>
            </thead>
            <tbody>
              {analysisData.jacobian.map((row, i) => (
                <tr key={i} className="border-b border-gray-800">
                  <td className="p-2 font-semibold text-cyber-blue">
                    {['D', 'A', 'V', 'T'][i]}
                  </td>
                  {row.map((value, j) => (
                    <td key={j} className="p-2 text-center">
                      <Tooltip content={`${value > 0 ? 'Increases' : value < 0 ? 'Decreases' : 'No effect on'} ${['Defender', 'Attacker', 'Vulnerability', 'Intelligence'][i]} rate`}>
                        <span className={`font-mono ${
                          value > 0 ? 'text-cyber-red' : 
                          value < 0 ? 'text-cyber-green' : 
                          'text-gray-400'
                        }`}>
                          {value.toFixed(4)}
                        </span>
                      </Tooltip>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 bg-cyber-green/10 rounded-lg border border-cyber-green/20">
          <h5 className="text-sm font-semibold text-cyber-green mb-1">
            Positive Values (Red)
          </h5>
          <p className="text-xs text-gray-300">
            Variable in column reinforces the growth of variable in row
          </p>
        </div>
        
        <div className="p-3 bg-cyber-red/10 rounded-lg border border-cyber-red/20">
          <h5 className="text-sm font-semibold text-cyber-red mb-1">
            Negative Values (Green)
          </h5>
          <p className="text-xs text-gray-300">
            Variable in column opposes the growth of variable in row
          </p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`card ${className}`}>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-blue mx-auto mb-2"></div>
          <p className="text-gray-400">Computing analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`card ${className}`}>
        <div className="p-6 text-center">
          <p className="text-cyber-red">Error loading analysis: {error}</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className={`card ${className}`}>
        <div className="p-6 text-center">
          <BarChart3 size={48} className="mx-auto mb-2 opacity-50 text-gray-400" />
          <p className="text-gray-400">Run a simulation to see the mathematical analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`card ${className} mathematical-analysis-panel`} style={{ minWidth: '500px' }}>
      <div className="p-6 border-b border-gray-700">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyber-purple/20 rounded-full flex items-center justify-center">
              <BarChart3 size={16} className="text-cyber-purple" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg panel-title">Mathematical Analysis</h3>
              <p className="text-sm text-gray-400">
                Detailed system analysis and stability information
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowTooltips(!showTooltips)}
            className={`text-xs px-3 py-1.5 rounded-md transition-colors border ${
              showTooltips 
                ? 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'
            }`}
          >
            <HelpCircle size={12} className="inline mr-1" />
            Tooltips
          </button>
        </div>
      </div>
      
      <div className="border-b border-gray-700">
        <div className="flex space-x-1 p-2">
          {[
            { id: 'summary', label: 'Summary', icon: Info },
            { id: 'rates', label: 'Rates', icon: TrendingUp },
            { id: 'jacobian', label: 'Jacobian', icon: Activity },
            { id: 'stability', label: 'Stability', icon: Target }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-sm rounded-lg transition-colors border ${
                activeTab === id
                  ? 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30'
                  : 'text-gray-400 hover:text-gray-300 border-transparent hover:bg-gray-800/50'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-6">
        {activeTab === 'summary' && <SummaryTab />}
        {activeTab === 'rates' && <RatesTab />}
        {activeTab === 'jacobian' && <JacobianTab />}
        {activeTab === 'stability' && (
          <StabilityEducation
            stability={analysisData.stability}
            eigenvalues={analysisData.eigenvalues}
            jacobian={analysisData.jacobian}
          />
        )}
      </div>
    </div>
  );
};

export default InteractiveAnalysis;