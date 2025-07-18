'use client';

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

// Define the structure of the chart data from the AI
interface ChartData {
  type: 'bar' | 'line' | 'pie';
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

interface DynamicChartProps {
  chartData: ChartData;
}

export function DynamicChart({ chartData }: DynamicChartProps) {
  // Shadcn charts expect data in an array of objects format, like:
  // [{ name: 'Jan', desktop: 186 }, { name: 'Feb', desktop: 305 }]
  // We need to transform the AI's response (labels and datasets) into this format.
  const formattedData = chartData.labels.map((label, index) => {
    const dataPoint: { [key: string]: string | number } = { name: label };
    chartData.datasets.forEach(dataset => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    return dataPoint;
  });

  const categoryKey = chartData.datasets[0]?.label || 'value';

  const renderChart = () => {
    switch (chartData.type) {
      case 'bar':
        return (
          <BarChart data={formattedData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey={categoryKey} fill="var(--color-primary)" radius={4} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={formattedData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line type="monotone" dataKey={categoryKey} stroke="var(--color-primary)" />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie data={formattedData} dataKey={categoryKey} nameKey="name" innerRadius={60} />
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="mt-2 bg-slate-900 border-slate-700 text-white w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-slate-100">{chartData.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}