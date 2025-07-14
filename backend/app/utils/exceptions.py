"""Custom exceptions for the cyber warfare simulation."""

class SimulationError(Exception):
    """Base exception for simulation errors."""
    pass

class ParameterValidationError(SimulationError):
    """Raised when simulation parameters are invalid."""
    pass

class SolverError(SimulationError):
    """Raised when the ODE solver fails."""
    pass

class NumericalInstabilityError(SimulationError):
    """Raised when numerical instability is detected."""
    pass