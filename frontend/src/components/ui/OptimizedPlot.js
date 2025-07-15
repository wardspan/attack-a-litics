import React, { memo, useMemo } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Plotly with loading component
const Plot = dynamic(
  () => import('react-plotly.js'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-blue"></div>
      </div>
    )
  }
);

// Memoized Plot component for better performance
const OptimizedPlot = memo(({
  data,
  layout,
  config,
  style,
  className,
  onInitialized,
  onUpdate,
  onPurge,
  onError,
  plotRef,
  ...props
}) => {
  // Memoize the plot configuration to prevent unnecessary re-renders
  const memoizedConfig = useMemo(() => ({
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    responsive: true,
    toImageButtonOptions: {
      format: 'png',
      filename: 'attack-a-litics-plot',
      height: 800,
      width: 1200,
      scale: 2
    },
    // Fix Canvas performance warning
    plotGlPixelRatio: 2,
    ...config
  }), [config]);

  // Memoize the layout to prevent unnecessary re-renders
  const memoizedLayout = useMemo(() => ({
    autosize: true,
    ...layout
  }), [layout]);

  // Memoize the data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => {
    if (!data) return [];
    return data;
  }, [data]);

  const memoizedStyle = useMemo(() => ({
    width: '100%',
    height: '100%',
    ...style
  }), [style]);

  return (
    <div className={className}>
      <Plot
        ref={plotRef}
        data={memoizedData}
        layout={memoizedLayout}
        config={memoizedConfig}
        style={memoizedStyle}
        onInitialized={onInitialized}
        onUpdate={onUpdate}
        onPurge={onPurge}
        onError={onError}
        {...props}
      />
    </div>
  );
});

OptimizedPlot.displayName = 'OptimizedPlot';

export default OptimizedPlot;