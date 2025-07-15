"""
Attack-a-litics: Cyber Warfare Simulation API
FastAPI backend for solving Lotka-Volterra cyber conflict dynamics
"""

import logging
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .models import SimulationRequest, SimulationResponse, HealthResponse
from .solver import CyberWarfareModel
from .utils import SimulationError, ParameterValidationError, SolverError

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Attack-a-litics API",
    description="Cyber warfare simulation using Lotka-Volterra dynamics",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for frontend communication
import os
cors_origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.get("/", response_model=dict)
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Attack-a-litics API",
        "description": "Cyber warfare simulation using Lotka-Volterra dynamics",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "simulation": "/simulate",
            "docs": "/docs",
            "redoc": "/redoc"
        },
        "model": {
            "variables": [
                "x(t): Defender Capability",
                "y(t): Attacker Capability",
                "z(t): System Vulnerability",
                "u(t): Threat Intelligence"
            ],
            "equations": [
                "dx/dt = αx + ρu - βxy - δxz",
                "dy/dt = γy + εyz - ηxy - σuy",
                "dz/dt = θy - λx - μz",
                "du/dt = νx - ξu"
            ]
        }
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint for container monitoring."""
    return HealthResponse(
        status="healthy",
        service="attack-a-litics",
        version="1.0.0",
        timestamp=datetime.now().isoformat()
    )

@app.post("/simulate", response_model=SimulationResponse)
async def simulate_cyber_warfare(request: SimulationRequest):
    """
    Simulate cyber warfare dynamics using Lotka-Volterra equations.
    
    This endpoint solves a system of 4 differential equations representing:
    - Defender Capability (x)
    - Attacker Capability (y)
    - System Vulnerability (z)
    - Threat Intelligence (u)
    
    Returns time series data, Jacobian matrix, eigenvalues, and stability analysis.
    """
    try:
        logger.info(f"Starting simulation with time_span={request.time_span}, method={request.solver_method}")
        
        # Create and validate the model
        model = CyberWarfareModel(request)
        model.validate_parameters()
        
        # Solve the system
        result = model.solve()
        
        logger.info(f"Simulation completed successfully. Stability: {result['stability']}")
        
        return SimulationResponse(**result)
        
    except ParameterValidationError as e:
        logger.error(f"Parameter validation error: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Parameter validation failed",
                "message": str(e),
                "type": "validation_error"
            }
        )
    except SolverError as e:
        logger.error(f"Solver error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Solver failed",
                "message": str(e),
                "type": "solver_error"
            }
        )
    except SimulationError as e:
        logger.error(f"Simulation error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Simulation failed",
                "message": str(e),
                "type": "simulation_error"
            }
        )
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Internal server error",
                "message": "An unexpected error occurred",
                "type": "internal_error"
            }
        )

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler."""
    logger.error(f"HTTP {exc.status_code} error: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.detail
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """General exception handler for unexpected errors."""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred",
            "type": "internal_error"
        }
    )

if __name__ == "__main__":
    import uvicorn
    
    # Run with uvicorn for local development
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )