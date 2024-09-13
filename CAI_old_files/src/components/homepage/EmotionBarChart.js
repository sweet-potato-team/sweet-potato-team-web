import React from 'react';
import { Bar } from 'react-chartjs-2';

function EmotionBarChart({ barLabels, barData }) {
  const data = {
    labels: barLabels,
    datasets: [{
      label: '情緒標籤數量',
      data: barData,
      backgroundColor: '#D3E9FF',
      borderColor: '#7FAAC7',
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14,
            // weight: 'bold',
            family: 'GenSenRounded'
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '標籤',
          font: {
            size: 14,
            // weight: 'bold',
            family: 'GenSenRounded'
          }
        },
        ticks: {
          font: {
            size: 14,
            weight: 'bold',
            family: 'GenSenRounded'
          }
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '出現次數',
          font: {
            size: 14,
            // weight: 'bold',
            family: 'GenSenRounded'
          }
        },
        ticks: {
          font: {
            size: 14,
            weight: 'bold',
            family: 'GenSenRounded'
          }
        }
      }
    }
  };

  return <Bar data={data} options={options} style={{ width: '100%', height: '100%' }} />;
}

export default EmotionBarChart;


// import React from 'react';
// import { Bar } from 'react-chartjs-2';

// function EmotionBarChart({ barLabels, barData }) {
//   const data = {
//     labels: barLabels,
//     datasets: [{
//       label: '情緒標籤數量',
//       data: barData,
//       backgroundColor: '#D3E9FF',
//       borderColor: '#7FAAC7',
//       borderWidth: 1
//     }]
//   };

//   const options = {
//     responsive: true,
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: '標籤'
//         }
//       },
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: '出現次數'
//         }
//       }
//     }
//   };
//   return <Bar data={data} options={options} style={{ width: '100%', height: '100%' }} />;

// }

// export default EmotionBarChart;
