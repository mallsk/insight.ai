'use client';

import React from 'react';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadarController,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar, Line, Pie, Doughnut, Radar } from 'react-chartjs-2';


ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadarController,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

type DynamicChartProps = {
  chartJson: string;
};

export default function DynamicChart({ chartJson }: DynamicChartProps) {
  let parsed: any;
  try {
    const cleaned = chartJson.replace(/```json\n?|```/g, '');
    parsed = JSON.parse(cleaned);
  } catch (err) {
    return <p className="text-red-500">Invalid chart data</p>;
  }

  const { type, data, options } = parsed;

  const chartMap: Record<string, React.ElementType> = {
    bar: Bar,
    line: Line,
    pie: Pie,
    doughnut: Doughnut,
    radar: Radar,
  };

  const ChartComponent = chartMap[type?.toLowerCase()] ?? Bar;

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 bg-white p-4 rounded-xl shadow">
      <ChartComponent data={data} options={options || { responsive: true }} />
    </div>
  );
}
