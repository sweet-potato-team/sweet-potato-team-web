import React from 'react';
import { Radar } from 'react-chartjs-2'; // Importing only Radar component
// import { Chart as ChartJS, RadialLinearScale, Filler, Plugin } from 'chart.js'; // Importing necessary plugins
import { Chart as ChartJS, RadialLinearScale, Filler } from 'chart.js';

// Register plugins
ChartJS.register(RadialLinearScale, Filler);

function RadarChartComponent({ avgData }) {
  console.log("RadarChartComponent received avgData:", avgData);

  if (!avgData) {
    console.warn("No avgData available for RadarChartComponent");
    return null;
  }

  const data = {
    labels: ['情緒', '睡眠', '心理', '焦慮', '健康'], // 去除 "類別" 字樣
    datasets: [{
      label: '各類別平均分數', // 改成 "各類別平均分數"
      data: [
        avgData.avg_cat_emotion,
        avgData.avg_cat_sleep,
        avgData.avg_cat_psych,
        avgData.avg_cat_anxiety,
        avgData.avg_cat_physical,
      ],
      backgroundColor: 'rgba(0, 150, 136, 0.2)',
      borderColor: 'rgba(0, 150, 136, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(0, 150, 136, 1)',
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
          color: (ctx) => {
            const value = ctx.index;
            // 改變 2, 4, 6, 8 的顏色為 #574938 並加粗
            if ([2, 4, 6, 8].includes(value)) {
              return '#574938';
            }
            return 'black';
          },
          font: (ctx) => {
            const value = ctx.index;
            // 改變 2, 4, 6, 8 的字體加粗
            if ([2, 4, 6, 8].includes(value)) {
              return { weight: 'bold' };
            }
            return {};
          },
          stepSize: 2, // 設定刻度步長
          suggestedMin: 0,
          suggestedMax: 10
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#574938',
          font: {
            size: 16
          }
        }
      },
      title: {
        display: false // 去除 "量表總平均分數" 標題
      },
      centerText: {
        text: avgData.avg_total_score.toFixed(2), // 在圖表中心顯示的平均分數
        color: '#574938', // 字體顏色
        font: {
          size: 24, // 字體大小
          weight: 'bold'
        }
      }
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20
      }
    }
  };

  // 自定義插件：將文本繪製在圖表中心
  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart) {
        const { ctx, chartArea: { left, right, top, bottom } } = chart;

    //   const { ctx, chartArea: { left, right, top, bottom }, scales: { r } } = chart;
      const options = chart.config.options.plugins.centerText;

      if (options && options.text) {
        ctx.save();
        const xCenter = (left + right) / 2;
        const yCenter = (top + bottom) / 2;

        // 設定字體樣式
        ctx.font = `${options.font.weight} ${options.font.size}px Arial`;
        ctx.fillStyle = options.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 繪製文本
        ctx.fillText(options.text, xCenter, yCenter);
        ctx.restore();
      }
    }
  };

  // 註冊自定義插件
  ChartJS.register(centerTextPlugin);

  return (
    <div style={{ width: '400px', height: '600px', padding: '10px', borderRadius: '10px' }}>
      <Radar data={data} options={options} />
    </div>
  );
}

export default RadarChartComponent;

// import React from 'react';
// import { Radar } from 'react-chartjs-2'; // Importing only Radar component
// import { Chart as ChartJS, RadialLinearScale, Filler } from 'chart.js'; // Importing necessary plugins

// // Register plugins
// ChartJS.register(RadialLinearScale, Filler);

// function RadarChartComponent({ avgData }) {
//   console.log("RadarChartComponent received avgData:", avgData);

//   if (!avgData) {
//     console.warn("No avgData available for RadarChartComponent");
//     return null;
//   }

//   const data = {
//     labels: ['情緒', '睡眠', '心理', '焦慮', '健康'], // 去除 "類別" 字樣
//     datasets: [{
//       label: '各類別平均分數', // 改成 "各類別平均分數"
//       data: [
//         avgData.avg_cat_emotion,
//         avgData.avg_cat_sleep,
//         avgData.avg_cat_psych,
//         avgData.avg_cat_anxiety,
//         avgData.avg_cat_physical,
//       ],
//       backgroundColor: 'rgba(0, 150, 136, 0.2)',
//       borderColor: 'rgba(0, 150, 136, 1)',
//       borderWidth: 2,
//       pointBackgroundColor: 'rgba(0, 150, 136, 1)',
//       fill: true
//     }]
//   };

//   const options = {
//     scales: {
//       r: {
//         angleLines: {
//           display: true
//         },
//         ticks: {
//           beginAtZero: true,
//           color: (ctx) => {
//             const value = ctx.index;
//             // 改變 2, 4, 6, 8 的顏色為 #574938 並加粗
//             if ([2, 4, 6, 8].includes(value)) {
//               return '#574938';
//             }
//             return 'black';
//           },
//           font: (ctx) => {
//             const value = ctx.index;
//             // 改變 2, 4, 6, 8 的字體加粗
//             if ([2, 4, 6, 8].includes(value)) {
//               return { weight: 'bold' };
//             }
//             return {};
//           },
//           stepSize: 2, // 設定刻度步長
//           suggestedMin: 0,
//           suggestedMax: 10
//         }
//       }
//     },
//     plugins: {
//       legend: {
//         display: true,
//         labels: {
//           color: '#574938',
//           font: {
//             size: 16
//           }
//         }
//       },
//       title: {
//         display: false // 去除 "量表總平均分數" 標題
//       }
//     },
//     layout: {
//       padding: {
//         top: 20,
//         bottom: 20
//       }
//     }
//   };

//   return (
//     <div style={{ width: '400px', height: '600px', padding: '10px', borderRadius: '10px' }}>
//       <Radar data={data} options={options} />
//     </div>
//   );
// }

// export default RadarChartComponent;
