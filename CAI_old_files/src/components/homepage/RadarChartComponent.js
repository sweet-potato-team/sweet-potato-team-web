import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, Filler } from 'chart.js';

ChartJS.register(RadialLinearScale, Filler);

function RadarChartComponent({ avgData }) {
  console.log("RadarChartComponent received avgData:", avgData);

  if (!avgData) {
    console.warn("No avgData available for RadarChartComponent");
    return null;
  }

  const data = {
    labels: ['情緒', '睡眠', '心理', '焦慮', '健康'],
    datasets: [{
      data: [
        avgData.avg_cat_emotion,
        avgData.avg_cat_sleep,
        avgData.avg_cat_psych,
        avgData.avg_cat_anxiety,
        avgData.avg_cat_physical,
      ],
      backgroundColor: 'rgba(244,214,177,0.4)',
      borderColor: '#EDBD82',
      borderWidth: 2,
      pointBackgroundColor: '#EDBD82',
      fill: true
    }]
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true
        },
        ticks: {
          beginAtZero: true,
          color: '#574938',
          font: {
            size: 14,
            weight: 'bold',
            family: 'GenSenRounded'  // 使用你定義的字體
          },
          stepSize: 2,
          suggestedMin: 0,
          suggestedMax: 10
        },
        pointLabels: {
          color: '#574938',
          font: {
            size: 16,
            // weight: 'bold',
            family: 'GenSenRounded'  // 使用你定義的字體
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false // 移除圖例
      },
      centerText: {
        text: avgData.avg_total_score.toFixed(2),
        color: '#574938',
        font: {
          size: 28,
          weight: 'bold',
          family: 'GenSenRounded'  // 使用你定義的字體
        }
      }
    },
    layout: {
      padding: {
        top: 5,
        bottom: 5
      }
    }
  };

  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart) {
      const { ctx, chartArea: { left, right, top, bottom } } = chart;
      const options = chart.config.options.plugins.centerText;

      if (options && options.text) {
        ctx.save();
        const xCenter = (left + right) / 2;
        const yCenter = (top + bottom) / 2;

        ctx.font = `${options.font.weight} ${options.font.size}px ${options.font.family}`;
        ctx.fillStyle = options.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(options.text, xCenter, yCenter);
        ctx.restore();
      }
    }
  };

  ChartJS.register(centerTextPlugin);

  return (
    <div style={{ width: '400px', height: '600px', borderRadius: '10px' }}>
      <Radar data={data} options={options} />
    </div>
  );
}

export default RadarChartComponent;