import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';

const EquationDisplay = ({ 
  equation, 
  inline = false, 
  className = '',
  display = true
}) => {
  if (!equation) return null;

  const commonProps = {
    math: equation,
    renderError: (error) => (
      <span className="text-red-400 text-sm">
        Error rendering equation: {error.message}
      </span>
    )
  };

  if (inline) {
    return (
      <span className={`inline-block ${className}`}>
        <InlineMath {...commonProps} />
      </span>
    );
  }

  return (
    <div className={`equation-display ${className}`}>
      <BlockMath {...commonProps} />
    </div>
  );
};

// Pre-defined equations for the cyber warfare model
export const CYBER_EQUATIONS = {
  defender: "\\frac{dx}{dt} = \\alpha x - \\beta xy - \\delta xz + \\rho xu",
  attacker: "\\frac{dy}{dt} = \\gamma y - \\eta xy + \\epsilon yz - \\sigma yu",
  vulnerability: "\\frac{dz}{dt} = \\theta y - \\lambda x - \\mu z",
  intelligence: "\\frac{du}{dt} = \\nu x - \\xi u",
  
  // Parameter descriptions
  alpha: "\\alpha = \\text{Defender natural growth rate}",
  beta: "\\beta = \\text{Defender-attacker interaction strength}",
  gamma: "\\gamma = \\text{Attacker natural growth rate}",
  delta: "\\delta = \\text{Vulnerability impact on defenders}",
  epsilon: "\\epsilon = \\text{Attacker-vulnerability synergy}",
  eta: "\\eta = \\text{Defender countermeasure effectiveness}",
  theta: "\\theta = \\text{Vulnerability generation by attackers}",
  lambda: "\\lambda = \\text{Vulnerability mitigation by defenders}",
  mu: "\\mu = \\text{Natural vulnerability decay}",
  nu: "\\nu = \\text{Intelligence generation by defenders}",
  xi: "\\xi = \\text{Intelligence decay rate}",
  rho: "\\rho = \\text{Intelligence-defender synergy}",
  sigma: "\\sigma = \\text{Intelligence effectiveness against attackers}",
  
  // Mathematical concepts
  jacobian: "J = \\begin{bmatrix} \\frac{\\partial f_1}{\\partial x} & \\frac{\\partial f_1}{\\partial y} & \\frac{\\partial f_1}{\\partial z} & \\frac{\\partial f_1}{\\partial u} \\\\ \\frac{\\partial f_2}{\\partial x} & \\frac{\\partial f_2}{\\partial y} & \\frac{\\partial f_2}{\\partial z} & \\frac{\\partial f_2}{\\partial u} \\\\ \\frac{\\partial f_3}{\\partial x} & \\frac{\\partial f_3}{\\partial y} & \\frac{\\partial f_3}{\\partial z} & \\frac{\\partial f_3}{\\partial u} \\\\ \\frac{\\partial f_4}{\\partial x} & \\frac{\\partial f_4}{\\partial y} & \\frac{\\partial f_4}{\\partial z} & \\frac{\\partial f_4}{\\partial u} \\end{bmatrix}",
  
  eigenvalue: "\\det(J - \\lambda I) = 0",
  
  stability: "\\text{Stable if } \\text{Re}(\\lambda_i) < 0 \\text{ for all } i",
  
  // Phase space
  phaseSpace: "\\mathbf{x}(t) = [x(t), y(t), z(t), u(t)]^T",
  
  // Equilibrium
  equilibrium: "\\frac{d\\mathbf{x}}{dt} = \\mathbf{0}",
  
  // Lotka-Volterra base form
  lotkaVolterra: "\\frac{dx}{dt} = \\alpha x - \\beta xy, \\quad \\frac{dy}{dt} = \\gamma y - \\delta xy"
};

// Component for displaying equation with label
export const LabeledEquation = ({ 
  label, 
  equation, 
  description,
  className = ''
}) => (
  <div className={`labeled-equation ${className}`}>
    {label && (
      <div className="text-sm font-semibold text-cyber-green mb-2">
        {label}
      </div>
    )}
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
      <EquationDisplay equation={equation} />
      {description && (
        <p className="text-sm text-gray-400 mt-3 italic">
          {description}
        </p>
      )}
    </div>
  </div>
);

export default EquationDisplay;