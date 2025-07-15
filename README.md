# Attack-a-litics: Educational Cyber Warfare Simulation

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.0.3-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-Supported-blue)](https://www.docker.com/)

An interactive educational platform for understanding cyber conflict dynamics through mathematical simulation. Attack-a-litics uses differential equations to model the complex interactions between attackers and defenders in cyberspace, making advanced cybersecurity concepts accessible through visualization and guided exploration.

## 🎯 What is Attack-a-litics?

Attack-a-litics is an educational simulation platform that models cyber warfare dynamics using the Lotka-Volterra differential equation system. It transforms complex mathematical concepts into interactive visualizations, helping cybersecurity professionals, students, and researchers understand how cyber conflicts evolve over time.

### Key Features

- **🎓 Educational Focus**: Comprehensive explanations of mathematical concepts, stability theory, and numerical methods
- **🧮 Mathematical Rigor**: Based on Lotka-Volterra equations adapted for cyber warfare scenarios
- **🎮 Interactive Scenarios**: Pre-built scenarios for different cyber conflict situations
- **📊 Rich Visualizations**: Time series plots, 3D phase space visualization, and stability analysis
- **🔧 Flexible Controls**: Simple scenario builder and advanced parameter fine-tuning
- **🚀 Guided Learning**: Step-by-step tour system for new users
- **⚙️ Multiple Solvers**: Various numerical methods with educational guidance
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices

## 🧠 Mathematical Foundation

The simulation is built on a four-variable Lotka-Volterra system representing:

### Variables
- **x(t)**: Defender Capability - Strength of cybersecurity defenses
- **y(t)**: Attacker Capability - Strength of cyber attack capabilities  
- **z(t)**: System Vulnerability - Exploitable weaknesses in the system
- **u(t)**: Threat Intelligence - Actionable threat information available

### Differential Equations

The system is governed by these coupled differential equations:

```
dx/dt = αx - βxy - δxz + ρxu
dy/dt = γy - ηxy + εyz - σyu  
dz/dt = θy - λx - μz
du/dt = νx - ξu
```

Where:
- **α**: Defender natural growth rate
- **β**: Defender-attacker interaction strength
- **γ**: Attacker natural growth rate
- **δ**: Vulnerability impact on defenders
- **ε**: Attacker-vulnerability synergy
- **η**: Defender countermeasure effectiveness
- **θ**: Vulnerability generation by attackers
- **λ**: Vulnerability mitigation by defenders
- **μ**: Natural vulnerability decay
- **ν**: Intelligence generation by defenders
- **ξ**: Intelligence decay rate
- **ρ**: Intelligence-defender synergy
- **σ**: Intelligence effectiveness against attackers

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Or: [Node.js](https://nodejs.org/) (v18+) and [Python](https://python.org/) (v3.8+)

### Using Docker (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/your-username/attack-a-litics.git
cd attack-a-litics
```

2. **Start the application**
```bash
docker-compose up
```

3. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Production Deployment

For production deployment to Railway (backend) and Vercel (frontend), see the [DEPLOYMENT.md](./DEPLOYMENT.md) guide.

### Local Development Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📚 User Guide

### Getting Started

1. **Take the Tour**: New users automatically see a guided tour explaining the interface
2. **Choose a Scenario**: Start with pre-built scenarios like "Balanced Conflict" or "APT Campaign"
3. **Adjust Parameters**: Use the high-level controls or switch to advanced mode for fine-tuning
4. **Select Solver**: Choose the numerical method (RK45 recommended for beginners)
5. **Run Simulation**: Click "Simulate" to generate results
6. **Explore Results**: Examine time series, phase space, and stability analysis

### Understanding the Interface

#### Scenario Builder
- **Conflict Intensity**: Controls the aggressiveness of attacker-defender interactions
- **Defender Advantage**: Adjusts how effectively defenses counter attacks
- **System Resilience**: Determines recovery speed and threat intelligence processing

#### Visualization Components
- **Time Series Plot**: Shows how variables evolve over time with annotations
- **3D Phase Plot**: Visualizes system trajectory in phase space
- **Mathematical Analysis**: Displays stability analysis, eigenvalues, and Jacobian matrix

### Pre-built Scenarios

#### Beginner Scenarios
- **Balanced Conflict**: Typical cyber warfare with moderate capabilities
- **System Hardening**: Demonstrates proactive security measures

#### Intermediate Scenarios  
- **Effective Intelligence**: Shows how threat intelligence improves defense
- **Defensive Failure**: Illustrates inadequate defensive measures

#### Advanced Scenarios
- **APT Campaign**: Models sophisticated persistent threats
- **Oscillating Conflict**: Demonstrates cyclical advantage shifts

### Solver Selection Guide

| Solver | Best For | Speed | Accuracy |
|--------|----------|-------|----------|
| **RK45** | General use, beginners | Fast | Good |
| **DOP853** | High precision needs | Slow | Excellent |
| **RK23** | Quick exploration | Very Fast | Fair |
| **Radau** | Stiff systems | Medium | Good |
| **BDF** | Very stiff systems | Slow | Good |
| **LSODA** | Automatic switching | Medium | Good |

### Interpreting Results

#### Time Series Analysis
- **Rising lines**: Capabilities/vulnerabilities increasing
- **Falling lines**: Capabilities/vulnerabilities decreasing
- **Oscillations**: Cyclical behavior between sides
- **Convergence**: Variables reaching stable equilibrium
- **Crossovers**: Advantage shifts between attackers/defenders

#### Phase Space Visualization
- **Trajectory shape**: Reveals system behavior patterns
- **Color gradient**: Shows time progression (blue → yellow)
- **Start/end points**: Green circle (start), red diamond (end)
- **Spiral patterns**: Indicate oscillatory behavior
- **Straight lines**: Suggest monotonic changes

#### Stability Analysis
- **Stable Node**: System reaches equilibrium naturally
- **Unstable Node**: System becomes increasingly chaotic
- **Saddle Point**: Outcome depends on initial conditions
- **Spiral Sink**: Oscillating convergence to stability
- **Spiral Source**: Oscillating divergence from stability

## 🏗️ Architecture

### Frontend (Next.js)
```
frontend/
├── src/
│   ├── components/
│   │   ├── education/          # Educational components
│   │   │   ├── ConceptExplainer.js
│   │   │   ├── SolverGuide.js
│   │   │   ├── StabilityEducation.js
│   │   │   └── GuidedTour.js
│   │   ├── controls/           # Control interfaces
│   │   │   ├── ScenarioBuilder.js
│   │   │   ├── SolverSettings.js
│   │   │   └── ParameterControls.js
│   │   └── visualizations/     # Visualization components
│   │       ├── AnnotatedTimeSeries.js
│   │       ├── EducationalPhasePlot.js
│   │       └── InteractiveAnalysis.js
│   ├── pages/
│   │   └── index.js            # Main application page
│   └── utils/
│       ├── api.js              # API client
│       ├── constants.js        # Application constants
│       ├── explanationData.js  # Educational content
│       └── scenarioPresets.js  # Pre-built scenarios
├── Dockerfile
├── Dockerfile.dev
└── package.json
```

### Backend (FastAPI)
```
backend/
├── app/
│   ├── main.py                 # FastAPI application
│   ├── models/                 # Data models
│   ├── solver/                 # Numerical solver
│   └── utils/                  # Utility functions
├── requirements.txt
└── Dockerfile
```

### Key Technologies

#### Frontend
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with custom cyber theme
- **Visualizations**: Plotly.js for interactive plots
- **Icons**: Lucide React icons
- **State Management**: React hooks and context

#### Backend
- **Framework**: FastAPI with async/await
- **Numerical Computing**: NumPy, SciPy
- **Symbolic Math**: SymPy for analytical computations
- **Validation**: Pydantic models
- **Documentation**: Automatic OpenAPI/Swagger docs

## 🔧 Development

### Adding New Scenarios

1. **Define the scenario** in `frontend/src/utils/scenarioPresets.js`:
```javascript
newScenario: {
  name: "Scenario Name",
  description: "Brief description",
  educational: "What this scenario teaches",
  parameters: {
    // Parameter values
  },
  expectedOutcome: "Expected stability type",
  keyInsights: ["Insight 1", "Insight 2"]
}
```

2. **Add to category** in `SCENARIO_CATEGORIES`
3. **Test the scenario** through the interface

### Adding Educational Content

1. **Add explanations** to `frontend/src/utils/explanationData.js`
2. **Create new components** in `components/education/`
3. **Update the main page** to include new content

### Customizing Visualizations

1. **Modify plot configurations** in `utils/constants.js`
2. **Add new plot types** in `components/visualizations/`
3. **Update styling** in `styles/globals.css`

### Export Functionality

The application includes comprehensive export capabilities:

- **Excel Export**: Complete simulation data with multiple sheets
- **CSV Export**: Time series, analysis, and Jacobian matrix data
- **Image Export**: High-quality PNG and SVG visualizations
- **Educational Reports**: Formatted reports with insights and recommendations

### Mathematical Rendering

Equations are rendered using KaTeX for professional mathematical notation:
- Real-time equation rendering
- Mobile-responsive equation display
- LaTeX syntax support
- Accessible mathematical content

## 📊 API Documentation

The backend provides a RESTful API for simulation and analysis:

### Endpoints

#### `GET /`
Returns API information and available endpoints.

#### `GET /health`
Health check endpoint for monitoring.

#### `POST /simulate`
Runs a simulation with given parameters.

**Request Body:**
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

**Response:**
```json
{
  "time_series": {
    "t": [0.0, 0.1, ...],
    "x": [100.0, 99.8, ...],
    "y": [50.0, 49.9, ...],
    "z": [30.0, 29.9, ...],
    "u": [20.0, 20.1, ...]
  },
  "jacobian": [[...], [...], [...], [...]],
  "eigenvalues": [-0.05, -0.03, -0.11, -0.09],
  "stability": "stable node",
  "parameters": { ... },
  "metadata": {
    "simulation_time": 24.0,
    "data_points": 241,
    "solver_method": "RK45",
    "solver_success": true
  }
}
```

## 🚀 Deployment

### Production Deployment

#### Frontend (Vercel)
```bash
# Build and deploy to Vercel
npm run build
vercel deploy --prod
```

#### Backend (Railway)
```bash
# Deploy to Railway
railway login
railway project create
railway up
```

### Docker Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy with production configuration
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

#### Frontend
- `NEXT_PUBLIC_BACKEND_URL`: Backend API URL for client-side requests
- `BACKEND_URL`: Backend API URL for server-side requests
- `NEXT_TELEMETRY_DISABLED`: Disable Next.js telemetry

#### Backend
- `CORS_ORIGINS`: Allowed CORS origins
- `LOG_LEVEL`: Logging level (DEBUG, INFO, WARNING, ERROR)

## 📖 Educational Content

### Mathematical Concepts Covered

1. **Differential Equations**: Systems of coupled ODEs
2. **Stability Analysis**: Linear stability and eigenvalue analysis
3. **Phase Space**: Multi-dimensional system visualization
4. **Numerical Methods**: Various ODE solvers and their properties
5. **Bifurcation Theory**: Parameter sensitivity and critical points

### Learning Objectives

After using Attack-a-litics, learners will understand:
- How mathematical models represent complex systems
- The relationship between system parameters and behavior
- How to interpret stability analysis results
- When to use different numerical solving methods
- How cybersecurity scenarios can be analyzed quantitatively

### Target Audience

- **Cybersecurity Students**: Learning about threat modeling and defense strategies
- **Security Professionals**: Understanding systematic approaches to cyber defense
- **Researchers**: Exploring mathematical models of cyber conflict
- **Educators**: Teaching cybersecurity concepts through simulation
- **Policy Makers**: Gaining insights into cyber conflict dynamics

## 🔧 Troubleshooting

### Common Issues

#### Backend Shows as Unhealthy
- **Cause**: Backend container not running or API not responding
- **Solution**: Check `docker-compose ps` and `docker-compose logs backend`

#### Simulation Fails with "Solver Error"
- **Cause**: Parameters may cause numerical instability
- **Solution**: Try different solver (Radau for stiff systems) or adjust parameters

#### Performance Issues
- **Cause**: Long simulation time or high resolution
- **Solution**: Reduce time span or increase resolution step size

#### Visualization Not Loading
- **Cause**: Missing or invalid simulation data
- **Solution**: Check browser console for errors and ensure simulation completed

### Performance Optimization

1. **Reduce simulation time**: Use shorter time spans for exploration
2. **Adjust resolution**: Higher resolution values compute faster
3. **Choose appropriate solver**: RK23 for speed, DOP853 for accuracy
4. **Use scenario presets**: Pre-configured for stability and performance

### Getting Help

1. **Check the logs**: `docker-compose logs` for container issues
2. **Review documentation**: API docs at http://localhost:8000/docs
3. **Report issues**: GitHub issues for bugs and feature requests
4. **Community support**: Discussions and examples in the repository

## 🤝 Contributing

We welcome contributions to Attack-a-litics! Here's how to get started:

### Development Setup

1. **Fork and clone** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with appropriate tests
4. **Submit a pull request** with a clear description

### Contribution Guidelines

- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting
- Write clear, descriptive commit messages

### Areas for Contribution

- **New scenarios**: Additional cyber conflict situations
- **Visualization improvements**: Enhanced plots and analysis tools
- **Educational content**: More explanations and learning materials
- **Performance optimizations**: Faster simulation and rendering
- **Accessibility**: Improved user experience for all users

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Lotka-Volterra Equations**: Foundation for predator-prey dynamics
- **SciPy**: Numerical computing library for Python
- **Plotly.js**: Interactive visualization library
- **Next.js**: React framework for web applications
- **FastAPI**: Modern Python web framework
- **Tailwind CSS**: Utility-first CSS framework

## 📞 Support

- **Documentation**: In-app guided tour and explanations
- **API Reference**: http://localhost:8000/docs
- **Issues**: GitHub issue tracker
- **Discussions**: GitHub discussions for questions and ideas

---

**Attack-a-litics** - Making cyber conflict dynamics accessible through interactive mathematical simulation.

Built with ❤️ for the cybersecurity education community.