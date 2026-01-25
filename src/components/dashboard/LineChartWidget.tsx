import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useTheme } from '@/context/ThemeContext';

export function LineChartWidget() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const options: ApexOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      background: 'transparent',
      foreColor: isDark ? '#94a3b8' : '#64748b',
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    colors: ['hsl(var(--primary))', 'hsl(var(--chart-2))'],
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: isDark ? '#1e293b' : '#e2e8f0',
      strokeDashArray: 4,
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `$${val}k`,
      },
    },
    legend: { position: 'top', horizontalAlign: 'right' },
    tooltip: { theme: isDark ? 'dark' : 'light' },
  };

  const series = [
    { name: 'Revenue', data: [30, 40, 35, 50, 49, 60, 70] },
    { name: 'Expenses', data: [20, 30, 25, 35, 30, 40, 45] },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-soft">
      <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Overview</h3>
      <Chart options={options} series={series} type="area" height={280} />
    </div>
  );
}
