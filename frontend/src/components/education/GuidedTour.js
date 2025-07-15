import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Play, 
  BookOpen, 
  Settings, 
  BarChart3, 
  Target,
  Lightbulb
} from 'lucide-react';

// Simple markdown renderer fallback
const SimpleMarkdownRenderer = ({ content }) => {
  const renderContent = (text) => {
    // Convert **text** to <strong>text</strong>
    const withBold = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
    // Convert - list items to proper list
    const lines = withBold.split('\n');
    const result = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('- ')) {
        // Start of list or continue list
        if (result.length === 0 || !result[result.length - 1].includes('<ul>')) {
          result.push('<ul class="list-disc list-inside space-y-1 my-2 text-gray-300">');
        }
        result.push(`<li class="text-gray-300">${line.substring(2)}</li>`);
      } else if (line === '') {
        // Empty line - close list if open
        if (result.length > 0 && result[result.length - 1].includes('<li>')) {
          result.push('</ul>');
        }
        result.push('<br />');
      } else {
        // Regular paragraph
        if (result.length > 0 && result[result.length - 1].includes('<li>')) {
          result.push('</ul>');
        }
        result.push(`<p class="mb-2 text-gray-300">${line}</p>`);
      }
    }
    
    // Close any open lists
    if (result.length > 0 && result[result.length - 1].includes('<li>')) {
      result.push('</ul>');
    }
    
    return result.join('');
  };
  
  return (
    <div 
      className="space-y-3"
      dangerouslySetInnerHTML={{ __html: renderContent(content) }}
    />
  );
};

const GuidedTour = ({ isOpen, onClose, onStartSimulation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentStep(0);
    }
  }, [isOpen]);

  const tourSteps = [
    {
      id: 'welcome',
      title: 'Welcome to Attack-a-litics!',
      content: `This simulation helps you understand cyber conflict dynamics using mathematical models.
      
      You'll explore how defenders and attackers interact in cyberspace through:
      - Interactive parameter controls
      - Real-time visualizations
      - Mathematical stability analysis
      
      Let's take a quick tour to get you started!`,
      icon: <Lightbulb className="text-cyber-green" size={24} />,
      position: 'center'
    },
    {
      id: 'scenarios',
      title: 'Choose Your Scenario',
      content: `Start with pre-built scenarios to understand different cyber conflict situations:
      
      - **Balanced Conflict**: Typical cyber warfare dynamics
      - **APT Campaign**: Advanced persistent threat simulation
      - **Effective Intelligence**: How threat intel improves defense
      - **System Hardening**: Proactive security measures
      
      Each scenario teaches different concepts and includes explanations.`,
      icon: <Target className="text-cyber-blue" size={24} />,
      position: 'left',
      target: '[data-tour="scenarios"]'
    },
    {
      id: 'controls',
      title: 'Adjust Parameters',
      content: `Control the simulation with three main settings:
      
      - **Conflict Intensity**: How aggressive the interactions are
      - **Defender Advantage**: How much advantage defenders have
      - **System Resilience**: How quickly the system recovers
      
      Advanced users can fine-tune individual parameters below.`,
      icon: <Settings className="text-cyber-purple" size={24} />,
      position: 'left',
      target: '[data-tour="controls"]'
    },
    {
      id: 'solver',
      title: 'Select Solver Method',
      content: `Choose how the mathematical equations are solved:
      
      - **RK45**: Recommended for beginners (good balance)
      - **DOP853**: High accuracy for sensitive analysis
      - **Radau**: Best for stiff/difficult systems
      
      Don't worry - RK45 works great for most scenarios!`,
      icon: <Settings className="text-cyber-green" size={24} />,
      position: 'left',
      target: '[data-tour="solver"]'
    },
    {
      id: 'simulate',
      title: 'Run Your Simulation',
      content: `Once you've set your parameters, click the Simulate button to run the analysis.
      
      The simulation will:
      - Solve the differential equations
      - Generate time series data
      - Compute stability analysis
      - Create visualizations
      
      Results appear in real-time below!`,
      icon: <Play className="text-cyber-blue" size={24} />,
      position: 'right',
      target: '[data-tour="simulate"]'
    },
    {
      id: 'visualizations',
      title: 'Explore the Results',
      content: `After simulation, you'll see three main visualizations:
      
      - **Time Series**: How variables change over time
      - **3D Phase Plot**: System behavior in phase space
      - **Stability Analysis**: Mathematical analysis of equilibrium
      
      Each includes explanations to help you understand the results.`,
      icon: <BarChart3 className="text-cyber-green" size={24} />,
      position: 'right',
      target: '[data-tour="visualizations"]'
    },
    {
      id: 'learn',
      title: 'Keep Learning',
      content: `Look for these educational features throughout the interface:
      
      - **Info panels**: Click "What does this show?" for explanations
      - **Tooltips**: Hover over elements for quick help
      - **Concept explanations**: Learn about mathematical concepts
      - **Scenario comparisons**: Try different scenarios to see differences
      
      Ready to start exploring?`,
      icon: <BookOpen className="text-cyber-purple" size={24} />,
      position: 'center'
    }
  ];

  const currentStepData = tourSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      // Optionally start with a default scenario
      if (onStartSimulation) {
        onStartSimulation('balanced');
      }
    }, 300);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-gray-900 rounded-lg border border-gray-700 max-w-2xl w-full shadow-2xl transform transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {currentStepData.icon}
            <h2 className="text-xl font-bold text-white">
              {currentStepData.title}
            </h2>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-gray-300 leading-relaxed">
            <SimpleMarkdownRenderer content={currentStepData.content} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {tourSteps.length}
            </span>
            <div className="flex gap-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-cyber-blue' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Skip Tour
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors ${
                  currentStep === 0 
                    ? 'text-gray-600 cursor-not-allowed' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2 bg-cyber-blue text-white rounded hover:bg-cyber-blue/80 transition-colors"
              >
                {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
                {currentStep !== tourSteps.length - 1 && <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook for managing tour state
export const useTour = () => {
  const [showTour, setShowTour] = useState(false);
  
  const startTour = () => setShowTour(true);
  const endTour = () => setShowTour(false);
  
  // Check if user is new (you might want to use localStorage)
  const isNewUser = () => {
    return !localStorage.getItem('attackalyticsVisited');
  };
  
  const markUserAsVisited = () => {
    localStorage.setItem('attackalyticsVisited', 'true');
  };
  
  return {
    showTour,
    startTour,
    endTour,
    isNewUser,
    markUserAsVisited
  };
};

export default GuidedTour;