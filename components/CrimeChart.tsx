import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChartData } from 'chart.js';
import React from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CrimeChartProps {
  data: ChartData<'bar'>;
  searchQuery: string;
  groupBy: string;
}

const CrimeChart: React.FC<CrimeChartProps> = ({ data, searchQuery, groupBy }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Crime Data Analysis: ${searchQuery} vs ${groupBy}`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: groupBy,
        },
      },
      y: {
        title: {
          display: true,
          text: searchQuery,
        },
      },
    },
  };

  return <Bar options={options} data={data} />;
};

export default CrimeChart;