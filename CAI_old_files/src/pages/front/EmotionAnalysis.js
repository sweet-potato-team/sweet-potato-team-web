import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import EmotionLineChart from '../../components/homepage/EmotionLineChart';
import EmotionBarChart from '../../components/homepage/EmotionBarChart';
import WordCloudComponent from '../../components/homepage/WordCloudComponent';
import Loading from '../../components/Loading';  // 引入你自定義的 Loading 組件
// import moment from 'moment';

function EmotionAnalysis({ sysUserId, startDate, endDate }) {
  const [labels, setLabels] = useState([]);
  const [introspection, setIntrospection] = useState([]);
  const [temper, setTemper] = useState([]);
  const [attitude, setAttitude] = useState([]);
  const [sensitivity, setSensitivity] = useState([]);
  const [barLabels, setBarLabels] = useState([]);
  const [barData, setBarData] = useState([]);
  const [wordList, setWordList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = { startDate, endDate };
  
      // Ensure the API endpoint and parameters are correct
      const response = await axios.get(`http://localhost:8080/api/emotionAnalyses/user/${sysUserId}`, { params });
      const data = response.data;
  
      if (!data || !data.emotionAnalyses || !data.segmentedMessages) {
        console.warn("No data returned from the server.");
        setIsLoading(false);
        return;
      }
  
      // Process and sort the data
      const sortedData = data.emotionAnalyses.sort((a, b) => new Date(a.createdTime) - new Date(b.createdTime));
  
      setLabels(sortedData.map(entry => entry.createdTime));
      setIntrospection(sortedData.map(entry => entry.classIntrospectionPer));
      setTemper(sortedData.map(entry => entry.classTemperPer));
      setAttitude(sortedData.map(entry => entry.classAttitudePer));
      setSensitivity(sortedData.map(entry => entry.classSensitivityPer));
      setBarLabels(sortedData.map(entry => entry.emotionRecog1Label));
      setBarData(sortedData.map(entry => entry.emotionRecog1Score));
      setWordList(data.segmentedMessages);
  
    } catch (error) {
      console.error("Error fetching data:", error);
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
    <div >
      {/* <h2>這是情緒分析結果頁面</h2>
      <p>使用者ID: {sysUserId}</p> */}
      <div className="scroll-container">
      <div className="chart-container">
          <h3>情緒變化圖</h3>
          <EmotionLineChart labels={labels} introspection={introspection} temper={temper} attitude={attitude} sensitivity={sensitivity} />
        </div>
        <div className="chart-container">
          <h3>情緒統計圖</h3>
          <EmotionBarChart barLabels={barLabels} barData={barData} />
        </div>
        <div className="chart-container">
          <h3>文字雲</h3>
          <WordCloudComponent wordList={wordList} />
        </div>
      </div>
      <Loading isLoading={isLoading} />
    </div>
  );
}

export default EmotionAnalysis;