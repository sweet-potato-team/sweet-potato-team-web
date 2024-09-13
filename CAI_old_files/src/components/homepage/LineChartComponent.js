import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import moment from 'moment';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function LineChartComponent({ labels, totalScores }) {
  console.log("LineChartComponent labels:", labels); 
  console.log("LineChartComponent totalScores:", totalScores);

  const allInSameYear = labels.every(label => new Date(label).getFullYear() === new Date(labels[0]).getFullYear());
  const year = new Date(labels[0]).getFullYear();

  const formattedLabels = labels.map((label, index) => {
    const date = new Date(label);
    const formattedDate = moment(date).format('MM-DD'); 
    return index === 0 && allInSameYear ? `${year} ${formattedDate}` : formattedDate; 
  });

  const sortedData = totalScores.map((score, index) => ({ date: new Date(labels[index]), score }))
    .sort((a, b) => a.date - b.date)
    .map(item => item.score);

  const data = {
    labels: formattedLabels,
    datasets: [{
      data: sortedData,
      borderColor: 'rgba(237,189,130,0.8)',
      backgroundColor: 'rgba(244,214,177,0.4)',
      pointBackgroundColor: '#EDBD82',  // Set point color
      borderWidth: 2,
      fill: true
    }]
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: '日期(月-日)',
          font: {
            size: 16,
            family: 'GenSenRounded'  // 使用你定義的字體
          }
        },
        ticks: {
          font: {
            size: 14,
            family: 'GenSenRounded'  // 使用你定義的字體
          }
        }
      },
      y: {
        min: 0,
        max: 40,
        ticks: {
          stepSize: 10,
          font: {
            size: 14,
            family: 'GenSenRounded'  // 使用你定義的字體
          }
        },
        title: {
          display: true,
          text: '總分',
          font: {
            size: 16,
            family: 'GenSenRounded'  // 使用你定義的字體
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `分數 : ${tooltipItem.raw}`; 
          }
        }
      },
      legend: {
        display: false 
      },
      title: {
        display: false,
      }
    },
    responsive: true,
    maintainAspectRatio: false 
  };

  // 动态设置图表宽度，根据数据量调整宽度
  const getChartWidth = () => {
    const baseWidth = 150; // 基础宽度
    const extraWidthPerPoint = 40; // 每个点的额外宽度
    const totalWidth = baseWidth + labels.length * extraWidthPerPoint;
    return `${totalWidth}px`;
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ marginTop:'10px', width: getChartWidth(), height: '320px', borderRadius: '10px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default LineChartComponent;