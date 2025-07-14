# Attack-a-litics

A cyber warfare simulation using Lotka-Volterra dynamics to model the interaction between defenders, attackers, system vulnerabilities, and threat intelligence.

## Overview

Attack-a-litics implements a mathematical model for cyber conflict dynamics using a system of 4 differential equations:

- **x(t)**: Defender Capability
- **y(t)**: Attacker Capability  
- **z(t)**: System Vulnerability
- **u(t)**: Threat Intelligence

### Mathematical Model

The system is governed by the following equations:

```
dx/dt = αx + ρu - βxy - δxz
dy/dt = γy + εyz - ηxy - σuy
dz/dt = θy - λx - μz
du/dt = νx - ξu
```

Where α, β, γ, δ, ε, η, θ, λ, μ, ν, ξ, ρ, σ are configurable parameters.

## Architecture

```
cyber-conflict-sim/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI application
│   │   ├── models/           # Pydantic models
│   │   ├── solver/           # Mathematical solver
│   │   └── utils/            # Utilities and exceptions
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile           # Backend container
├── docker-compose.yml       # Local development
└── README.md
```

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd attack-a-litics
   ```

2. **Start the backend**
   ```bash
   docker-compose up --build
   ```

3. **Access the API**
   - API: http://localhost:8000
   - Health check: http://localhost:8000/health
   - Documentation: http://localhost:8000/docs
   - Alternative docs: http://localhost:8000/redoc

### Production Deployment

#### Railway (Backend)

1. Connect your GitHub repository to Railway
2. Set environment variables:
   ```
   PORT=8000
   PYTHONUNBUFFERED=1
   ```
3. Deploy from the `backend` directory

#### Docker Hub

```bash
# Build and push backend image
docker build -t your-username/attack-a-litics-backend ./backend
docker push your-username/attack-a-litics-backend
```

## API Usage

### Simulate Endpoint

**POST** `/simulate`

Runs a cyber warfare simulation with the given parameters.

#### Request Body

```json
{
  "alpha": 0.1,
  "beta": 0.02,
  "gamma": 0.08,
  "delta": 0.015,
  "epsilon": 0.01,
  "eta": 0.025,
  "theta": 0.03,
  "lambda": 0.05,
  "mu": 0.02,
  "nu": 0.04,
  "xi": 0.03,
  "rho": 0.02,
  "sigma": 0.01,
  "x0": 100.0,
  "y0": 50.0,
  "z0": 30.0,
  "u0": 20.0,
  "time_span": 24.0,
  "resolution": 0.1,
  "solver_method": "RK45"
}
```

#### Response

```json
{
  "time_series": {
    "t": [0, 0.1, 0.2, ...],
    "x": [100, 99.5, ...],
    "y": [50, 51.2, ...],
    "z": [30, 29.8, ...],
    "u": [20, 20.5, ...]
  },
  "jacobian": [[...], [...], [...], [...]],
  "eigenvalues": [1.2, -0.5, {"real": 0.1, "imag": 0.3}],
  "stability": "spiral sink",
  "parameters": {...},
  "metadata": {
    "simulation_time": 24,
    "resolution": 0.1,
    "solver_method": "RK45"
  }
}
```

### Example Usage

```bash
# Test with default parameters
curl -X POST http://localhost:8000/simulate \
  -H "Content-Type: application/json" \
  -d '{}'

# Test with custom parameters
curl -X POST http://localhost:8000/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "alpha": 0.15,
    "beta": 0.03,
    "time_span": 12.0,
    "solver_method": "DOP853"
  }'
```

## Parameters

### Differential Equation Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| α (alpha) | Defender growth rate | 0.1 |
| β (beta) | Defender-attacker interaction | 0.02 |
| γ (gamma) | Attacker growth rate | 0.08 |
| δ (delta) | Defender vulnerability interaction | 0.015 |
| ε (epsilon) | Attacker-vulnerability synergy | 0.01 |
| η (eta) | Attacker-defender conflict | 0.025 |
| θ (theta) | Vulnerability generation by attackers | 0.03 |
| λ (lambda) | Vulnerability mitigation by defenders | 0.05 |
| μ (mu) | Natural vulnerability decay | 0.02 |
| ν (nu) | Intelligence generation by defenders | 0.04 |
| ξ (xi) | Intelligence decay rate | 0.03 |
| ρ (rho) | Intelligence-defender synergy | 0.02 |
| σ (sigma) | Intelligence-attacker counter | 0.01 |

### Initial Conditions

| Variable | Description | Default |
|----------|-------------|---------|
| x0 | Initial defender capability | 100.0 |
| y0 | Initial attacker capability | 50.0 |
| z0 | Initial system vulnerability | 30.0 |
| u0 | Initial threat intelligence | 20.0 |

### Simulation Parameters

| Parameter | Description | Default | Range |
|-----------|-------------|---------|-------|
| time_span | Simulation time in hours | 24.0 | (0, 168] |
| resolution | Time step resolution | 0.1 | (0, 1.0] |
| solver_method | ODE solver method | "RK45" | RK45, DOP853, Radau, BDF, LSODA |

## Stability Analysis

The system performs stability analysis by:

1. Computing the 4×4 Jacobian matrix at the final state
2. Calculating eigenvalues
3. Classifying stability based on eigenvalue properties:
   - **Stable node**: All real eigenvalues < 0
   - **Unstable node**: All real eigenvalues > 0
   - **Saddle point**: Mixed positive/negative real eigenvalues
   - **Spiral sink**: Complex eigenvalues with negative real parts
   - **Spiral source**: Complex eigenvalues with positive real parts
   - **Center**: Pure imaginary eigenvalues

## Development

### Running Tests

```bash
# Start the backend
docker-compose up -d

# Test the API
curl http://localhost:8000/health

# Run a simulation
curl -X POST http://localhost:8000/simulate \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Development with Volume Mounting

The docker-compose.yml includes volume mounting for development:

```bash
# Start with auto-reload
docker-compose up --build

# Make changes to backend/app/ files
# The container will automatically reload
```

### Monitoring

- Health check endpoint: `/health`
- Logs: `docker-compose logs -f backend`
- Container status: `docker-compose ps`

## Troubleshooting

### Common Issues

1. **Port 8000 already in use**
   ```bash
   # Change port in docker-compose.yml
   ports:
     - "8001:8000"
   ```

2. **Container fails to start**
   ```bash
   # Check logs
   docker-compose logs backend
   
   # Rebuild container
   docker-compose build --no-cache backend
   ```

3. **Numerical instability**
   - Reduce time_span or increase resolution
   - Try different solver methods (DOP853, Radau)
   - Check parameter values for extreme interactions

### Support

For issues and questions:
- Check the logs: `docker-compose logs backend`
- Verify container health: `curl http://localhost:8000/health`
- Review parameter constraints in the API documentation

## License

This project is licensed under the MIT License.