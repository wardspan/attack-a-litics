import React, { useState, useEffect } from 'react';
import { 
  Target, 
  RefreshCw, 
  BookOpen, 
  ChevronDown, 
  ChevronUp,
  Play,
  Info,
  Users,
  Shield,
  Zap
} from 'lucide-react';
import { SCENARIO_PRESETS, SCENARIO_CATEGORIES, CONTROL_MAPPINGS } from '../../utils/scenarioPresets';

const ScenarioBuilder = ({ 
  onParametersChange, 
  onScenarioLoad, 
  className = "",
  currentParameters = {}
}) => {
  const [selectedCategory, setSelectedCategory] = useState('beginner');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [showDetails, setShowDetails] = useState({});
  const [highLevelControls, setHighLevelControls] = useState({
    conflictIntensity: 0.5,
    defenderAdvantage: 0.5,
    systemResilience: 0.5
  });
  const [isCustomMode, setIsCustomMode] = useState(false);

  useEffect(() => {
    if (!isCustomMode) {
      updateParametersFromControls();
    }
  }, [highLevelControls, isCustomMode]);

  const updateParametersFromControls = () => {
    const newParameters = { ...currentParameters };
    
    // Apply high-level control mappings
    Object.entries(CONTROL_MAPPINGS).forEach(([control, mapping]) => {
      const controlValue = highLevelControls[control];
      const parameterUpdates = mapping.formula(controlValue);
      Object.assign(newParameters, parameterUpdates);
    });
    
    onParametersChange(newParameters);
  };

  const handleControlChange = (control, value) => {
    setHighLevelControls(prev => ({
      ...prev,
      [control]: value
    }));
  };

  const handleScenarioSelect = (scenarioId) => {
    const scenario = SCENARIO_PRESETS[scenarioId];
    if (scenario) {
      setSelectedScenario(scenarioId);
      setHighLevelControls({
        conflictIntensity: scenario.parameters.conflictIntensity,
        defenderAdvantage: scenario.parameters.defenderAdvantage,
        systemResilience: scenario.parameters.systemResilience
      });
      onParametersChange(scenario.parameters);
      onScenarioLoad?.(scenario);
    }
  };

  const handleReset = () => {
    setHighLevelControls({
      conflictIntensity: 0.5,
      defenderAdvantage: 0.5,
      systemResilience: 0.5
    });
    setSelectedScenario(null);
    setIsCustomMode(false);
  };

  const toggleDetails = (scenarioId) => {
    setShowDetails(prev => ({
      ...prev,
      [scenarioId]: !prev[scenarioId]
    }));
  };

  const getControlIcon = (control) => {
    const iconMap = {
      conflictIntensity: <Zap className="text-cyber-red" size={16} />,
      defenderAdvantage: <Shield className="text-cyber-green" size={16} />,
      systemResilience: <Target className="text-cyber-blue" size={16} />
    };
    return iconMap[control];
  };

  const getControlColor = (control) => {
    const colorMap = {
      conflictIntensity: 'cyber-red',
      defenderAdvantage: 'cyber-green',
      systemResilience: 'cyber-blue'
    };
    return colorMap[control];
  };

  const getControlDescription = (control) => {
    const descMap = {
      conflictIntensity: 'Higher intensity = more aggressive attacker-defender interactions',
      defenderAdvantage: 'Affects how effectively defenses counter attacks',
      systemResilience: 'How quickly vulnerabilities are patched and intelligence processed'
    };
    return descMap[control];
  };

  const getControlLabel = (control) => {
    const labelMap = {
      conflictIntensity: 'Conflict Intensity',
      defenderAdvantage: 'Defender Advantage', 
      systemResilience: 'System Resilience'
    };
    return labelMap[control] || control;
  };

  const ControlSlider = ({ control, value, onChange }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getControlIcon(control)}
          <span className="text-sm font-medium text-white">
            {getControlLabel(control)}
          </span>
        </div>
        <span className="text-sm text-gray-400">
          {Math.round(value * 100)}%
        </span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={value}
          onChange={(e) => onChange(control, parseFloat(e.target.value))}
          className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-${getControlColor(control)}`}
        />
        <div 
          className={`absolute top-0 left-0 h-2 bg-${getControlColor(control)} rounded-lg transition-all duration-200`}
          style={{ width: `${value * 100}%` }}
        />
      </div>
      
      <p className="text-xs text-gray-500">
        {getControlDescription(control)}
      </p>
    </div>
  );

  const ScenarioCard = ({ scenarioId, scenario }) => (
    <div className={`border rounded-lg transition-all cursor-pointer ${
      selectedScenario === scenarioId 
        ? 'border-cyber-blue bg-cyber-blue/10' 
        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
    }`}>
      <div 
        className="p-4"
        onClick={() => handleScenarioSelect(scenarioId)}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-white">{scenario.name}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleDetails(scenarioId);
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {showDetails[scenarioId] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        
        <p className="text-sm text-gray-400 mb-3">
          {scenario.description}
        </p>
        
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-1 bg-gray-700 rounded">
            {scenario.expectedOutcome}
          </span>
          <span className="text-gray-500">
            {scenario.parameters.time_span}h simulation
          </span>
        </div>
      </div>
      
      {showDetails[scenarioId] && (
        <div className="px-4 pb-4 border-t border-gray-700">
          <div className="mt-3 space-y-3">
            <div className="p-3 bg-cyber-blue/10 rounded-lg">
              <h4 className="text-sm font-semibold text-cyber-blue mb-1">
                Educational Focus
              </h4>
              <p className="text-xs text-gray-300">
                {scenario.educational}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-cyber-green mb-2">
                Key Insights
              </h4>
              <ul className="text-xs text-gray-400 space-y-1">
                {scenario.keyInsights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-cyber-green">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`card ${className}`}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyber-green/20 rounded-full flex items-center justify-center">
              <Target size={16} className="text-cyber-green" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Scenario Builder</h3>
              <p className="text-sm text-gray-400">
                Choose scenarios or customize parameters
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* High-level Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-cyber-green">
              Quick Controls
            </h4>
            <button
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="text-xs text-cyber-blue hover:text-cyber-blue/80 transition-colors"
            >
              {isCustomMode ? 'Use Quick Controls' : 'Custom Mode'}
            </button>
          </div>
          
          {!isCustomMode && (
            <div className="space-y-4">
              {Object.entries(highLevelControls).map(([control, value]) => (
                <ControlSlider
                  key={control}
                  control={control}
                  value={value}
                  onChange={handleControlChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Scenario Categories */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-cyber-green flex items-center gap-2">
            <BookOpen size={16} />
            Pre-built Scenarios
          </h4>
          
          <div className="flex gap-2">
            {Object.entries(SCENARIO_CATEGORIES).map(([categoryId, category]) => (
              <button
                key={categoryId}
                onClick={() => setSelectedCategory(categoryId)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  selectedCategory === categoryId
                    ? 'bg-cyber-blue text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <p className="text-xs text-gray-400">
            {SCENARIO_CATEGORIES[selectedCategory].description}
          </p>
        </div>

        {/* Scenario Cards */}
        <div className="space-y-3">
          {SCENARIO_CATEGORIES[selectedCategory].scenarios.map(scenarioId => (
            <ScenarioCard
              key={scenarioId}
              scenarioId={scenarioId}
              scenario={SCENARIO_PRESETS[scenarioId]}
            />
          ))}
        </div>

        {/* Current Selection Summary */}
        {selectedScenario && (
          <div className="p-3 bg-cyber-blue/10 rounded-lg border border-cyber-blue/20">
            <h4 className="text-sm font-semibold text-cyber-blue mb-2 flex items-center gap-2">
              <Play size={14} />
              Current Selection
            </h4>
            <p className="text-sm text-gray-300">
              {SCENARIO_PRESETS[selectedScenario].name}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Ready to simulate with these parameters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioBuilder;