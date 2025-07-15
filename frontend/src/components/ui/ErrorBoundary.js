import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    
    // Here you could send error to monitoring service like Sentry
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="card">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-cyber-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-cyber-red" />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">
              Something went wrong
            </h2>
            
            <p className="text-gray-400 mb-6">
              {this.props.fallbackMessage || 
                'An error occurred while rendering this component. Please try refreshing the page.'}
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={this.handleReset}
                className="button-primary flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="button-secondary flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Reload Page
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left bg-gray-900 rounded-lg p-4">
                <summary className="cursor-pointer text-cyber-red text-sm font-medium mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs text-gray-300 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export const withErrorBoundary = (Component, fallbackMessage) => {
  return function WithErrorBoundaryComponent(props) {
    return (
      <ErrorBoundary fallbackMessage={fallbackMessage}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

export default ErrorBoundary;