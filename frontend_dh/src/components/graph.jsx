import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function BasicBars() {
  return (
    <BarChart
      xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'], categoryGapRatio: 0.7, tickPlacement:   'middle' }]}
      series={[{ data: [2, 5, 6] }]}
      width={500}
      height={300}
    />
  );
}