import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useTheme } from '@/context/ThemeContext';

export function PieChartWidget() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
      foreColor: isDark ? '#94a3b8' : '#64748b',
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    colors: [
      'hsl(var(--primary))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
    ],
    labels: ['Desktop', 'Mobile', 'Tablet', 'Other'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: { show: true },
            value: { show: true, formatter: (val) => `${val}%` },
            total: {
              show: true,
              label: 'Total',
              formatter: () => '100%',
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    tooltip: { theme: isDark ? 'dark' : 'light' },
  };

  const series = [44, 35, 13, 8];

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-soft h-full">
      <h3 className="text-lg font-semibold text-foreground mb-4">Traffic by Device</h3>
      <Chart options={options} series={series} type="donut" height={280} />
    </div>
  );
}
