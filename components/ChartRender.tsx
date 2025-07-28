"use client";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);
type ChartRendererProps = {
  chart: {
    type: string;
    data: any;
    options?: any;
  };
};

import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';

export function ChartRenderer({ chart }: { chart: any }) {
  
  const { type, data, options } = chart;

  switch (type) {
    case 'bar':
      return <Bar data={data} options={options} />;
    case 'line':
      return <Line data={data} options={options} />;
    case 'pie':
      return <Pie data={data} options={options} />;
    case 'scatter':
      return <Scatter data={data} options={options} />;
    default:
      return <div>Unsupported chart type: {type}</div>;
  }
}