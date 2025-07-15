import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { track } from '@vercel/analytics';

// Export simulation data to Excel format
export const exportToExcel = (simulationData, parameters, currentScenario) => {
  if (!simulationData) {
    throw new Error('No simulation data available to export');
  }

  const workbook = XLSX.utils.book_new();
  
  // 1. Time Series Data Sheet
  const timeSeriesData = [];
  const { time_series } = simulationData;
  const { t, x, y, z, u } = time_series;
  
  for (let i = 0; i < t.length; i++) {
    timeSeriesData.push({
      'Time (hours)': t[i],
      'Defender Capability': x[i],
      'Attacker Capability': y[i],
      'System Vulnerability': z[i],
      'Threat Intelligence': u[i]
    });
  }
  
  const timeSeriesSheet = XLSX.utils.json_to_sheet(timeSeriesData);
  XLSX.utils.book_append_sheet(workbook, timeSeriesSheet, 'Time Series');
  
  // 2. Parameters Sheet
  const parametersData = Object.entries(parameters).map(([key, value]) => ({
    'Parameter': key,
    'Value': value,
    'Description': getParameterDescription(key)
  }));
  
  const parametersSheet = XLSX.utils.json_to_sheet(parametersData);
  XLSX.utils.book_append_sheet(workbook, parametersSheet, 'Parameters');
  
  // 3. Mathematical Analysis Sheet
  const analysisData = [
    { 'Metric': 'Stability Classification', 'Value': simulationData.stability },
    { 'Metric': 'Simulation Time', 'Value': simulationData.metadata.simulation_time },
    { 'Metric': 'Data Points', 'Value': simulationData.metadata.data_points },
    { 'Metric': 'Solver Method', 'Value': simulationData.metadata.solver_method },
    { 'Metric': 'Solver Success', 'Value': simulationData.metadata.solver_success }
  ];
  
  // Add eigenvalues
  simulationData.eigenvalues.forEach((eigenvalue, index) => {
    analysisData.push({
      'Metric': `Eigenvalue ${index + 1}`,
      'Value': eigenvalue.toFixed(6)
    });
  });
  
  const analysisSheet = XLSX.utils.json_to_sheet(analysisData);
  XLSX.utils.book_append_sheet(workbook, analysisSheet, 'Analysis');
  
  // 4. Jacobian Matrix Sheet
  const jacobianData = [];
  if (simulationData.jacobian) {
    const variables = ['Defender', 'Attacker', 'Vulnerability', 'Intelligence'];
    simulationData.jacobian.forEach((row, i) => {
      const rowData = { 'Variable': variables[i] };
      row.forEach((value, j) => {
        rowData[variables[j]] = value.toFixed(6);
      });
      jacobianData.push(rowData);
    });
  }
  
  const jacobianSheet = XLSX.utils.json_to_sheet(jacobianData);
  XLSX.utils.book_append_sheet(workbook, jacobianSheet, 'Jacobian Matrix');
  
  // 5. Scenario Information Sheet (if available)
  if (currentScenario) {
    const scenarioData = [
      { 'Property': 'Name', 'Value': currentScenario.name },
      { 'Property': 'Description', 'Value': currentScenario.description },
      { 'Property': 'Educational Focus', 'Value': currentScenario.educational },
      { 'Property': 'Expected Outcome', 'Value': currentScenario.expectedOutcome },
      { 'Property': 'Category', 'Value': currentScenario.category }
    ];
    
    if (currentScenario.keyInsights) {
      currentScenario.keyInsights.forEach((insight, index) => {
        scenarioData.push({
          'Property': `Key Insight ${index + 1}`,
          'Value': insight
        });
      });
    }
    
    const scenarioSheet = XLSX.utils.json_to_sheet(scenarioData);
    XLSX.utils.book_append_sheet(workbook, scenarioSheet, 'Scenario Info');
  }
  
  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const scenarioName = currentScenario ? `_${currentScenario.name.replace(/[^a-zA-Z0-9]/g, '_')}` : '';
  const filename = `attack_a_litics_simulation${scenarioName}_${timestamp}.xlsx`;
  
  // Save file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, filename);
  
  // Track Excel export
  track('data_exported', {
    format: 'excel',
    scenario: currentScenario?.name || 'custom',
    dataPoints: simulationData.metadata?.data_points,
    filename: filename
  });
  
  return { success: true, filename };
};

