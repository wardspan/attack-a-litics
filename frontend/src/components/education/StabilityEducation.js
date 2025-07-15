import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, RotateCcw, AlertTriangle, Target, Activity } from 'lucide-react';
import { CONCEPT_EXPLANATIONS } from '../../utils/explanationData';

const StabilityEducation = ({ stability, eigenvalues, jacobian, className = "" }) => {
  const [activeTab, setActiveTab] = useState('stability');
  
  const stabilityInfo = useMemo(() => {
    const info = CONCEPT_EXPLANATIONS.stability.types[stability];
    return info || {
      description: "Unknown stability type",
      cyberMeaning: "Unable to determine system behavior",
      icon: "❓"
    };
  }, [stability]);

  const eigenvalueAnalysis = useMemo(() => {
    if (!eigenvalues || eigenvalues.length === 0) return null;
    
    const analysis = {
      hasPositive: eigenvalues.some(val => val > 0.001),
      hasNegative: eigenvalues.some(val => val < -0.001),
      hasComplex: eigenvalues.some(val => typeof val === 'object' || val.toString().includes('i')),
      dominant: eigenvalues.reduce((max, val) => {
        const absVal = Math.abs(typeof val === 'number' ? val : val.real || val);
        return absVal > Math.abs(max) ? val : max;
      }, eigenvalues[0])
    };
    
    return analysis;
  }, [eigenvalues]);

  const getStabilityIcon = (type) => {
    const iconMap = {
      'stable node': <Target className="text-cyber-green" size={20} />,
      'unstable node': <AlertTriangle className="text-cyber-red" size={20} />,
      'saddle point': <Activity className="text-yellow-500" size={20} />,
      'spiral sink': <RotateCcw className="text-cyber-blue" size={20} />,
      'spiral source': <RotateCcw className="text-cyber-purple" size={20} />,
      'center': <Target className="text-gray-400" size={20} />
    };
    return iconMap[type] || <AlertTriangle className="text-gray-400" size={20} />;
  };

  const getEigenvalueColor = (eigenvalue) => {
    if (typeof eigenvalue === 'number') {
      if (eigenvalue > 0.001) return 'text-cyber-red';
      if (eigenvalue < -0.001) return 'text-cyber-green';
      return 'text-gray-400';
    }
    return 'text-cyber-purple'; // Complex eigenvalues
  };

  const formatEigenvalue = (eigenvalue) => {
    if (typeof eigenvalue === 'number') {
      return eigenvalue.toFixed(6);
    }
    // Handle complex eigenvalues if they exist
    return eigenvalue.toString();
  };

  const renderStabilityTab = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full">
          {getStabilityIcon(stability)}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white capitalize">
            {stability || 'Unknown'}
          </h3>
          <p className="text-sm text-gray-400">
            {stabilityInfo.description}
          </p>
        </div>
      </div>
      
      <div className="p-4 bg-cyber-blue/10 rounded-lg border border-cyber-blue/20">
        <h4 className="text-sm font-semibold text-cyber-blue mb-2">
          Cyber Security Interpretation
        </h4>
        <p className="text-sm text-gray-300">
          {stabilityInfo.cyberMeaning}
        </p>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-cyber-green">
          What this means for your simulation:
        </h4>
        
        {stability === 'stable node' && (
          <div className="space-y-2 text-sm text-gray-300">
            <p>• The system will eventually reach a stable equilibrium</p>
            <p>• Small changes won't cause major disruptions</p>
            <p>• Defenders ultimately gain control of the situation</p>
            <p>• Good for long-term strategic planning</p>
          </div>
        )}
        
        {stability === 'unstable node' && (
          <div className="space-y-2 text-sm text-gray-300">
            <p>• The system will become increasingly unstable</p>
            <p>• Small changes can lead to major consequences</p>
            <p>• Attackers may gain persistent advantage</p>
            <p>• Requires immediate intervention</p>
          </div>
        )}
        
        {stability === 'saddle point' && (
          <div className="space-y-2 text-sm text-gray-300">
            <p>• System behavior depends on initial conditions</p>
            <p>• Some scenarios lead to stability, others to chaos</p>
            <p>• Critical importance of early response</p>
            <p>• Outcome highly sensitive to starting parameters</p>
          </div>
        )}
        
        {stability?.includes('spiral') && (
          <div className="space-y-2 text-sm text-gray-300">
            <p>• System exhibits oscillatory behavior</p>
            <p>• Advantage shifts between attackers and defenders</p>
            <p>• Requires sustained monitoring and response</p>
            <p>{stability.includes('sink') ? '• Eventually stabilizes' : '• Becomes increasingly unstable'}</p>
          </div>
        )}
        
        {stability === 'center' && (
          <div className="space-y-2 text-sm text-gray-300">
            <p>• System exhibits periodic behavior</p>
            <p>• Conflicts repeat in cycles</p>
            <p>• No natural resolution without intervention</p>
            <p>• Requires breaking the cycle</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderEigenvaluesTab = () => (
    <div className="space-y-4">
      <div className="p-4 bg-gray-800/50 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">
          Eigenvalue Analysis
        </h3>
        <p className="text-sm text-gray-400">
          Eigenvalues determine how the system behaves near equilibrium
        </p>
      </div>
      
      {eigenvalues && eigenvalues.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-cyber-green">
            Computed Eigenvalues:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {eigenvalues.map((eigenvalue, index) => (
              <div key={index} className="p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">λ{index + 1}</span>
                  <span className={`font-mono text-sm ${getEigenvalueColor(eigenvalue)}`}>
                    {formatEigenvalue(eigenvalue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {eigenvalueAnalysis && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-cyber-green">
            Interpretation:
          </h4>
          
          <div className="space-y-2 text-sm">
            {eigenvalueAnalysis.hasPositive && (
              <div className="flex items-center gap-2 text-cyber-red">
                <TrendingUp size={16} />
                <span>Positive eigenvalues indicate instability/growth</span>
              </div>
            )}
            
            {eigenvalueAnalysis.hasNegative && (
              <div className="flex items-center gap-2 text-cyber-green">
                <TrendingDown size={16} />
                <span>Negative eigenvalues indicate stability/decay</span>
              </div>
            )}
            
            {eigenvalueAnalysis.hasComplex && (
              <div className="flex items-center gap-2 text-cyber-purple">
                <RotateCcw size={16} />
                <span>Complex eigenvalues indicate oscillatory behavior</span>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-cyber-blue/10 rounded-lg border border-cyber-blue/20">
            <h5 className="text-sm font-semibold text-cyber-blue mb-1">
              Dominant Eigenvalue:
            </h5>
            <div className="text-sm text-gray-300">
              <span className="font-mono">{formatEigenvalue(eigenvalueAnalysis.dominant)}</span>
              <span className="ml-2 text-gray-400">
                (determines overall system behavior)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderJacobianTab = () => (
    <div className="space-y-4">
      <div className="p-4 bg-gray-800/50 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">
          Jacobian Matrix
        </h3>
        <p className="text-sm text-gray-400">
          Shows how each variable influences the rate of change of every other variable
        </p>
      </div>
      
      {jacobian && (
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-2 text-cyber-green">Variable</th>
                  <th className="text-center p-2 text-cyber-green">D</th>
                  <th className="text-center p-2 text-cyber-green">A</th>
                  <th className="text-center p-2 text-cyber-green">V</th>
                  <th className="text-center p-2 text-cyber-green">T</th>
                </tr>
              </thead>
              <tbody>
                {jacobian.map((row, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="p-2 font-semibold text-cyber-blue">
                      {['D', 'A', 'V', 'T'][i]}
                    </td>
                    {row.map((value, j) => (
                      <td key={j} className="p-2 text-center font-mono">
                        <span className={`${
                          value > 0 ? 'text-cyber-red' : 
                          value < 0 ? 'text-cyber-green' : 
                          'text-gray-400'
                        }`}>
                          {value.toFixed(4)}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-cyber-green/10 rounded-lg border border-cyber-green/20">
              <h5 className="text-sm font-semibold text-cyber-green mb-1">
                Positive Values (Red)
              </h5>
              <p className="text-xs text-gray-300">
                Variable in column increases the rate of change of variable in row
              </p>
            </div>
            
            <div className="p-3 bg-cyber-red/10 rounded-lg border border-cyber-red/20">
              <h5 className="text-sm font-semibold text-cyber-red mb-1">
                Negative Values (Green)
              </h5>
              <p className="text-xs text-gray-300">
                Variable in column decreases the rate of change of variable in row
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`card ${className}`}>
      <div className="border-b border-gray-700">
        <div className="flex space-x-1 p-1">
          {[
            { id: 'stability', label: 'Stability', icon: Target },
            { id: 'eigenvalues', label: 'Eigenvalues', icon: TrendingUp },
            { id: 'jacobian', label: 'Jacobian', icon: Activity }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm rounded transition-colors ${
                activeTab === id
                  ? 'bg-cyber-blue/20 text-cyber-blue'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4">
        {activeTab === 'stability' && renderStabilityTab()}
        {activeTab === 'eigenvalues' && renderEigenvaluesTab()}
        {activeTab === 'jacobian' && renderJacobianTab()}
      </div>
    </div>
  );
};

export default StabilityEducation;