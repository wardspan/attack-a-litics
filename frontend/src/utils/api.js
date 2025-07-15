import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout for simulations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`Server Error ${status}:`, data);
      
      // Format error message for user
      let errorMessage = 'An error occurred';
      if (data?.message) {
        errorMessage = data.message;
      } else if (data?.detail) {
        if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (data.detail?.message) {
          errorMessage = data.detail.message;
        }
      }
      
      error.userMessage = errorMessage;
    } else if (error.request) {
      // Network error
      console.error('Network Error:', error.request);
      error.userMessage = 'Unable to connect to the server. Please check your connection.';
    } else {
      // Other error
      console.error('Unknown Error:', error.message);
      error.userMessage = 'An unexpected error occurred.';
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const apiEndpoints = {
  // Health check
  health: () => api.get('/health'),
  
  // Get API information
  info: () => api.get('/'),
  
  // Run simulation
  simulate: (params) => api.post('/simulate', params),
};

// Helper functions
export const simulateSystem = async (parameters) => {
  try {
    const response = await apiEndpoints.simulate(parameters);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.userMessage || 'Simulation failed',
      details: error.response?.data,
    };
  }
};

export const checkBackendHealth = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await apiEndpoints.health();
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(`Backend health check failed (attempt ${i + 1}/${retries}):`, error);
      
      if (i === retries - 1) {
        // Last attempt failed
        return {
          success: false,
          error: error.userMessage || 'Backend health check failed',
        };
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

export default api;