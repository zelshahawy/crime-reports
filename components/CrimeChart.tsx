import { BarElement, CategoryScale, ChartData, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';

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

  return <Bar className='min-h-[200px]' options={options} data={data} />;
};

export default CrimeChart;
