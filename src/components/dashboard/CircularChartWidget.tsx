import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useTheme } from '@/context/ThemeContext';

export function CircularChartWidget() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const options: ApexOptions = {
    chart: {
      type: 'radialBar',
      background: 'transparent',
      foreColor: isDark ? '#94a3b8' : '#64748b',
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    colors: [
      'hsl(var(--primary))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
    ],
    plotOptions: {
      radialBar: {
        hollow: { size: '40%' },
        track: {
          background: isDark ? '#1e293b' : '#e2e8f0',
        },
        dataLabels: {
          name: { fontSize: '14px' },
          value: { fontSize: '16px', fontWeight: 600 },
          total: {
            show: true,
            label: 'Avg',
            formatter: () => '76%',
          },
        },
      },
    },
    labels: ['Sales', 'Support', 'Dev'],
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
  };

  const series = [85, 67, 76];

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-soft h-full">
      <h3 className="text-lg font-semibold text-foreground mb-4">Team Performance</h3>
      <Chart options={options} series={series} type="radialBar" height={280} />
    </div>
  );
}
