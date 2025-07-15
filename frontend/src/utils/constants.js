// Default parameter values and constraints
export const DEFAULT_PARAMETERS = {
  // Differential equation parameters
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
  time_span: 24.0,     // Simulation time in hours
  resolution: 0.1,     // Time step resolution
  solver_method: 'RK45', // ODE solver method
};

// Parameter constraints for validation
export const PARAMETER_CONSTRAINTS = {
  alpha: { min: 0.01, max: 1.0, step: 0.01 },
  beta: { min: 0.001, max: 0.1, step: 0.001 },
  gamma: { min: 0.01, max: 1.0, step: 0.01 },
  delta: { min: 0.001, max: 0.1, step: 0.001 },
  epsilon: { min: 0.001, max: 0.1, step: 0.001 },
  eta: { min: 0.001, max: 0.1, step: 0.001 },
  theta: { min: 0.001, max: 0.1, step: 0.001 },
  lambda: { min: 0.001, max: 0.2, step: 0.001 },
  mu: { min: 0.001, max: 0.1, step: 0.001 },
  nu: { min: 0.001, max: 0.2, step: 0.001 },
  xi: { min: 0.001, max: 0.1, step: 0.001 },
  rho: { min: 0.001, max: 0.1, step: 0.001 },
  sigma: { min: 0.001, max: 0.1, step: 0.001 },
  
  x0: { min: 10, max: 500, step: 1 },
  y0: { min: 10, max: 500, step: 1 },
  z0: { min: 5, max: 200, step: 1 },
  u0: { min: 5, max: 200, step: 1 },
  
  time_span: { min: 6, max: 168, step: 0.5 },
  resolution: { min: 0.01, max: 1.0, step: 0.01 },
};

// Parameter descriptions for tooltips
export const PARAMETER_DESCRIPTIONS = {
  alpha: 'Defender growth rate - how quickly defenders naturally improve their capabilities',
  beta: 'Defender-attacker interaction - how much attackers reduce defender effectiveness',
  gamma: 'Attacker growth rate - how quickly attackers naturally improve their capabilities',
  delta: 'Defender vulnerability interaction - how much vulnerabilities weaken defenders',
  epsilon: 'Attacker-vulnerability synergy - how much vulnerabilities boost attacker effectiveness',
  eta: 'Attacker-defender conflict - how much defenders reduce attacker effectiveness',
  theta: 'Vulnerability generation by attackers - how much attackers create new vulnerabilities',
  lambda: 'Vulnerability mitigation by defenders - how much defenders reduce vulnerabilities',
  mu: 'Natural vulnerability decay - how quickly vulnerabilities naturally disappear',
  nu: 'Intelligence generation by defenders - how much defenders create threat intelligence',
  xi: 'Intelligence decay rate - how quickly threat intelligence becomes outdated',
  rho: 'Intelligence-defender synergy - how much intelligence boosts defender effectiveness',
  sigma: 'Intelligence-attacker counter - how much intelligence reduces attacker effectiveness',
  
  x0: 'Initial defender capability - starting strength of defensive systems',
  y0: 'Initial attacker capability - starting strength of attacking systems',
  z0: 'Initial system vulnerability - starting amount of system weaknesses',
  u0: 'Initial threat intelligence - starting amount of threat information',
  
  time_span: 'Simulation duration in hours (6-168 hours = 1 week maximum)',
  resolution: 'Time step size for simulation accuracy (smaller = more accurate)',
  solver_method: 'Numerical method for solving differential equations',
};

// Variable names and descriptions
export const VARIABLES = {
  x: {
    name: 'Defender Capability',
    symbol: 'x(t)',
    color: '#2ed573', // cyber-green
    description: 'Strength and effectiveness of defensive systems over time',
  },
  y: {
    name: 'Attacker Capability',
    symbol: 'y(t)',
    color: '#ff4757', // cyber-red
    description: 'Strength and effectiveness of attacking systems over time',
  },
  z: {
    name: 'System Vulnerability',
    symbol: 'z(t)',
    color: '#ffa502', // orange
    description: 'Amount of exploitable weaknesses in the system over time',
  },
  u: {
    name: 'Threat Intelligence',
    symbol: 'u(t)',
    color: '#a55eea', // cyber-purple
    description: 'Amount of actionable threat information available over time',
  },
};

// Solver method options
export const SOLVER_METHODS = [
  { value: 'RK45', label: 'RK45 (Runge-Kutta)', description: 'General purpose, good balance of speed and accuracy' },
  { value: 'DOP853', label: 'DOP853 (Dormand-Prince)', description: 'High accuracy, slower but very precise' },
  { value: 'Radau', label: 'Radau (Implicit)', description: 'Good for stiff equations, stable' },
  { value: 'BDF', label: 'BDF (Backward Differentiation)', description: 'Best for stiff equations' },
  { value: 'LSODA', label: 'LSODA (Automatic)', description: 'Automatically switches between methods' },
];

// Stability classifications
export const STABILITY_TYPES = {
  'stable node': {
    color: '#2ed573',
    description: 'All trajectories converge to equilibrium',
    interpretation: 'System reaches stable balance',
  },
  'unstable node': {
    color: '#ff4757',
    description: 'All trajectories diverge from equilibrium',
    interpretation: 'System becomes increasingly unstable',
  },
  'saddle point': {
    color: '#ffa502',
    description: 'Some trajectories converge, others diverge',
    interpretation: 'System behavior depends on initial conditions',
  },
  'spiral sink': {
    color: '#00d4ff',
    description: 'Trajectories spiral inward to equilibrium',
    interpretation: 'System oscillates while stabilizing',
  },
  'spiral source': {
    color: '#a55eea',
    description: 'Trajectories spiral outward from equilibrium',
    interpretation: 'System oscillates while destabilizing',
  },
  'center': {
    color: '#7bed9f',
    description: 'Trajectories form closed orbits',
    interpretation: 'System exhibits periodic behavior',
  },
};

// Plot configurations
export const PLOT_CONFIG = {
  displayModeBar: true,
  modeBarButtonsToRemove: ['select2d', 'lasso2d', 'hoverCompareCartesian', 'hoverClosestCartesian'],
  displaylogo: false,
  responsive: true,
  toImageButtonOptions: {
    format: 'png',
    filename: 'attack-a-litics-plot',
    height: 800,
    width: 1200,
    scale: 2,
  },
};

// Loading states
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};