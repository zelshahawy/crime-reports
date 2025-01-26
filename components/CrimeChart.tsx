// components/CrimeChart.tsx
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import React from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CrimeChartProps {
  data: any;
}

const CrimeChart: React.FC<CrimeChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Crime Data Analysis',
      },
    },
  };

  return <Bar options={options} data={data} />;
};

export default CrimeChart;
