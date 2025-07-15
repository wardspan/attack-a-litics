// Educational content and explanations for Attack-a-litics

export const CONCEPT_EXPLANATIONS = {
  // Mathematical concepts
  differentialEquations: {
    title: "Differential Equations in Cyber Conflict",
    content: `
      Our model uses a system of differential equations to describe how cyber capabilities evolve over time.
      Think of it like predicting the weather - we use mathematical relationships to forecast future states.
      
      Each equation shows how one variable (like Defender Capability) changes based on:
      • Its current value
      • Interactions with other variables
      • External influences (parameters)
      
      The beauty of this approach is that it captures the dynamic, interconnected nature of cyber warfare.
    `,
    equations: [
      {
        latex: "\\frac{dx}{dt} = \\alpha x - \\beta xy - \\delta xz + \\rho xu",
        description: "Defender Capability growth/decline rate"
      },
      {
        latex: "\\frac{dy}{dt} = \\gamma y - \\eta xy + \\epsilon yz - \\sigma yu",
        description: "Attacker Capability growth/decline rate"
      },
      {
        latex: "\\frac{dz}{dt} = \\theta y - \\lambda x - \\mu z",
        description: "System Vulnerability change rate"
      },
      {
        latex: "\\frac{du}{dt} = \\nu x - \\xi u",
        description: "Threat Intelligence change rate"
      }
    ]
  },
  
  phaseSpace: {
    title: "Phase Space Analysis",
    content: `
      Phase space is a mathematical concept that helps us visualize how systems evolve over time.
      Instead of plotting variables against time, we plot them against each other.
      
      In our 3D phase plot:
      • Each point represents the system state at one moment
      • The trajectory shows how the system evolves
      • Colors indicate progression through time (blue → red)
      • The shape tells us about system behavior
      
      Patterns you might see:
      • Spiral trajectories: Oscillating behavior
      • Straight lines: Monotonic changes
      • Closed loops: Periodic behavior
      • Converging paths: Stable outcomes
    `,
    interpretations: {
      convergent: "System reaches a stable equilibrium",
      divergent: "System becomes increasingly unstable",
      oscillatory: "System alternates between states",
      chaotic: "System exhibits unpredictable behavior"
    }
  },
  
  stability: {
    title: "Stability Analysis",
    content: `
      Stability analysis tells us about the long-term behavior of our cyber conflict system.
      We analyze the system's behavior near equilibrium points to predict outcomes.
      
      Key concepts:
      • Equilibrium: Where all variables stop changing
      • Stability: Whether small perturbations grow or shrink
      • Eigenvalues: Mathematical indicators of stability
      
      This analysis helps answer: "If we make small changes to our defenses, 
      will the system remain stable or become chaotic?"
    `,
    types: {
      "stable node": {
        description: "All trajectories converge to equilibrium",
        cyberMeaning: "Conflicts resolve to stable, predictable outcomes",
        icon: "🎯"
      },
      "unstable node": {
        description: "All trajectories diverge from equilibrium", 
        cyberMeaning: "Small changes lead to escalating cyber conflicts",
        icon: "💥"
      },
      "saddle point": {
        description: "Some trajectories converge, others diverge",
        cyberMeaning: "System behavior depends critically on initial conditions",
        icon: "⚖️"
      },
      "spiral sink": {
        description: "Trajectories spiral inward to equilibrium",
        cyberMeaning: "Oscillating conflicts that eventually stabilize",
        icon: "🌀"
      },
      "spiral source": {
        description: "Trajectories spiral outward from equilibrium",
        cyberMeaning: "Escalating conflicts with oscillating intensity",
        icon: "🌪️"
      },
      "center": {
        description: "Trajectories form closed orbits",
        cyberMeaning: "Perpetual cycles of attack and defense",
        icon: "🔄"
      }
    }
  },
  
  eigenvalues: {
    title: "Eigenvalues and System Behavior",
    content: `
      Eigenvalues are special numbers that tell us how a system behaves near equilibrium.
      Think of them as "growth rates" for different directions in phase space.
      
      What they tell us:
      • Positive eigenvalues: Growth/instability in that direction
      • Negative eigenvalues: Decay/stability in that direction
      • Complex eigenvalues: Oscillatory behavior
      • Zero eigenvalues: Neutral stability
      
      In cyber conflict:
      • All negative: Conflicts naturally resolve
      • Mixed signs: Sensitive to initial conditions
      • Complex values: Periodic cyber conflict cycles
    `,
    interpretation: {
      allNegative: "Stable system - conflicts resolve naturally",
      allPositive: "Unstable system - conflicts escalate",
      mixed: "Saddle point - outcome depends on starting conditions",
      complex: "Oscillatory behavior - cyclic conflicts"
    }
  },
  
  jacobian: {
    title: "Jacobian Matrix",
    content: `
      The Jacobian matrix shows how each variable influences every other variable's rate of change.
      It's like a "sensitivity analysis" - how does a small change in one variable affect others?
      
      Reading the matrix:
      • Rows represent variables (D, A, V, T)
      • Columns represent influences
      • Positive values: Reinforcing effect
      • Negative values: Opposing effect
      • Larger magnitude: Stronger influence
      
      This helps us understand:
      • Which variables are most influential
      • How changes propagate through the system
      • Why certain behaviors emerge
    `,
    variables: {
      D: "Defender Capability",
      A: "Attacker Capability", 
      V: "System Vulnerability",
      T: "Threat Intelligence"
    }
  }
};