// Export simulation data to CSV format
export const exportToCSV = (simulationData, dataType = 'timeSeries') => {
  if (!simulationData) {
    throw new Error('No simulation data available to export');
  }

  let csvData = [];
  let filename = '';
  
  const timestamp = new Date().toISOString().split('T')[0];
  
  switch (dataType) {
    case 'timeSeries':
      const { time_series } = simulationData;
      const { t, x, y, z, u } = time_series;
      
      csvData = [
        ['Time (hours)', 'Defender Capability', 'Attacker Capability', 'System Vulnerability', 'Threat Intelligence']
      ];
      
      for (let i = 0; i < t.length; i++) {
        csvData.push([t[i], x[i], y[i], z[i], u[i]]);
      }
      
      filename = `attack_a_litics_timeseries_${timestamp}.csv`;
      break;
      
    case 'analysis':
      csvData = [
        ['Metric', 'Value'],
        ['Stability Classification', simulationData.stability],
        ['Simulation Time', simulationData.metadata.simulation_time],
        ['Data Points', simulationData.metadata.data_points],
        ['Solver Method', simulationData.metadata.solver_method],
        ['Solver Success', simulationData.metadata.solver_success]
      ];
      
      // Add eigenvalues
      simulationData.eigenvalues.forEach((eigenvalue, index) => {
        csvData.push([`Eigenvalue ${index + 1}`, eigenvalue.toFixed(6)]);
      });
      
      filename = `attack_a_litics_analysis_${timestamp}.csv`;
      break;
      
    case 'jacobian':
      if (simulationData.jacobian) {
        const variables = ['Variable', 'Defender', 'Attacker', 'Vulnerability', 'Intelligence'];
        csvData = [variables];
        
        const variableNames = ['Defender', 'Attacker', 'Vulnerability', 'Intelligence'];
        simulationData.jacobian.forEach((row, i) => {
          const rowData = [variableNames[i]];
          row.forEach(value => rowData.push(value.toFixed(6)));
          csvData.push(rowData);
        });
      }
      
      filename = `attack_a_litics_jacobian_${timestamp}.csv`;
      break;
      
    default:
      throw new Error('Invalid data type for CSV export');
  }
  
  // Convert to CSV string
  const csvString = csvData.map(row => 
    row.map(cell => `"${cell}"`).join(',')
  ).join('\n');
  
  // Save file
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
  
  // Track CSV export
  track('data_exported', {
    format: 'csv',
    dataType: dataType,
    filename: filename
  });
  
  return { success: true, filename };
};

