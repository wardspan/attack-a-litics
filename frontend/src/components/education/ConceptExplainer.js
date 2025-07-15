import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Info, Lightbulb } from 'lucide-react';
import { CONCEPT_EXPLANATIONS } from '../../utils/explanationData';
import EquationDisplay, { LabeledEquation } from '../ui/EquationDisplay';

const ConceptExplainer = ({ concept, title, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const explanation = CONCEPT_EXPLANATIONS[concept];
  
  if (!explanation) return null;

  const renderEquations = () => {
    if (!explanation.equations) return null;
    
    return (
      <div className="mt-4 space-y-3">
        <h4 className="text-sm font-semibold text-cyber-green flex items-center gap-2">
          <BookOpen size={16} />
          Mathematical Equations
        </h4>
        {explanation.equations.map((eq, index) => (
          <LabeledEquation
            key={index}
            equation={eq.latex}
            description={eq.description}
            className="mb-3"
          />
        ))}
      </div>
    );
  };

  const renderInterpretations = () => {
    if (!explanation.interpretations) return null;
    
    return (
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-semibold text-cyber-green flex items-center gap-2">
          <Lightbulb size={16} />
          Pattern Interpretations
        </h4>
        {Object.entries(explanation.interpretations).map(([pattern, meaning]) => (
          <div key={pattern} className="bg-gray-800 rounded p-2">
            <div className="text-sm font-medium text-cyber-blue capitalize">
              {pattern.replace(/([A-Z])/g, ' $1').trim()}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {meaning}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStabilityTypes = () => {
    if (!explanation.types) return null;
    
    return (
      <div className="mt-4 space-y-3">
        <h4 className="text-sm font-semibold text-cyber-green flex items-center gap-2">
          <Info size={16} />
          Stability Types
        </h4>
        {Object.entries(explanation.types).map(([type, info]) => (
          <div key={type} className="bg-gray-800 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{info.icon}</span>
              <span className="text-sm font-medium text-white capitalize">
                {type}
              </span>
            </div>
            <div className="text-xs text-gray-400 mb-1">
              {info.description}
            </div>
            <div className="text-xs text-cyber-blue">
              Cyber Meaning: {info.cyberMeaning}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`card ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800 rounded transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyber-blue/20 rounded-full flex items-center justify-center">
            <BookOpen size={16} className="text-cyber-blue" />
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {title || explanation.title}
            </h3>
            <p className="text-sm text-gray-400">
              Click to learn more about this concept
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp size={20} className="text-gray-400" />
        ) : (
          <ChevronDown size={20} className="text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-700">
          <div className="mt-4">
            <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
              {explanation.content}
            </div>
            
            {renderEquations()}
            {renderInterpretations()}
            {renderStabilityTypes()}
            
            {explanation.interpretation && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-semibold text-cyber-green">
                  Interpretation Guide
                </h4>
                {Object.entries(explanation.interpretation).map(([key, meaning]) => (
                  <div key={key} className="bg-gray-800 rounded p-2">
                    <div className="text-sm font-medium text-cyber-blue capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {meaning}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {explanation.variables && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-semibold text-cyber-green">
                  Variables
                </h4>
                {Object.entries(explanation.variables).map(([symbol, name]) => (
                  <div key={symbol} className="flex items-center gap-2">
                    <span className="font-mono text-cyber-blue font-bold">
                      {symbol}:
                    </span>
                    <span className="text-sm text-gray-300">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConceptExplainer;