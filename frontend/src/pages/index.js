import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { 
  Play, 
  Pause, 
  AlertCircle, 
  CheckCircle, 
  Wifi, 
  WifiOff, 
  BookOpen, 
  HelpCircle,
  Lightbulb,
  RefreshCw
} from 'lucide-react';

// Educational components
import GuidedTour, { useTour } from '../components/education/GuidedTour';
import ConceptExplainer from '../components/education/ConceptExplainer';

// Control components
import ScenarioBuilder from '../components/controls/ScenarioBuilder';
import SolverSettings from '../components/controls/SolverSettings';
import ParameterControls from '../components/ParameterControls';

// Visualization components
import AnnotatedTimeSeries from '../components/visualizations/AnnotatedTimeSeries';
import EducationalPhasePlot from '../components/visualizations/EducationalPhasePlot';
import InteractiveAnalysis from '../components/visualizations/InteractiveAnalysis';

// UI components
import ErrorBoundary from '../components/ui/ErrorBoundary';

// Utilities
import { simulateSystem, checkBackendHealth } from '../utils/api';
import { DEFAULT_PARAMETERS, LOADING_STATES } from '../utils/constants';
import { SCENARIO_PRESETS } from '../utils/scenarioPresets';

export default function Home() {
  const [parameters, setParameters] = useState(DEFAULT_PARAMETERS);
  const [simulationData, setSimulationData] = useState(null);
  const [loadingState, setLoadingState] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('unknown');
  const [currentScenario, setCurrentScenario] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Tour management
  const { showTour, startTour, endTour, isNewUser, markUserAsVisited } = useTour();

  // Check backend health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await checkBackendHealth();
        setBackendStatus(health.success ? 'healthy' : 'unhealthy');
      } catch (error) {
        console.error('Health check error:', error);
        setBackendStatus('unhealthy');
      }
    };
    
    let interval;
    
    // Add a small delay to allow the Next.js dev server to be ready
    const initialDelay = setTimeout(() => {
      checkHealth();
      interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    }, 1000);
    
    return () => {
      clearTimeout(initialDelay);
      if (interval) clearInterval(interval);
    };
  }, []);

  // Show tour for new users
  useEffect(() => {
    if (isNewUser() && backendStatus === 'healthy') {
      setTimeout(() => {
        startTour();
      }, 1000);
    }
  }, [backendStatus, isNewUser, startTour]);

  const handleParameterChange = useCallback((name, value) => {
    setParameters(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleParametersChange = useCallback((newParameters) => {
    setParameters(newParameters);
  }, []);

  const handleScenarioLoad = useCallback((scenario) => {
    setCurrentScenario(scenario);
    setParameters(scenario.parameters);
  }, []);

  const handleReset = useCallback(() => {
    setParameters(DEFAULT_PARAMETERS);
    setSimulationData(null);
    setError(null);
    setLoadingState(LOADING_STATES.IDLE);
    setCurrentScenario(null);
  }, []);

  const handleSimulate = useCallback(async () => {
    setLoadingState(LOADING_STATES.LOADING);
    setError(null);
    
    try {
      const result = await simulateSystem(parameters);
      
      if (result.success) {
        setSimulationData(result.data);
        setLoadingState(LOADING_STATES.SUCCESS);
      } else {
        setError(result.error);
        setLoadingState(LOADING_STATES.ERROR);
      }
    } catch (err) {
      setError('An unexpected error occurred during simulation');
      setLoadingState(LOADING_STATES.ERROR);
    }
  }, [parameters]);

  const handleTourComplete = useCallback((scenarioId) => {
    markUserAsVisited();
    if (scenarioId && SCENARIO_PRESETS[scenarioId]) {
      handleScenarioLoad(SCENARIO_PRESETS[scenarioId]);
    }
  }, [markUserAsVisited, handleScenarioLoad]);

  const isLoading = loadingState === LOADING_STATES.LOADING;
  const hasError = loadingState === LOADING_STATES.ERROR;
  const hasResults = loadingState === LOADING_STATES.SUCCESS && simulationData;

  return (
    <>
      <Head>
        <title>Attack-a-litics | Educational Cyber Warfare Simulation</title>
        <meta name="description" content="Learn about cyber conflict dynamics through interactive mathematical simulation using Lotka-Volterra equations" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-dark-bg">
        {/* Header */}
        <header className="bg-card-bg border-b border-border-color sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-gradient">
                  Attack-a-litics
                </div>
                <div className="text-sm text-gray-400">
                  Educational Cyber Warfare Simulation
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Help Menu */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={startTour}
                    className="text-sm text-cyber-blue hover:text-cyber-blue/80 transition-colors flex items-center gap-1"
                  >
                    <HelpCircle size={16} />
                    Tour
                  </button>
                  
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-sm text-cyber-purple hover:text-cyber-purple/80 transition-colors flex items-center gap-1"
                  >
                    <Lightbulb size={16} />
                    {showAdvanced ? 'Simple' : 'Advanced'}
                  </button>
                </div>

                {/* Backend Status */}
                <div className="flex items-center space-x-2">
                  {backendStatus === 'healthy' ? (
                    <Wifi size={16} className="text-cyber-green" />
                  ) : (
                    <WifiOff size={16} className="text-cyber-red" />
                  )}
                  <span className="text-sm text-gray-400">
                    Backend {backendStatus}
                  </span>
                </div>

                {/* Simulation Controls */}
                <div className="flex items-center space-x-2" data-tour="simulate">
                  <button
                    onClick={handleSimulate}
                    disabled={isLoading || backendStatus !== 'healthy'}
                    className="button-primary flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <Pause size={16} />
                        <span>Running...</span>
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        <span>Simulate</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleReset}
                    disabled={isLoading}
                    className="button-secondary flex items-center space-x-1"
                  >
                    <RefreshCw size={14} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Status Messages */}
          {hasError && (
            <div className="mb-6 p-4 bg-cyber-red/10 border border-cyber-red/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle size={18} className="text-cyber-red" />
                <span className="text-cyber-red font-medium">Simulation Error</span>
              </div>
              <p className="text-red-300 text-sm mt-2">{error}</p>
            </div>
          )}

          {hasResults && (
            <div className="mb-6 p-4 bg-cyber-green/10 border border-cyber-green/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle size={18} className="text-cyber-green" />
                <span className="text-cyber-green font-medium">Simulation Complete</span>
              </div>
              <p className="text-green-300 text-sm mt-2">
                {currentScenario && `Scenario: ${currentScenario.name} • `}
                Successfully simulated {simulationData?.metadata?.data_points || 0} data points over {simulationData?.metadata?.simulation_time || 0} hours
              </p>
            </div>
          )}

          {/* Educational Introduction */}
          {!hasResults && (
            <div className="mb-8">
              <ConceptExplainer 
                concept="differentialEquations"
                title="Welcome to Attack-a-litics!"
              />
            </div>
          )}

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Controls */}
            <div className="xl:col-span-1 space-y-6">
              {/* Scenario Builder */}
              <div data-tour="scenarios">
                <ScenarioBuilder
                  onParametersChange={handleParametersChange}
                  onScenarioLoad={handleScenarioLoad}
                  currentParameters={parameters}
                />
              </div>

              {/* Solver Settings */}
              <div data-tour="solver">
                <SolverSettings
                  parameters={parameters}
                  onParametersChange={handleParametersChange}
                />
              </div>

              {/* Advanced Parameter Controls */}
              {showAdvanced && (
                <div data-tour="controls">
                  <ParameterControls
                    parameters={parameters}
                    onParameterChange={handleParameterChange}
                    onReset={handleReset}
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>

            {/* Right Column - Visualizations */}
            <div className="xl:col-span-2 space-y-8" data-tour="visualizations">
              {/* Time Series Plot */}
              <ErrorBoundary fallbackMessage="Failed to load time series visualization">
                <AnnotatedTimeSeries
                  data={simulationData}
                  loading={isLoading}
                  error={hasError ? error : null}
                  height={400}
                  parameters={parameters}
                  currentScenario={currentScenario}
                />
              </ErrorBoundary>

              {/* 3D Phase Plot and Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ErrorBoundary fallbackMessage="Failed to load phase space visualization">
                  <EducationalPhasePlot
                    data={simulationData}
                    loading={isLoading}
                    error={hasError ? error : null}
                    height={400}
                  />
                </ErrorBoundary>
                
                <ErrorBoundary fallbackMessage="Failed to load mathematical analysis">
                  <InteractiveAnalysis
                    data={simulationData}
                    loading={isLoading}
                    error={hasError ? error : null}
                  />
                </ErrorBoundary>
              </div>
            </div>
          </div>

          {/* Educational Content Section */}
          <div className="mt-16 space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                <BookOpen size={24} className="text-cyber-blue" />
                Learn More About Cyber Conflict Dynamics
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Explore the mathematical concepts behind cyber warfare simulation and understand 
                how differential equations model complex security scenarios.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ConceptExplainer 
                concept="phaseSpace"
                title="Phase Space Analysis"
              />
              <ConceptExplainer 
                concept="stability"
                title="Stability Theory"
              />
              <ConceptExplainer 
                concept="eigenvalues"
                title="Eigenvalue Analysis"
              />
              <ConceptExplainer 
                concept="jacobian"
                title="Jacobian Matrix"
              />
            </div>
          </div>

          {/* Variable Explanations */}
          <div className="mt-16">
            <h2 className="text-xl font-bold text-white mb-6 text-center">
              Understanding the Variables
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-4 h-4 bg-cyber-green rounded-full"></div>
                  <h3 className="text-white font-semibold">Defender Capability</h3>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  Strength and effectiveness of defensive systems over time
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Examples:</strong> Firewall strength, incident response speed, security team expertise
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-4 h-4 bg-cyber-red rounded-full"></div>
                  <h3 className="text-white font-semibold">Attacker Capability</h3>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  Strength and effectiveness of attacking systems over time
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Examples:</strong> Malware sophistication, social engineering skills, zero-day exploits
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <h3 className="text-white font-semibold">System Vulnerability</h3>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  Amount of exploitable weaknesses in the system over time
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Examples:</strong> Unpatched software, misconfigurations, insider threats
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-4 h-4 bg-cyber-purple rounded-full"></div>
                  <h3 className="text-white font-semibold">Threat Intelligence</h3>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  Amount of actionable threat information available over time
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Examples:</strong> IOCs, threat actor profiles, vulnerability assessments
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-card-bg border-t border-border-color mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Attack-a-litics • Educational Cyber Warfare Simulation using Lotka-Volterra Dynamics
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Built with Next.js, React, Plotly.js, and FastAPI • Designed for cybersecurity education
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Guided Tour */}
      <GuidedTour
        isOpen={showTour}
        onClose={endTour}
        onStartSimulation={handleTourComplete}
      />
    </>
  );
}