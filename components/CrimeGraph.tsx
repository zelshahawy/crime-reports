// components/CrimeGraph.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CrimeGraphProps {
  data: {
    labels: string[];
    values: number[];
  };
}

const CrimeGraph: React.FC<CrimeGraphProps> = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Crime Occurrences',
        data: data.values,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: { 
        display: true,
        text: 'Crime Data Visualization',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default CrimeGraph;
