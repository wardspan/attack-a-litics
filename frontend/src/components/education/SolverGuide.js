import React, { useState } from 'react';
import { Settings, Clock, Target, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { SOLVER_EXPLANATIONS } from '../../utils/explanationData';

const SolverGuide = ({ currentSolver, onSolverChange, className = "" }) => {
  const [selectedSolver, setSelectedSolver] = useState(currentSolver);
  const [showDetails, setShowDetails] = useState(false);

  const getSolverRecommendation = (parameters) => {
    // Simple heuristic for solver recommendation
    const hasHighValues = Object.values(parameters || {}).some(v => v > 0.1);
    const hasLowValues = Object.values(parameters || {}).some(v => v < 0.001);
    
    if (hasHighValues && hasLowValues) {
      return 'Radau'; // Stiff system
    } else if (hasHighValues) {
      return 'DOP853'; // High precision needed
    } else {
      return 'RK45'; // Default choice
    }
  };

  const SolverCard = ({ solver, info, isSelected, isRecommended }) => (
    <div 
      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
        isSelected 
          ? 'border-cyber-blue bg-cyber-blue/10' 
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
      }`}
      onClick={() => {
        setSelectedSolver(solver);
        onSolverChange?.(solver);
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            isSelected ? 'bg-cyber-blue' : 'bg-gray-600'
          }`} />
          <h3 className="font-semibold text-white">{info.name}</h3>
        </div>
        {isRecommended && (
          <div className="flex items-center gap-1 text-cyber-green text-xs">
            <CheckCircle size={12} />
            Recommended
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-300 mb-3">
        {info.description}
      </p>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <Target size={12} className="text-cyber-green" />
          <span className="text-gray-400">Best for:</span>
          <span className="text-gray-300">{info.whenToUse}</span>
        </div>
        
        {showDetails && (
          <>
            <div className="mt-3 space-y-2">
              <h4 className="text-xs font-semibold text-cyber-green flex items-center gap-1">
                <CheckCircle size={12} />
                Advantages
              </h4>
              <ul className="text-xs text-gray-400 space-y-1">
                {info.advantages.map((advantage, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-cyber-green">•</span>
                    {advantage}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-3 space-y-2">
              <h4 className="text-xs font-semibold text-cyber-red flex items-center gap-1">
                <AlertCircle size={12} />
                Limitations
              </h4>
              <ul className="text-xs text-gray-400 space-y-1">
                {info.disadvantages.map((disadvantage, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-cyber-red">•</span>
                    {disadvantage}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-3 p-2 bg-gray-900 rounded text-xs text-gray-300">
              <div className="flex items-center gap-1 text-cyber-blue mb-1">
                <Info size={12} />
                Educational Note
              </div>
              {info.educational}
            </div>
          </>
        )}
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
              <h3 className="text-white font-semibold">Solver Selection Guide</h3>
              <p className="text-sm text-gray-400">
                Choose the right numerical method for your simulation
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-cyber-blue hover:text-cyber-blue/80 transition-colors"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-4 p-3 bg-gray-900/50 rounded-lg">
          <h4 className="text-sm font-semibold text-cyber-green mb-2 flex items-center gap-2">
            <Target size={14} />
            Quick Selection Guide
          </h4>
          <div className="text-xs text-gray-300 space-y-1">
            <div><strong>First time?</strong> Use RK45 (recommended for beginners)</div>
            <div><strong>Need high accuracy?</strong> Use DOP853</div>
            <div><strong>Quick exploration?</strong> Use RK23</div>
            <div><strong>Stiff system?</strong> Use Radau or BDF</div>
            <div><strong>Unsure?</strong> Use LSODA (auto-switching)</div>
          </div>
        </div>
        
        <div className="space-y-3">
          {Object.entries(SOLVER_EXPLANATIONS).map(([solver, info]) => (
            <SolverCard
              key={solver}
              solver={solver}
              info={info}
              isSelected={selectedSolver === solver}
              isRecommended={solver === 'RK45'}
            />
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-cyber-blue/10 rounded-lg border border-cyber-blue/20">
          <h4 className="text-sm font-semibold text-cyber-blue mb-2 flex items-center gap-2">
            <Clock size={14} />
            Performance vs Accuracy Trade-off
          </h4>
          <div className="text-xs text-gray-300">
            <div className="flex justify-between items-center mb-1">
              <span>Fastest</span>
              <span>Most Accurate</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-cyber-green">RK23</span>
              <span>→</span>
              <span className="text-cyber-blue">RK45</span>
              <span>→</span>
              <span className="text-cyber-purple">DOP853</span>
            </div>
            <div className="mt-2 text-gray-400">
              Choose based on your needs: speed for exploration, accuracy for final results
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolverGuide;