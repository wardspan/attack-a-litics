import numpy as np
from scipy.integrate import solve_ivp
from typing import List, Dict, Any, Tuple
import logging

from ..models.simulation import SimulationRequest

logger = logging.getLogger(__name__)

class CyberWarfareModel:
    """
    Cyber warfare dynamics model using Lotka-Volterra equations.
    
    Models the interaction between:
    - x(t): Defender Capability
    - y(t): Attacker Capability
    - z(t): System Vulnerability  
    - u(t): Threat Intelligence
    """
    
    def __init__(self, params: SimulationRequest):
        self.params = params
        self._extract_parameters()
        
    def _extract_parameters(self):
        """Extract and store parameters for easy access"""
        self.alpha = self.params.alpha
        self.beta = self.params.beta
        self.gamma = self.params.gamma
        self.delta = self.params.delta
        self.epsilon = self.params.epsilon
        self.eta = self.params.eta
        self.theta = self.params.theta
        self.lambda_ = self.params.lambda_
        self.mu = self.params.mu
        self.nu = self.params.nu
        self.xi = self.params.xi
        self.rho = self.params.rho
        self.sigma = self.params.sigma
        
    def differential_equations(self, t: float, state: List[float]) -> List[float]:
        """
        Cyber warfare dynamics using Lotka-Volterra equations:
        
        dx/dt = αx + ρu - βxy - δxz  (Defender Capability)
        dy/dt = γy + εyz - ηxy - σuy  (Attacker Capability)
        dz/dt = θy - λx - μz          (System Vulnerability)
        du/dt = νx - ξu              (Threat Intelligence)
        
        Args:
            t: Current time (not used in autonomous system)
            state: Current state [x, y, z, u]
            
        Returns:
            List of derivatives [dx/dt, dy/dt, dz/dt, du/dt]
        """
        x, y, z, u = state
        
        # Ensure non-negative values to maintain physical meaning
        x = max(0, x)
        y = max(0, y)
        z = max(0, z)
        u = max(0, u)
        
        # Compute derivatives
        dx_dt = self.alpha * x + self.rho * u - self.beta * x * y - self.delta * x * z
        dy_dt = self.gamma * y + self.epsilon * y * z - self.eta * x * y - self.sigma * u * y
        dz_dt = self.theta * y - self.lambda_ * x - self.mu * z
        du_dt = self.nu * x - self.xi * u
        
        return [dx_dt, dy_dt, dz_dt, du_dt]
    
    def compute_jacobian(self, state: List[float]) -> np.ndarray:
        """
        Compute the 4x4 Jacobian matrix at the given state.
        
        The Jacobian matrix J[i,j] = ∂f_i/∂x_j where f is the vector field.
        
        Args:
            state: Current state [x, y, z, u]
            
        Returns:
            4x4 Jacobian matrix as numpy array
        """
        x, y, z, u = state
        
        # Partial derivatives of the system
        jacobian = np.array([
            # df1/dx, df1/dy, df1/dz, df1/du
            [self.alpha - self.beta * y - self.delta * z, 
             -self.beta * x, 
             -self.delta * x, 
             self.rho],
            
            # df2/dx, df2/dy, df2/dz, df2/du
            [-self.eta * y, 
             self.gamma + self.epsilon * z - self.eta * x - self.sigma * u, 
             self.epsilon * y, 
             -self.sigma * y],
            
            # df3/dx, df3/dy, df3/dz, df3/du
            [-self.lambda_, 
             self.theta, 
             -self.mu, 
             0],
            
            # df4/dx, df4/dy, df4/dz, df4/du
            [self.nu, 
             0, 
             0, 
             -self.xi]
        ])
        
        return jacobian
    
    def classify_stability(self, eigenvalues: np.ndarray) -> str:
        """
        Classify the stability of the system based on eigenvalues.
        
        Args:
            eigenvalues: Array of complex eigenvalues
            
        Returns:
            String describing the stability type
        """
        real_parts = [np.real(ev) for ev in eigenvalues]
        imag_parts = [np.imag(ev) for ev in eigenvalues]
        
        # Check if all eigenvalues are real (within tolerance)
        all_real = all(abs(im) < 1e-10 for im in imag_parts)
        
        # Check signs of real parts
        all_negative_real = all(re < -1e-10 for re in real_parts)
        all_positive_real = all(re > 1e-10 for re in real_parts)
        has_negative = any(re < -1e-10 for re in real_parts)
        has_positive = any(re > 1e-10 for re in real_parts)
        mixed_signs = has_negative and has_positive
        
        if all_real:
            if all_negative_real:
                return "stable node"
            elif all_positive_real:
                return "unstable node"
            elif mixed_signs:
                return "saddle point"
            else:
                return "degenerate case"
        else:
            # Complex eigenvalues present
            if all_negative_real:
                return "spiral sink"
            elif all_positive_real:
                return "spiral source"
            elif all(abs(re) < 1e-10 for re in real_parts):
                return "center"
            elif mixed_signs:
                return "spiral saddle"
            else:
                return "complex behavior"
    
    def solve(self) -> Dict[str, Any]:
        """
        Solve the cyber warfare differential equation system.
        
        Returns:
            Dictionary containing simulation results, analysis, and metadata
        """
        try:
            # Set up initial conditions and time span
            initial_state = [self.params.x0, self.params.y0, self.params.z0, self.params.u0]
            t_span = (0, self.params.time_span)
            t_eval = np.arange(0, self.params.time_span + self.params.resolution, self.params.resolution)
            
            logger.info(f"Starting simulation with {len(t_eval)} time points")
            
            # Solve the ODE system
            solution = solve_ivp(
                self.differential_equations,
                t_span,
                initial_state,
                t_eval=t_eval,
                method=self.params.solver_method,
                rtol=1e-8,
                atol=1e-10,
                max_step=self.params.resolution
            )
            
            if not solution.success:
                raise ValueError(f"ODE solver failed: {solution.message}")
            
            # Extract final state for stability analysis
            final_state = solution.y[:, -1]
            logger.info(f"Final state: x={final_state[0]:.3f}, y={final_state[1]:.3f}, z={final_state[2]:.3f}, u={final_state[3]:.3f}")
            
            # Compute Jacobian matrix and eigenvalues at final state
            jacobian = self.compute_jacobian(final_state)
            eigenvalues = np.linalg.eigvals(jacobian)
            
            # Classify stability
            stability = self.classify_stability(eigenvalues)
            
            # Format eigenvalues for JSON serialization
            formatted_eigenvalues = []
            for ev in eigenvalues:
                if abs(np.imag(ev)) < 1e-10:
                    formatted_eigenvalues.append(float(np.real(ev)))
                else:
                    formatted_eigenvalues.append({
                        "real": float(np.real(ev)),
                        "imag": float(np.imag(ev))
                    })
            
            # Prepare response
            result = {
                "time_series": {
                    "t": solution.t.tolist(),
                    "x": solution.y[0].tolist(),
                    "y": solution.y[1].tolist(),
                    "z": solution.y[2].tolist(),
                    "u": solution.y[3].tolist()
                },
                "jacobian": jacobian.tolist(),
                "eigenvalues": formatted_eigenvalues,
                "stability": stability,
                "parameters": self.params.dict(),
                "metadata": {
                    "simulation_time": self.params.time_span,
                    "resolution": self.params.resolution,
                    "solver_method": self.params.solver_method,
                    "solver_success": solution.success,
                    "solver_message": solution.message,
                    "data_points": len(solution.t),
                    "final_state": {
                        "x": float(final_state[0]),
                        "y": float(final_state[1]),
                        "z": float(final_state[2]),
                        "u": float(final_state[3])
                    }
                }
            }
            
            logger.info(f"Simulation completed successfully. Stability: {stability}")
            return result
            
        except Exception as e:
            logger.error(f"Simulation failed: {str(e)}")
            raise ValueError(f"Simulation failed: {str(e)}")
    
    def validate_parameters(self) -> bool:
        """
        Validate that the parameters can produce meaningful solutions.
        
        Returns:
            True if parameters are valid, False otherwise
        """
        # Check for parameter combinations that might cause numerical issues
        if self.beta * self.params.x0 * self.params.y0 > 1000:
            logger.warning("High interaction terms may cause numerical instability")
        
        if self.params.time_span / self.params.resolution > 10000:
            logger.warning("Very fine resolution may cause performance issues")
        
        return True