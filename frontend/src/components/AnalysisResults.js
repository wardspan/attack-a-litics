import React, { useMemo } from 'react';
import { Activity, Target, TrendingUp, Info, Download, Copy } from 'lucide-react';
import { STABILITY_TYPES, VARIABLES } from '../utils/constants';

const AnalysisResults = ({ data, loading = false, error = null }) => {
  const stabilityInfo = useMemo(() => {
    if (!data || !data.stability) return null;
    return STABILITY_TYPES[data.stability] || {
      color: '#ffffff',
      description: 'Unknown stability type',
      interpretation: 'Unable to classify system behavior',
    };
  }, [data]);

  const eigenvalueAnalysis = useMemo(() => {
    if (!data || !data.eigenvalues) return null;
    
    const eigenvalues = data.eigenvalues.map(ev => {
      if (typeof ev === 'number') {
        return { real: ev, imag: 0, magnitude: Math.abs(ev) };
      } else {
        const magnitude = Math.sqrt(ev.real * ev.real + ev.imag * ev.imag);
        return { ...ev, magnitude };
      }
    });
    
    const realParts = eigenvalues.map(ev => ev.real);
    const hasComplexPairs = eigenvalues.some(ev => Math.abs(ev.imag) > 1e-10);
    const maxReal = Math.max(...realParts);
    const minReal = Math.min(...realParts);
    
    return {
      eigenvalues,
      hasComplexPairs,
      maxReal,
      minReal,
      dominantEigenvalue: eigenvalues.reduce((max, ev) => 
        ev.magnitude > max.magnitude ? ev : max
      ),
    };
  }, [data]);

  const finalState = useMemo(() => {
    if (!data || !data.metadata?.final_state) return null;
    return data.metadata.final_state;
  }, [data]);

  const formatNumber = (num) => {
    if (typeof num !== 'number') return 'N/A';
    return Math.abs(num) < 1e-6 ? '0.000' : num.toFixed(3);
  };

  const formatComplex = (eigenvalue) => {
    if (Math.abs(eigenvalue.imag) < 1e-10) {
      return formatNumber(eigenvalue.real);
    }
    const sign = eigenvalue.imag >= 0 ? '+' : '';
    return `${formatNumber(eigenvalue.real)} ${sign} ${formatNumber(eigenvalue.imag)}i`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const exportResults = () => {
    if (!data) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      parameters: data.parameters,
      stability: data.stability,
      eigenvalues: data.eigenvalues,
      jacobian: data.jacobian,
      final_state: finalState,
      metadata: data.metadata,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attack-a-litics-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
        <p className="text-gray-400">Analyzing results...</p>
      </div>
    </div>
  );

  const ErrorMessage = ({ message }) => (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <div className="text-cyber-red mb-2">⚠️</div>
        <p className="text-cyber-red font-medium">Analysis Error</p>
        <p className="text-gray-400 text-sm mt-2">{message}</p>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <div className="text-gray-600 mb-2">🔍</div>
        <p className="text-gray-400">Mathematical Analysis</p>
        <p className="text-gray-500 text-sm mt-2">
          Run a simulation to see stability analysis and eigenvalue decomposition
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

  if (!data) {
    return (
      <div className="card">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Mathematical Analysis</h3>
        <div className="flex space-x-2">
          <button
            onClick={exportResults}
            className="button-secondary flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Stability Analysis */}
        <div className="bg-dark-bg rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Activity size={18} className="text-cyber-blue" />
            <h4 className="text-white font-semibold">Stability Classification</h4>
          </div>
          
          {stabilityInfo && (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: stabilityInfo.color }}
                />
                <span className="text-lg font-medium" style={{ color: stabilityInfo.color }}>
                  {data.stability}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-400">
                  <strong>Description:</strong> {stabilityInfo.description}
                </div>
                <div className="text-sm text-gray-400">
                  <strong>Interpretation:</strong> {stabilityInfo.interpretation}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Eigenvalue Analysis */}
        {eigenvalueAnalysis && (
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Target size={18} className="text-cyber-purple" />
              <h4 className="text-white font-semibold">Eigenvalue Analysis</h4>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eigenvalueAnalysis.eigenvalues.map((ev, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-card-bg rounded border border-border-color">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium text-gray-300">λ{idx + 1}:</div>
                      <div className="font-mono text-sm text-white">
                        {formatComplex(ev)}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(formatComplex(ev))}
                      className="text-gray-400 hover:text-cyber-blue transition-colors"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Max Real Part</div>
                  <div className="text-white font-medium">{formatNumber(eigenvalueAnalysis.maxReal)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Min Real Part</div>
                  <div className="text-white font-medium">{formatNumber(eigenvalueAnalysis.minReal)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Complex Pairs</div>
                  <div className="text-white font-medium">{eigenvalueAnalysis.hasComplexPairs ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Final State */}
        {finalState && (
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp size={18} className="text-cyber-green" />
              <h4 className="text-white font-semibold">Final System State</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(VARIABLES).map(([key, variable]) => {
                const value = finalState[key];
                return (
                  <div key={key} className="flex items-center justify-between p-3 bg-card-bg rounded border border-border-color">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: variable.color }}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-300">{variable.name}</div>
                        <div className="text-xs text-gray-500">{variable.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">{formatNumber(value)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Jacobian Matrix */}
        {data.jacobian && (
          <div className="bg-dark-bg rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Info size={18} className="text-cyber-blue" />
                <h4 className="text-white font-semibold">Jacobian Matrix</h4>
              </div>
              <button
                onClick={() => copyToClipboard(JSON.stringify(data.jacobian, null, 2))}
                className="text-gray-400 hover:text-cyber-blue transition-colors"
              >
                <Copy size={16} />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="border-b border-border-color">
                    <th className="p-2 text-gray-400">∂/∂</th>
                    <th className="p-2 text-gray-400">x</th>
                    <th className="p-2 text-gray-400">y</th>
                    <th className="p-2 text-gray-400">z</th>
                    <th className="p-2 text-gray-400">u</th>
                  </tr>
                </thead>
                <tbody>
                  {['x', 'y', 'z', 'u'].map((rowVar, rowIdx) => (
                    <tr key={rowVar} className="border-b border-border-color">
                      <td className="p-2 text-gray-400 font-medium">{rowVar}</td>
                      {data.jacobian[rowIdx].map((value, colIdx) => (
                        <td key={colIdx} className="p-2 text-white text-center">
                          {formatNumber(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Simulation Metadata */}
        {data.metadata && (
          <div className="bg-dark-bg rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">Simulation Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Solver Method</div>
                <div className="text-white font-medium">{data.metadata.solver_method}</div>
              </div>
              <div>
                <div className="text-gray-500">Data Points</div>
                <div className="text-white font-medium">{data.metadata.data_points}</div>
              </div>
              <div>
                <div className="text-gray-500">Solver Success</div>
                <div className="text-white font-medium">{data.metadata.solver_success ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;