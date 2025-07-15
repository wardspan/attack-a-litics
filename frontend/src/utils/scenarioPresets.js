// Predefined scenarios for educational purposes

export const SCENARIO_PRESETS = {
  balanced: {
    name: "Balanced Cyber Conflict",
    description: "A typical cyber conflict scenario with balanced attacker and defender capabilities",
    educational: "This scenario demonstrates a realistic cyber conflict where both sides have moderate capabilities. Watch how the system evolves over time and reaches equilibrium.",
    parameters: {
      // High-level controls
      conflictIntensity: 0.5,
      defenderAdvantage: 0.5,
      systemResilience: 0.5,
      
      // Underlying parameters
      alpha: 0.1,    // Defender growth rate
      beta: 0.02,    // Defender-attacker interaction
      gamma: 0.08,   // Attacker growth rate
      delta: 0.015,  // Defender vulnerability interaction
      epsilon: 0.01, // Attacker-vulnerability synergy
      eta: 0.025,    // Attacker-defender conflict
      theta: 0.03,   // Vulnerability generation by attackers
      lambda: 0.05,  // Vulnerability mitigation by defenders
      mu: 0.02,      // Natural vulnerability decay
      nu: 0.04,      // Intelligence generation by defenders
      xi: 0.03,      // Intelligence decay rate
      rho: 0.02,     // Intelligence-defender synergy
      sigma: 0.01,   // Intelligence-attacker counter
      
      // Initial conditions
      x0: 100.0,     // Initial defender capability
      y0: 50.0,      // Initial attacker capability
      z0: 30.0,      // Initial system vulnerability
      u0: 20.0,      // Initial threat intelligence
      
      // Simulation parameters
      time_span: 24.0,
      resolution: 0.1,
      solver_method: 'RK45'
    },
    expectedOutcome: "Stable node - system reaches equilibrium",
    keyInsights: [
      "Defenders ultimately gain advantage through threat intelligence",
      "Vulnerabilities are gradually reduced over time",
      "System reaches stable equilibrium after ~20 hours"
    ]
  },
  
  apt: {
    name: "Advanced Persistent Threat",
    description: "Sophisticated, long-term attack campaign with adaptive adversary",
    educational: "APTs are characterized by persistent, stealthy attacks that adapt to defenses. This scenario shows how a well-resourced attacker can maintain presence despite defensive efforts.",
    parameters: {
      conflictIntensity: 0.8,
      defenderAdvantage: 0.3,
      systemResilience: 0.4,
      
      alpha: 0.08,   // Slower defender growth
      beta: 0.04,    // Strong attacker impact on defenders
      gamma: 0.12,   // High attacker growth rate
      delta: 0.025,  // Vulnerabilities significantly impact defenders
      epsilon: 0.03, // Attackers exploit vulnerabilities well
      eta: 0.015,    // Defenders struggle against attackers
      theta: 0.05,   // Attackers create many vulnerabilities
      lambda: 0.03,  // Slower vulnerability mitigation
      mu: 0.01,      // Vulnerabilities persist longer
      nu: 0.03,      // Moderate intelligence generation
      xi: 0.04,      // Intelligence decays quickly (attacker adaptation)
      rho: 0.015,    // Limited intelligence-defender synergy
      sigma: 0.02,   // Moderate intelligence effectiveness
      
      x0: 80.0,      // Lower initial defender capability
      y0: 60.0,      // Higher initial attacker capability
      z0: 45.0,      // More initial vulnerabilities
      u0: 15.0,      // Limited initial intelligence
      
      time_span: 48.0,
      resolution: 0.1,
      solver_method: 'RK45'
    },
    expectedOutcome: "Unstable or saddle point - persistent threat",
    keyInsights: [
      "Attackers may maintain persistent presence",
      "Vulnerabilities remain elevated",
      "Intelligence gathering becomes critical"
    ]
  },
  
  effectiveIntelligence: {
    name: "Effective Threat Intelligence",
    description: "Scenario where threat intelligence significantly improves defensive capabilities",
    educational: "This demonstrates how effective threat intelligence sharing and analysis can dramatically improve cyber defense outcomes.",
    parameters: {
      conflictIntensity: 0.6,
      defenderAdvantage: 0.7,
      systemResilience: 0.8,
      
      alpha: 0.12,   // Strong defender growth
      beta: 0.015,   // Reduced attacker impact
      gamma: 0.06,   // Moderate attacker growth
      delta: 0.01,   // Vulnerabilities have less impact
      epsilon: 0.008, // Attackers exploit vulnerabilities less
      eta: 0.04,     // Strong defender countermeasures
      theta: 0.025,  // Moderate vulnerability generation
      lambda: 0.08,  // Strong vulnerability mitigation
      mu: 0.03,      // Faster natural vulnerability decay
      nu: 0.08,      // Strong intelligence generation
      xi: 0.02,      // Intelligence persists longer
      rho: 0.05,     // Strong intelligence-defender synergy
      sigma: 0.03,   // Intelligence effectively counters attackers
      
      x0: 90.0,
      y0: 40.0,
      z0: 25.0,
      u0: 35.0,      // High initial intelligence
      
      time_span: 24.0,
      resolution: 0.1,
      solver_method: 'RK45'
    },
    expectedOutcome: "Stable node - defenders dominate",
    keyInsights: [
      "Threat intelligence creates strong defensive advantage",
      "Vulnerabilities are rapidly reduced",
      "Attackers are effectively countered"
    ]
  },
  
  systemHardening: {
    name: "System Hardening Success",
    description: "Effective vulnerability management and system hardening",
    educational: "Shows how proactive vulnerability management and system hardening can create a robust defensive posture.",
    parameters: {
      conflictIntensity: 0.4,
      defenderAdvantage: 0.6,
      systemResilience: 0.9,
      
      alpha: 0.1,
      beta: 0.01,    // Attackers have less impact
      gamma: 0.05,   // Reduced attacker growth
      delta: 0.005,  // Vulnerabilities barely affect defenders
      epsilon: 0.005, // Attackers can't exploit vulnerabilities well
      eta: 0.03,
      theta: 0.02,   // Fewer vulnerabilities created
      lambda: 0.1,   // Excellent vulnerability mitigation
      mu: 0.05,      // Rapid natural vulnerability decay
      nu: 0.05,
      xi: 0.025,
      rho: 0.025,
      sigma: 0.015,
      
      x0: 110.0,     // Strong initial defenses
      y0: 35.0,      // Weaker initial attacks
      z0: 15.0,      // Few initial vulnerabilities
      u0: 25.0,
      
      time_span: 24.0,
      resolution: 0.1,
      solver_method: 'RK45'
    },
    expectedOutcome: "Stable node - highly secure system",
    keyInsights: [
      "Proactive hardening creates strong defensive position",
      "Vulnerabilities are minimized and quickly addressed",
      "System becomes increasingly secure over time"
    ]
  },
  
  defensiveFailure: {
    name: "Defensive Failure",
    description: "Scenario where defensive measures fail and attackers dominate",
    educational: "This shows what happens when defensive measures are inadequate or poorly implemented, leading to attacker dominance.",
    parameters: {
      conflictIntensity: 0.9,
      defenderAdvantage: 0.2,
      systemResilience: 0.3,
      
      alpha: 0.05,   // Weak defender growth
      beta: 0.06,    // Attackers severely impact defenders
      gamma: 0.15,   // Strong attacker growth
      delta: 0.04,   // Vulnerabilities severely weaken defenders
      epsilon: 0.05, // Attackers exploit vulnerabilities very well
      eta: 0.01,     // Defenders barely counter attackers
      theta: 0.08,   // Many vulnerabilities created
      lambda: 0.02,  // Poor vulnerability mitigation
      mu: 0.005,     // Vulnerabilities persist
      nu: 0.02,      // Poor intelligence generation
      xi: 0.06,      // Intelligence decays rapidly
      rho: 0.005,    // Minimal intelligence-defender synergy
      sigma: 0.005,  // Intelligence barely affects attackers
      
      x0: 60.0,      // Weak initial defenses
      y0: 80.0,      // Strong initial attacks
      z0: 60.0,      // Many initial vulnerabilities
      u0: 10.0,      // Minimal initial intelligence
      
      time_span: 24.0,
      resolution: 0.1,
      solver_method: 'RK45'
    },
    expectedOutcome: "Unstable system - attacker dominance",
    keyInsights: [
      "Inadequate defenses lead to attacker dominance",
      "Vulnerabilities multiply rapidly",
      "System becomes increasingly compromised"
    ]
  },
  
  oscillatingConflict: {
    name: "Oscillating Cyber Conflict",
    description: "Cyclic conflict where advantage shifts between attackers and defenders",
    educational: "This scenario demonstrates how cyber conflicts can exhibit periodic behavior, with advantage shifting back and forth.",
    parameters: {
      conflictIntensity: 0.7,
      defenderAdvantage: 0.5,
      systemResilience: 0.6,
      
      alpha: 0.12,   // Strong defender growth
      beta: 0.08,    // Strong interactions
      gamma: 0.1,    // Strong attacker growth
      delta: 0.02,
      epsilon: 0.02,
      eta: 0.06,     // Strong mutual conflict
      theta: 0.04,
      lambda: 0.06,
      mu: 0.02,
      nu: 0.06,
      xi: 0.03,
      rho: 0.04,
      sigma: 0.025,
      
      x0: 100.0,
      y0: 50.0,
      z0: 30.0,
      u0: 20.0,
      
      time_span: 48.0,
      resolution: 0.1,
      solver_method: 'RK45'
    },
    expectedOutcome: "Spiral behavior - oscillating conflict",
    keyInsights: [
      "Advantage shifts periodically between sides",
      "System exhibits cyclical behavior",
      "Long-term prediction becomes difficult"
    ]
  }
};