export const VARIABLE_EXPLANATIONS = {
  x: {
    name: "Defender Capability",
    realWorld: "Strength of cybersecurity defenses",
    examples: [
      "Firewall effectiveness",
      "Intrusion detection systems",
      "Security team expertise",
      "Patch management speed",
      "Incident response capability"
    ],
    factors: {
      increases: ["Security training", "New defense tools", "Threat intelligence"],
      decreases: ["Successful attacks", "System vulnerabilities", "Resource constraints"]
    }
  },
  y: {
    name: "Attacker Capability", 
    realWorld: "Strength of cyber attack capabilities",
    examples: [
      "Malware sophistication",
      "Social engineering skills",
      "Zero-day exploit availability",
      "Botnet size and control",
      "Persistence mechanisms"
    ],
    factors: {
      increases: ["New attack techniques", "Exploiting vulnerabilities", "Learning from defenses"],
      decreases: ["Countermeasures", "Attribution efforts", "Defensive improvements"]
    }
  },
  z: {
    name: "System Vulnerability",
    realWorld: "Exploitable weaknesses in the system",
    examples: [
      "Unpatched software vulnerabilities",
      "Misconfigured systems",
      "Weak authentication",
      "Insider threats",
      "Supply chain risks"
    ],
    factors: {
      increases: ["New software deployment", "Attacker discovery", "System complexity"],
      decreases: ["Patching", "Security hardening", "Vulnerability management"]
    }
  },
  u: {
    name: "Threat Intelligence",
    realWorld: "Knowledge about current and emerging threats",
    examples: [
      "Indicators of compromise",
      "Attacker tactics and techniques",
      "Threat actor profiles",
      "Vulnerability assessments",
      "Security research findings"
    ],
    factors: {
      increases: ["Security research", "Threat sharing", "Incident analysis"],
      decreases: ["Information aging", "Attacker adaptation", "False positives"]
    }
  }
};

export const SOLVER_EXPLANATIONS = {
  "RK45": {
    name: "Runge-Kutta 4(5)",
    description: "Adaptive step-size method with good balance of speed and accuracy",
    whenToUse: "Default choice for most simulations",
    advantages: ["Automatic step size adjustment", "Good error control", "Efficient for smooth systems"],
    disadvantages: ["May struggle with very stiff systems"],
    educational: "This is like having a smart calculator that adjusts its precision automatically"
  },
  "DOP853": {
    name: "Dormand-Prince 8(5,3)",
    description: "High-precision method for demanding accuracy requirements",
    whenToUse: "When you need very high accuracy or have sensitive parameters",
    advantages: ["Excellent accuracy", "Good for sensitive systems", "Robust error control"],
    disadvantages: ["Slower than RK45", "More computationally expensive"],
    educational: "Like using a high-precision instrument - slower but more accurate"
  },
  "RK23": {
    name: "Runge-Kutta 2(3)",
    description: "Lower-order method for quick exploration",
    whenToUse: "Rapid prototyping or when speed is more important than precision",
    advantages: ["Fast computation", "Good for quick parameter exploration"],
    disadvantages: ["Less accurate", "May miss important dynamics"],
    educational: "Like sketching - fast but less detailed"
  },
  "Radau": {
    name: "Radau IIA",
    description: "Implicit solver excellent for stiff differential equations",
    whenToUse: "When system has very fast and very slow dynamics (stiff systems)",
    advantages: ["Excellent for stiff problems", "Very stable", "Good for large parameter ranges"],
    disadvantages: ["Slower for non-stiff problems", "More complex"],
    educational: "Like having specialized tools for difficult problems"
  },
  "BDF": {
    name: "Backward Differentiation Formula",
    description: "Implicit method specifically designed for stiff systems",
    whenToUse: "Very stiff systems with rapid changes",
    advantages: ["Best for very stiff systems", "Stable for difficult problems"],
    disadvantages: ["Not suitable for non-stiff systems", "Can be slow"],
    educational: "The specialist tool for the most challenging mathematical problems"
  },
  "LSODA": {
    name: "Livermore Solver (Automatic)",
    description: "Automatically switches between methods based on system stiffness",
    whenToUse: "When you're unsure about system stiffness or it changes over time",
    advantages: ["Automatic method selection", "Handles both stiff and non-stiff", "Robust"],
    disadvantages: ["May not be optimal for specific cases", "More complex"],
    educational: "Like having an AI assistant that picks the right tool automatically"
  }
};

export const TOOLTIPS = {
  conflictIntensity: "Higher values increase the strength of attacker-defender interactions",
  defenderAdvantage: "Affects how effectively defenses counter attacks and reduce vulnerabilities",
  systemResilience: "Determines how quickly the system recovers and processes threat intelligence",
  timeSpan: "Simulation duration - longer times show more system evolution",
  resolution: "Smaller values = more accurate simulation but slower computation",
  solverMethod: "Mathematical method used to solve the differential equations",
  
  // Stability tooltips
  eigenvaluesReal: "Real eigenvalues indicate exponential growth/decay behavior",
  eigenvaluesComplex: "Complex eigenvalues indicate oscillatory (spiral) behavior",
  jacobianElement: "Shows how much variable in column affects rate of change of variable in row"
};