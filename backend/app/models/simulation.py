from pydantic import BaseModel, Field, validator
from typing import List, Dict, Any, Optional, Union

class SimulationRequest(BaseModel):
    """Request model for cyber warfare simulation"""
    
    # Differential equation parameters
    alpha: float = Field(default=0.1, gt=0, description="Defender growth rate")
    beta: float = Field(default=0.02, gt=0, description="Defender-attacker interaction coefficient")
    gamma: float = Field(default=0.08, gt=0, description="Attacker growth rate")
    delta: float = Field(default=0.015, gt=0, description="Defender vulnerability interaction")
    epsilon: float = Field(default=0.01, gt=0, description="Attacker-vulnerability synergy")
    eta: float = Field(default=0.025, gt=0, description="Attacker-defender conflict coefficient")
    theta: float = Field(default=0.03, gt=0, description="Vulnerability generation by attackers")
    lambda_: float = Field(default=0.05, gt=0, alias="lambda", description="Vulnerability mitigation by defenders")
    mu: float = Field(default=0.02, gt=0, description="Natural vulnerability decay rate")
    nu: float = Field(default=0.04, gt=0, description="Intelligence generation by defenders")
    xi: float = Field(default=0.03, gt=0, description="Intelligence decay rate")
    rho: float = Field(default=0.02, gt=0, description="Intelligence-defender synergy")
    sigma: float = Field(default=0.01, gt=0, description="Intelligence-attacker counter coefficient")
    
    # Initial conditions
    x0: float = Field(default=100.0, gt=0, description="Initial defender capability")
    y0: float = Field(default=50.0, gt=0, description="Initial attacker capability")
    z0: float = Field(default=30.0, gt=0, description="Initial system vulnerability")
    u0: float = Field(default=20.0, gt=0, description="Initial threat intelligence")
    
    # Simulation parameters
    time_span: float = Field(default=24.0, gt=0, le=168, description="Simulation time in hours (max 1 week)")
    resolution: float = Field(default=0.1, gt=0, le=1.0, description="Time step resolution")
    solver_method: str = Field(default="RK45", description="ODE solver method")
    
    @validator('solver_method')
    def validate_solver_method(cls, v):
        valid_methods = ['RK45', 'DOP853', 'Radau', 'BDF', 'LSODA']
        if v not in valid_methods:
            raise ValueError(f"Solver method must be one of {valid_methods}")
        return v
    
    @validator('resolution')
    def validate_resolution(cls, v, values):
        if 'time_span' in values and v > values['time_span'] / 10:
            raise ValueError("Resolution must be at most 1/10 of the time span")
        return v

class TimeSeriesData(BaseModel):
    """Time series data for the simulation results"""
    t: List[float] = Field(description="Time points")
    x: List[float] = Field(description="Defender capability over time")
    y: List[float] = Field(description="Attacker capability over time")
    z: List[float] = Field(description="System vulnerability over time")
    u: List[float] = Field(description="Threat intelligence over time")

class SimulationResponse(BaseModel):
    """Response model for cyber warfare simulation"""
    time_series: TimeSeriesData
    jacobian: List[List[float]] = Field(description="4x4 Jacobian matrix at final state")
    eigenvalues: List[Union[float, Dict[str, float]]] = Field(description="Eigenvalues (real or complex)")
    stability: str = Field(description="Stability classification")
    parameters: Dict[str, Any] = Field(description="Input parameters used")
    metadata: Dict[str, Any] = Field(description="Simulation metadata")

class HealthResponse(BaseModel):
    """Health check response"""
    status: str = Field(description="Health status")
    service: str = Field(description="Service name")
    version: str = Field(description="API version")
    timestamp: str = Field(description="Current timestamp")