import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useTheme } from '@/context/ThemeContext';

export function BarChartWidget() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: 'transparent',
      foreColor: isDark ? '#94a3b8' : '#64748b',
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    colors: ['hsl(var(--primary))', 'hsl(var(--chart-3))'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
        dataLabels: { position: 'top' },
      },
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: isDark ? '#1e293b' : '#e2e8f0',
      strokeDashArray: 4,
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: { position: 'top', horizontalAlign: 'right' },
    tooltip: { theme: isDark ? 'dark' : 'light' },
  };

  const series = [
    { name: 'This Week', data: [44, 55, 57, 56, 61, 58, 63] },
    { name: 'Last Week', data: [35, 41, 36, 26, 45, 48, 52] },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-soft">
      <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Comparison</h3>
      <Chart options={options} series={series} type="bar" height={280} />
    </div>
  );
}
