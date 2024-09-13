import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Loading from '../../components/Loading'; // 引入 Loading 組件
import RadarChartComponent from '../../components/homepage/RadarChartComponent';
import LineChartComponent from '../../components/homepage/LineChartComponent';

function DepressionScaleData({ sysUserId, startDate, endDate }) {
  const [avgData, setAvgData] = useState(null);
  const [labels, setLabels] = useState([]);
  const [totalScores, setTotalScores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log(`Fetching data for sysUserId: ${sysUserId}, startDate: ${startDate}, endDate: ${endDate}`);

      const params = { startDate, endDate };
      const response = await axios.get(`http://localhost:8080/api/depressionScaleResults/user/${sysUserId}`, { params });

      console.log("API response:", response.data); // 檢查 API 返回的數據

      const data = response.data;

      if (!data || data.length === 0) {
        console.warn("No data returned from the server.");
        setIsLoading(false);
        return;
      }

      const avg_cat_emotion = data.map(d => d.catEmotion).reduce((a, b) => a + b, 0) / data.length;
      const avg_cat_sleep = data.map(d => d.catSleep).reduce((a, b) => a + b, 0) / data.length;
      const avg_cat_psych = data.map(d => d.catPsych).reduce((a, b) => a + b, 0) / data.length;
      const avg_cat_anxiety = data.map(d => d.catAnxiety).reduce((a, b) => a + b, 0) / data.length;
      const avg_cat_physical = data.map(d => d.catPhysical).reduce((a, b) => a + b, 0) / data.length;
      const avg_total_score = data.map(d => d.totalScore).reduce((a, b) => a + b, 0) / data.length;

      const avgData = {
        avg_cat_emotion,
        avg_cat_sleep,
        avg_cat_psych,
        avg_cat_anxiety,
        avg_cat_physical,
        avg_total_score
      };

      setAvgData(avgData);

      const labels = data.map(d => d.testDatetime);
      const totalScores = data.map(d => d.totalScore);

      setLabels(labels);
      setTotalScores(totalScores);

    } catch (error) {
      console.error("Error fetching depression scale data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sysUserId, startDate, endDate]);

  useEffect(() => {
    if (sysUserId && startDate && endDate) {
      fetchData();
    }
  }, [sysUserId, startDate, endDate, fetchData]);

  return (
    <div>
      <Loading isLoading={isLoading} />
      {!isLoading && (!startDate || !endDate) ? (
        <div className="scroll-container">
          <div className="empty-message">
            <h3>請先選擇時間才能看圖表數據 ٩(๑•̀ω•́๑)۶</h3>
          </div>
        </div>
      ) : (!isLoading && avgData) ? (
        <div className="scroll-container">
          <div className="chart-container">
            <h3>雷達圖 - 平均分數</h3>
            <RadarChartComponent avgData={avgData} />
          </div>
          <div className="chart-container">
            <h3>總分摺線圖</h3>
            <LineChartComponent labels={labels} totalScores={totalScores} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default DepressionScaleData;
// import React, { useEffect, useState, useCallback } from 'react';
// import axios from 'axios';
// import Loading from '../../components/Loading'; // 引入 Loading 組件
// import RadarChartComponent from '../../components/homepage/RadarChartComponent';
// import LineChartComponent from '../../components/homepage/LineChartComponent';

// function DepressionScaleData({ sysUserId, startDate, endDate }) {
//   const [avgData, setAvgData] = useState(null);
//   const [labels, setLabels] = useState([]);
//   const [totalScores, setTotalScores] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchData = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       console.log(`Fetching data for sysUserId: ${sysUserId}, startDate: ${startDate}, endDate: ${endDate}`);

//       const params = { startDate, endDate };
//       const response = await axios.get(`http://localhost:8080/api/depressionScaleResults/user/${sysUserId}`, { params });

//       console.log("API response:", response.data); // 檢查 API 返回的數據

//       const data = response.data;

//       if (!data || data.length === 0) {
//         console.warn("No data returned from the server.");
//         setIsLoading(false);
//         return;
//       }

//       // 確保你在此處檢查 avgData 是否正確傳遞
//       const avg_cat_emotion = data.map(d => d.catEmotion).reduce((a, b) => a + b, 0) / data.length;
//       const avg_cat_sleep = data.map(d => d.catSleep).reduce((a, b) => a + b, 0) / data.length;
//       const avg_cat_psych = data.map(d => d.catPsych).reduce((a, b) => a + b, 0) / data.length;
//       const avg_cat_anxiety = data.map(d => d.catAnxiety).reduce((a, b) => a + b, 0) / data.length;
//       const avg_cat_physical = data.map(d => d.catPhysical).reduce((a, b) => a + b, 0) / data.length;
//       const avg_total_score = data.map(d => d.totalScore).reduce((a, b) => a + b, 0) / data.length;

//       const avgData = {
//         avg_cat_emotion,
//         avg_cat_sleep,
//         avg_cat_psych,
//         avg_cat_anxiety,
//         avg_cat_physical,
//         avg_total_score
//       };

//       console.log("Calculated avgData:", avgData); // 新增這裡來檢查計算後的 avgData
//       setAvgData(avgData);

//       const labels = data.map(d => d.testDatetime);
//       const totalScores = data.map(d => d.totalScore);

//       console.log("Setting labels:", labels);    // 檢查 labels 值
//       console.log("Setting totalScores:", totalScores); // 檢查 totalScores 值

//       setLabels(labels);
//       setTotalScores(totalScores);

//     } catch (error) {
//       console.error("Error fetching depression scale data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [sysUserId, startDate, endDate]);

//   useEffect(() => {
//     if (sysUserId && startDate && endDate) {
//       fetchData();
//     }
//   }, [sysUserId, startDate, endDate, fetchData]);

//   return (
//     <div>
//       <Loading isLoading={isLoading} />
//       {!isLoading && avgData ? (
//         <div className="scroll-container">
//           <div className="chart-container">
//             <h3>雷達圖 - 平均分數</h3>
//             <RadarChartComponent avgData={avgData} />
//           </div>
//           <div className="chart-container">
//             <h3>總分摺線圖</h3>
//             <LineChartComponent labels={labels} totalScores={totalScores} />
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// export default DepressionScaleData;