// Export visualization as image
export const exportVisualizationImage = (plotlyElement, filename, format = 'png') => {
  if (!plotlyElement) {
    throw new Error('No visualization element found');
  }
  
  const timestamp = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}_${timestamp}.${format}`;
  
  return new Promise((resolve, reject) => {
    try {
      // Use Plotly's downloadImage function
      window.Plotly.downloadImage(plotlyElement, {
        format: format,
        width: 1200,
        height: 800,
        filename: fullFilename
      }).then(() => {
        // Track image export
        track('data_exported', {
          format: 'image',
          imageFormat: format,
          filename: fullFilename
        });
        resolve({ success: true, filename: fullFilename });
      }).catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};

// Helper function to get parameter descriptions
const getParameterDescription = (key) => {
  const descriptions = {
    alpha: 'Defender natural growth rate',
    beta: 'Defender-attacker interaction strength',
    gamma: 'Attacker natural growth rate',
    delta: 'Vulnerability impact on defenders',
    epsilon: 'Attacker-vulnerability synergy',
    eta: 'Defender countermeasure effectiveness',
    theta: 'Vulnerability generation by attackers',
    lambda: 'Vulnerability mitigation by defenders',
    mu: 'Natural vulnerability decay',
    nu: 'Intelligence generation by defenders',
    xi: 'Intelligence decay rate',
    rho: 'Intelligence-defender synergy',
    sigma: 'Intelligence effectiveness against attackers',
    x0: 'Initial defender capability',
    y0: 'Initial attacker capability',
    z0: 'Initial system vulnerability',
    u0: 'Initial threat intelligence',
    time_span: 'Simulation time span (hours)',
    resolution: 'Time step resolution',
    solver_method: 'Numerical solver method'
  };
  
  return descriptions[key] || 'Parameter description not available';
};

// Generate educational report data
export const generateEducationalReport = (simulationData, parameters, currentScenario) => {
  if (!simulationData) {
    throw new Error('No simulation data available for report');
  }
  
  const report = {
    title: 'Attack-a-litics Simulation Report',
    timestamp: new Date().toISOString(),
    scenario: currentScenario ? {
      name: currentScenario.name,
      description: currentScenario.description,
      educational: currentScenario.educational,
      expectedOutcome: currentScenario.expectedOutcome
    } : null,
    
    simulation: {
      parameters: parameters,
      metadata: simulationData.metadata,
      stability: simulationData.stability,
      eigenvalues: simulationData.eigenvalues
    },
    
    analysis: {
      finalValues: {
        defender: simulationData.time_series.x[simulationData.time_series.x.length - 1],
        attacker: simulationData.time_series.y[simulationData.time_series.y.length - 1],
        vulnerability: simulationData.time_series.z[simulationData.time_series.z.length - 1],
        intelligence: simulationData.time_series.u[simulationData.time_series.u.length - 1]
      },
      
      trends: {
        defender: simulationData.time_series.x[simulationData.time_series.x.length - 1] - simulationData.time_series.x[0],
        attacker: simulationData.time_series.y[simulationData.time_series.y.length - 1] - simulationData.time_series.y[0],
        vulnerability: simulationData.time_series.z[simulationData.time_series.z.length - 1] - simulationData.time_series.z[0],
        intelligence: simulationData.time_series.u[simulationData.time_series.u.length - 1] - simulationData.time_series.u[0]
      }
    },
    
    recommendations: generateRecommendations(simulationData, currentScenario)
  };
  
  return report;
};

// Generate recommendations based on simulation results
const generateRecommendations = (simulationData, currentScenario) => {
  const recommendations = [];
  
  // Stability-based recommendations
  if (simulationData.stability.includes('unstable')) {
    recommendations.push({
      category: 'Stability Concern',
      message: 'The system shows unstable behavior. Consider adjusting parameters to achieve better equilibrium.',
      priority: 'high'
    });
  }
  
  // Trend-based recommendations
  const finalValues = {
    defender: simulationData.time_series.x[simulationData.time_series.x.length - 1],
    attacker: simulationData.time_series.y[simulationData.time_series.y.length - 1],
    vulnerability: simulationData.time_series.z[simulationData.time_series.z.length - 1]
  };
  
  if (finalValues.attacker > finalValues.defender) {
    recommendations.push({
      category: 'Defense Enhancement',
      message: 'Attacker capability exceeds defender capability. Consider increasing defensive measures.',
      priority: 'high'
    });
  }
  
  if (finalValues.vulnerability > 50) {
    recommendations.push({
      category: 'Vulnerability Management',
      message: 'High vulnerability levels detected. Implement vulnerability mitigation strategies.',
      priority: 'medium'
    });
  }
  
  // Scenario-specific recommendations
  if (currentScenario) {
    recommendations.push({
      category: 'Scenario Insights',
      message: `This simulation demonstrates: ${currentScenario.educational}`,
      priority: 'info'
    });
  }
  
  return recommendations;
};