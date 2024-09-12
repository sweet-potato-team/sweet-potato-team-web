import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import moment from 'moment';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function EmotionLineChart({ labels, introspection, temper, attitude, sensitivity }) {
  // 確認是否所有日期都在同一年
  const allInSameYear = labels.every(label => new Date(label).getFullYear() === new Date(labels[0]).getFullYear());
  const year = new Date(labels[0]).getFullYear();

  // 處理日期顯示格式，只顯示 MM-DD，並在圖表最左側顯示年份
  const formattedLabels = labels.map((label, index) => {
    const date = new Date(label);
    const formattedDate = moment(date).format('MM-DD'); // 僅顯示月日
    return index === 0 && allInSameYear ? `${year} ${formattedDate}` : formattedDate; // 第一個日期顯示年份
  });

  const data = {
    labels: formattedLabels,
    datasets: [
      {
        label: '內省',
        data: introspection,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: '脾氣',
        data: temper,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: '態度',
        data: attitude,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: '敏感性',
        data: sensitivity,
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        fill: false,
        borderWidth: 2,
        tension: 0.4,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '日期'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '得分'
        }
      }
    }
  };

  return <Line data={data} options={options} style={{ width: '100%', height: '100%' }} />;
}

export default EmotionLineChart;

// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);



// function EmotionLineChart({ labels, introspection, temper, attitude, sensitivity }) {
//   console.log("Labels:", labels);
//   console.log("Introspection:", introspection);
//   console.log("Temper:", temper);
//   console.log("Attitude:", attitude);
//   console.log("Sensitivity:", sensitivity);
  
//   const data = {
//     labels: labels,
//     datasets: [
//       {
//         label: '內省',
//         data: introspection,
//         borderColor: 'rgba(75, 192, 192, 1)',
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         fill: false,
//         borderWidth: 2,
//         tension: 0.4,
//       },
//       {
//         label: '脾氣',
//         data: temper,
//         borderColor: 'rgba(255, 99, 132, 1)',
//         backgroundColor: 'rgba(255, 99, 132, 0.2)',
//         fill: false,
//         borderWidth: 2,
//         tension: 0.4,
//       },
//       {
//         label: '態度',
//         data: attitude,
//         borderColor: 'rgba(54, 162, 235, 1)',
//         backgroundColor: 'rgba(54, 162, 235, 0.2)',
//         fill: false,
//         borderWidth: 2,
//         tension: 0.4,
//       },
//       {
//         label: '敏感性',
//         data: sensitivity,
//         borderColor: 'rgba(255, 206, 86, 1)',
//         backgroundColor: 'rgba(255, 206, 86, 0.2)',
//         fill: false,
//         borderWidth: 2,
//         tension: 0.4,
//       }
//     ]
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: true,
//         position: 'top',
//       },
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: '日期'
//         }
//       },
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: '得分'
//         }
//       }
//     }
//   };

//   // return <Line data={data} options={options} />;
//   return <Line data={data} options={options} style={{ width: '100%', height: '100%' }} />;

// }
// export default EmotionLineChart;

