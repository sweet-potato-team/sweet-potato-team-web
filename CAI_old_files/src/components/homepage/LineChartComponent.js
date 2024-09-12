import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import moment from 'moment';

// 註冊需要的插件
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function LineChartComponent({ labels, totalScores }) {
  console.log("LineChartComponent labels:", labels); // 檢查 labels
  console.log("LineChartComponent totalScores:", totalScores); // 檢查 totalScores

  // 確認是否所有日期都在同一年
  const allInSameYear = labels.every(label => new Date(label).getFullYear() === new Date(labels[0]).getFullYear());
  const year = new Date(labels[0]).getFullYear();

  // 格式化日期，去除時間部分，並在圖表最左側顯示年份
  const formattedLabels = labels.map((label, index) => {
    const date = new Date(label);
    const formattedDate = moment(date).format('MM-DD'); // 僅顯示月日
    return index === 0 && allInSameYear ? `${year} ${formattedDate}` : formattedDate; // 如果是同一年，第一個日期顯示年份
  });

  // 排序同一天的數據，確保正確順序
  const sortedData = totalScores.map((score, index) => ({ date: new Date(labels[index]), score }))
    .sort((a, b) => a.date - b.date)
    .map(item => item.score);

  const data = {
    labels: formattedLabels,
    datasets: [{
      data: sortedData,  // 使用排序後的數據
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderWidth: 2,
      fill: true
    }]
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: '日期(月-日)'  // X軸標題變更為 "日期(月-日)"
        }
      },
      y: {
        min: 0,
        max: 45,  // 固定 Y 軸範圍 0 到 45
        ticks: {
          stepSize: 5,  // 每 5 一個間距
          callback: function(value) {
            return value; // 顯示每 5 的倍數
          }
        },
        title: {
          display: true,
          text: '總分'  // Y軸標題變更為 "總分"
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `分數 : ${tooltipItem.raw}`;  // hover 時顯示 "分數 : XX"
          }
        }
      },
      legend: {
        display: false // 隱藏圖例 "Total Score Over Time"
      },
      title: {
        display: false,  // 隱藏標題 "Total Score Progression Over Time"
      }
    },
    responsive: true,
    maintainAspectRatio: false  // 允許自定義高度和寬度
  };

  return (
    <div style={{ width: '100%', height: '500px', padding: '20px', borderRadius: '10px' }}>
      <Line data={data} options={options} />
    </div>
  );
}

export default LineChartComponent;