export const SCENARIO_CATEGORIES = {
  beginner: {
    name: "Beginner Scenarios",
    description: "Simple scenarios to understand basic concepts",
    scenarios: ['balanced', 'systemHardening']
  },
  intermediate: {
    name: "Intermediate Scenarios", 
    description: "More complex scenarios showing specific cyber security situations",
    scenarios: ['effectiveIntelligence', 'defensiveFailure']
  },
  advanced: {
    name: "Advanced Scenarios",
    description: "Complex scenarios with sophisticated dynamics",
    scenarios: ['apt', 'oscillatingConflict']
  }
};

// High-level control mappings
export const CONTROL_MAPPINGS = {
  conflictIntensity: {
    description: "Overall intensity of cyber conflict interactions",
    affects: ['beta', 'eta', 'theta', 'lambda'],
    formula: (intensity) => ({
      beta: 0.01 + intensity * 0.05,
      eta: 0.015 + intensity * 0.035,
      theta: 0.02 + intensity * 0.06,
      lambda: 0.03 + intensity * 0.05
    })
  },
  defenderAdvantage: {
    description: "How much advantage defenders have over attackers",
    affects: ['alpha', 'gamma', 'eta', 'sigma'],
    formula: (advantage) => ({
      alpha: 0.05 + advantage * 0.1,
      gamma: 0.12 - advantage * 0.08,
      eta: 0.01 + advantage * 0.04,
      sigma: 0.005 + advantage * 0.025
    })
  },
  systemResilience: {
    description: "How quickly the system recovers and adapts",
    affects: ['mu', 'nu', 'xi', 'rho', 'lambda'],
    formula: (resilience) => ({
      mu: 0.01 + resilience * 0.04,
      nu: 0.02 + resilience * 0.06,
      xi: 0.05 - resilience * 0.02,
      rho: 0.01 + resilience * 0.04,
      lambda: 0.03 + resilience * 0.05
    })
  }
};