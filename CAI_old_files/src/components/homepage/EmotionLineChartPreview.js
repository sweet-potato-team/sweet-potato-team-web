import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function EmotionLineChartPreview({ labels, data }) {
  return (
    <Line
      data={{
        labels,
        datasets: [{
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)'
        }]
      }}
      options={{
        scales: {
          x: { display: false },
          y: { display: false }
        },
        legend: { display: false }
      }}
      style={{ width: '100px', height: '50px' }}  // 小尺寸的圖表
    />
  );
}

export default EmotionLineChartPreview;
