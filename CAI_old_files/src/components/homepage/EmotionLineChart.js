import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import moment from 'moment';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function EmotionLineChart({ labels, introspection, temper, attitude, sensitivity }) {
  const allInSameYear = labels.every(label => new Date(label).getFullYear() === new Date(labels[0]).getFullYear());
  const year = new Date(labels[0]).getFullYear();

  const formattedLabels = labels.map((label, index) => {
    const date = new Date(label);
    const formattedDate = moment(date).format('MM-DD'); 
    return index === 0 && allInSameYear ? `${year} ${formattedDate}` : formattedDate;
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
          text: '日期',
          font: {
            size: 14,
            // weight: 'bold',
            family: 'GenSenRounded'
          }
        },
        ticks: {
          font: {
            size: 14,
            // weight: 'bold',
            family: 'GenSenRounded'
          }
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '得分',
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

  return <Line data={data} options={options} style={{ width: '100%', height: '100%' }} />;
}

export default EmotionLineChart;