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




// import axios from 'axios';
// import React, { useEffect, useState, useCallback } from 'react';
// import EmotionLineChart from '../../components/homepage/EmotionLineChart';
// import EmotionBarChart from '../../components/homepage/EmotionBarChart';
// import WordCloudComponent from '../../components/homepage/WordCloudComponent';
// import Loading from '../../components/Loading';  // 引入你自定義的 Loading 組件

// function EmotionAnalysis({ sysUserId, startDate, endDate }) {
//   const [labels, setLabels] = useState([]);
//   const [introspection, setIntrospection] = useState([]);
//   const [temper, setTemper] = useState([]);
//   const [attitude, setAttitude] = useState([]);
//   const [sensitivity, setSensitivity] = useState([]);
//   const [barLabels, setBarLabels] = useState([]);
//   const [barData, setBarData] = useState([]);
//   const [wordList, setWordList] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchData = useCallback(async () => {
//     setIsLoading(true); // 啟動加載指示
//     console.log("Fetching data for sysUserId:", sysUserId);
//     const params = { startDate, endDate };
//     const response = await axios.get(`http://localhost:8080/api/emotionAnalyses/user/${sysUserId}`, { params });
//     const data = response.data;

//     if (!data || !data.emotionAnalyses || !data.segmentedMessages) {
//       console.warn(`No data returned from the server for sysUserId: ${sysUserId}`);
//       setIsLoading(false);
//       return;
//     }

//     setLabels(data.emotionAnalyses.map(entry => entry.createdTime));
//     setIntrospection(data.emotionAnalyses.map(entry => entry.classIntrospectionPer));
//     setTemper(data.emotionAnalyses.map(entry => entry.classTemperPer));
//     setAttitude(data.emotionAnalyses.map(entry => entry.classAttitudePer));
//     setSensitivity(data.emotionAnalyses.map(entry => entry.classSensitivityPer));
//     setBarLabels(data.emotionAnalyses.map(entry => entry.emotionRecog1Label));
//     setBarData(data.emotionAnalyses.map(entry => entry.emotionRecog1Score));
//     setWordList(data.segmentedMessages);
//     setIsLoading(false); // 結束加載指示
//   }, [sysUserId, startDate, endDate]);

//   useEffect(() => {
//     if (sysUserId && startDate && endDate) {
//       fetchData();
//     }
//   }, [sysUserId, startDate, endDate, fetchData]);

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
//       <h2>這是情緒分析結果頁面</h2>
//       <p>使用者ID: {sysUserId}</p>
//       <div style={{
//         display: 'flex',
//         overflowX: 'auto',
//         width: '100%',
//         // padding: '20px 0',
//         height: '450px', // 確保所有子元素擁有統一的高度
//       }}>
//         <div style={{ flex: '1 1 0px' }}></div> {/* 空白區域 */}
//         <div style={{ flex: '0 0 auto', minWidth: '500px', backgroundColor: '#EFEBE6', height: '100%', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//           <EmotionLineChart labels={labels} introspection={introspection} temper={temper} attitude={attitude} sensitivity={sensitivity} />
//         </div>
//         <div style={{ flex: '0 0 auto', minWidth: '500px', backgroundColor: '#EFEBE6', height: '100%', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//           <EmotionBarChart barLabels={barLabels} barData={barData} />
//         </div>
//         <div style={{ flex: '0 0 auto', minWidth: '500px', backgroundColor: '#EFEBE6', height: '100%', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//           <WordCloudComponent wordList={wordList} />
//         </div>
//         <div style={{ flex: '1 1 0px' }}></div> {/* 空白區域 */}
//       </div>
//       <Loading isLoading={isLoading} />
//     </div>
//   );
  
  
// }

// export default EmotionAnalysis;





// import axios from 'axios';
// import React, { useEffect, useState, useCallback } from 'react';
// import EmotionLineChart from '../../components/homepage/EmotionLineChart';
// import EmotionBarChart from '../../components/homepage/EmotionBarChart';
// import WordCloudComponent from '../../components/homepage/WordCloudComponent';
// import Loading from '../../components/Loading';  // 引入你自定義的 Loading 組件

// function EmotionAnalysis({ sysUserId, startDate, endDate }) {
//   const [labels, setLabels] = useState([]);
//   const [introspection, setIntrospection] = useState([]);
//   const [temper, setTemper] = useState([]);
//   const [attitude, setAttitude] = useState([]);
//   const [sensitivity, setSensitivity] = useState([]);
//   const [barLabels, setBarLabels] = useState([]);
//   const [barData, setBarData] = useState([]);
//   const [wordList, setWordList] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchData = useCallback(async () => {
//     setIsLoading(true); // 啟動加載指示
//     console.log("Fetching data for sysUserId:", sysUserId);
//     const params = { startDate, endDate };
//     const response = await axios.get(`http://localhost:8080/api/emotionAnalyses/user/${sysUserId}`, { params });
//     const data = response.data;

//     if (!data || !data.emotionAnalyses || !data.segmentedMessages) {
//       console.warn(`No data returned from the server for sysUserId: ${sysUserId}`);
//       setIsLoading(false);
//       return;
//     }

//     setLabels(data.emotionAnalyses.map(entry => entry.createdTime));
//     setIntrospection(data.emotionAnalyses.map(entry => entry.classIntrospectionPer));
//     setTemper(data.emotionAnalyses.map(entry => entry.classTemperPer));
//     setAttitude(data.emotionAnalyses.map(entry => entry.classAttitudePer));
//     setSensitivity(data.emotionAnalyses.map(entry => entry.classSensitivityPer));
//     setBarLabels(data.emotionAnalyses.map(entry => entry.emotionRecog1Label));
//     setBarData(data.emotionAnalyses.map(entry => entry.emotionRecog1Score));
//     setWordList(data.segmentedMessages);
//     setIsLoading(false); // 結束加載指示
//   }, [sysUserId, startDate, endDate]);

//   useEffect(() => {
//     if (sysUserId && startDate && endDate) {
//       fetchData();
//     }
//   }, [sysUserId, startDate, endDate, fetchData]);

// return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
//       <h2>這是情緒分析結果頁面</h2>
//       <p>使用者ID: {sysUserId}</p>
//       <div style={{
//         display: 'flex',
//         overflowX: 'auto',
//         height: '100%',
//         padding: '20px 0'
//       }}>
//         <div style={{ flex: '1 1 0px' }}></div> {/* 空白區域 */}
//         <div style={{ flex: '0 0 auto', minWidth: '500px' }}>
//           <EmotionLineChart labels={labels} introspection={introspection} temper={temper} attitude={attitude} sensitivity={sensitivity} />
//         </div>
//         <div style={{ flex: '0 0 auto', minWidth: '500px' }}>
//           <EmotionBarChart barLabels={barLabels} barData={barData} />
//         </div>
//         <div style={{ flex: '0 0 auto', minWidth: '500px' }}>
//           <WordCloudComponent wordList={wordList} />
//         </div>
//         <div style={{ flex: '1 1 0px' }}></div> {/* 空白區域 */}
//       </div>
//       <Loading isLoading={isLoading} />
//     </div>
//   );

//   // return (
//   //   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//   //     <h2>這是情緒分析結果頁面</h2>
//   //     <p>使用者ID: {sysUserId}</p>
//   //     <div style={{ display: 'flex', overflowX: 'auto', width: '100%' }}>
//   //       <div style={{ flex: '5%' }}></div>
//   //       <EmotionLineChart style={{ flex: '30%' }} labels={labels} introspection={introspection} temper={temper} attitude={attitude} sensitivity={sensitivity} />
//   //       <EmotionBarChart style={{ flex: '30%' }}  barLabels={barLabels} barData={barData} />
//   //       <WordCloudComponent style={{ flex: '30%' }}  wordList={wordList} />
//   //       <div style={{ flex: '5%' }}></div>
//   //     </div>
//   //     <Loading isLoading={isLoading} />
//   //   </div>
//   // );
// }

// export default EmotionAnalysis;













// import axios from 'axios';
// import React, { useEffect, useState, useCallback } from 'react';
// import EmotionLineChart from '../../components/homepage/EmotionLineChart';
// import EmotionBarChart from '../../components/homepage/EmotionBarChart';
// import WordCloudComponent from '../../components/homepage/WordCloudComponent';

// function EmotionAnalysis({ sysUserId, startDate, endDate }) {
//   const [labels, setLabels] = useState([]);
//   const [introspection, setIntrospection] = useState([]);
//   const [temper, setTemper] = useState([]);
//   const [attitude, setAttitude] = useState([]);
//   const [sensitivity, setSensitivity] = useState([]);
//   const [barLabels, setBarLabels] = useState([]);
//   const [barData, setBarData] = useState([]);
//   const [wordList, setWordList] = useState([]);


//   const fetchData = useCallback(async () => {
//   console.log("Fetching data for sysUserId:", sysUserId);
//   const params = { startDate, endDate };
//   const response = await axios.get(`http://localhost:8080/api/emotionAnalyses/user/${sysUserId}`, { params });
//   const data = response.data;

//   console.log("Data received from server:", data);
//   if (!data || !data.emotionAnalyses || !data.segmentedMessages) {
//     console.warn(`No data returned from the server for sysUserId: ${sysUserId}`);
//     return;
//   }

//   if (data.emotionAnalyses.length && data.segmentedMessages.length) {
//     setLabels(data.emotionAnalyses.map(entry => entry.createdTime));
//     setIntrospection(data.emotionAnalyses.map(entry => entry.classIntrospectionPer));
//     setTemper(data.emotionAnalyses.map(entry => entry.classTemperPer));
//     setAttitude(data.emotionAnalyses.map(entry => entry.classAttitudePer));
//     setSensitivity(data.emotionAnalyses.map(entry => entry.classSensitivityPer));
//     setBarLabels(data.emotionAnalyses.map(entry => entry.emotionRecog1Label));
//     setBarData(data.emotionAnalyses.map(entry => entry.emotionRecog1Score));
//     setWordList(data.segmentedMessages);
//   } else {
//     console.error("Mismatch in data segments from response");
//   }
// }, [sysUserId, startDate, endDate]);



//   useEffect(() => {
//     if (sysUserId && startDate && endDate) {
//       fetchData();
//     }
//   }, [sysUserId, startDate, endDate, fetchData]);

//   // if (!emotionData) {
//   //   return <div>Loading or no data available...</div>;
//   // }
//   return (
//     <div>
//       <h2>這是情緒分析結果頁面</h2>
//       <p>使用者ID: {sysUserId}</p>

//       <h3>情緒分析折線圖</h3>
//       <EmotionLineChart labels={labels} introspection={introspection} temper={temper} attitude={attitude} sensitivity={sensitivity} />

//       <h3>標籤數量長條圖</h3>
//       <EmotionBarChart barLabels={barLabels} barData={barData} />

//       <h3>文字雲</h3>
//       <WordCloudComponent wordList={wordList} />
//     </div>
//   );
// }

// export default EmotionAnalysis;



  // const fetchData = useCallback(async () => {
  //   try {
  //     console.log("Fetching data for sysUserId:", sysUserId);
  //     // console.log("Start Date:", startDate, "End Date:", endDate);
      
  //     const params = { startDate, endDate };
  //     const response = await axios.get(`http://localhost:8080/api/emotionAnalyses/user/${sysUserId}`, { params });
  //     const data = response.data;
  
  //     console.log("Data received from server:", data);
  //     if (!data || data.length === 0) {
  //       console.warn(`No data returned from the server for sysUserId: ${sysUserId}`);
  //       return;
  //     }
  
  //     // 更新图表状态
  //     setLabels(data.map(entry => entry.createdTime));
  //     setIntrospection(data.map(entry => entry.classIntrospectionPer));
  //     setTemper(data.map(entry => entry.classTemperPer));
  //     setAttitude(data.map(entry => entry.classAttitudePer));
  //     setSensitivity(data.map(entry => entry.classSensitivityPer));
  //     setBarLabels(data.map(entry => entry.emotionRecog1Label));
  //     setBarData(data.map(entry => entry.emotionRecog1Score));
  
  //     setWordList(data.segmentedMessages);

  //     // 单独处理文字云数据
  //     // 此处假设后端已经处理了分词并返回了分词结果数组，每个结果包含文本和频率
  //     // const wordCloudData = data.map(entry => [entry.userMessage, 10]);  // 假设每条消息出现10次
  //     // console.log("WordCloud Data:", wordCloudData);
  //     // setWordList(wordCloudData);
  //   } catch (error) {
  //     console.error("Error fetching emotion analysis data:", error);
  //   }
  // }, [sysUserId, startDate, endDate]);
  


// import axios from 'axios';
// import React, { useEffect, useState, useCallback } from 'react';
// import EmotionLineChart from '../../components/homepage/EmotionLineChart';
// import EmotionBarChart from '../../components/homepage/EmotionBarChart';
// import WordCloudComponent from '../../components/homepage/WordCloudComponent';

// function EmotionAnalysis({ sysUserId, startDate, endDate }) {
//   const [labels, setLabels] = useState([]);
//   const [introspection, setIntrospection] = useState([]);
//   const [temper, setTemper] = useState([]);
//   const [attitude, setAttitude] = useState([]);
//   const [sensitivity, setSensitivity] = useState([]);
//   const [barLabels, setBarLabels] = useState([]);
//   const [barData, setBarData] = useState([]);
//   const [wordList, setWordList] = useState([]);

//   const fetchData = useCallback(async () => {
//     try {
//       console.log("Fetching data for sysUserId:", sysUserId);
//       console.log("開始日期:", startDate, "結束日期:", endDate);
      
//       const params = {
//         startDate,  // 直接使用傳遞過來的日期
//         endDate,
//       };
      
//       const response = await axios.get(`http://localhost:8080/api/emotionAnalyses/user/${sysUserId}`, { params });
//       const data = response.data;

//       console.log("Data received from server:", data);
//       if (!data || data.length === 0) {
//         console.warn(`No data returned from the server for sysUserId: ${sysUserId}`);
//         return;
//       }

//       // 更新狀態
//       setLabels(data.map(entry => entry.createdTime));
//       setIntrospection(data.map(entry => entry.classIntrospectionPer));
//       setTemper(data.map(entry => entry.classTemperPer));
//       setAttitude(data.map(entry => entry.classAttitudePer));
//       setSensitivity(data.map(entry => entry.classSensitivityPer));
//       setBarLabels(data.map(entry => entry.emotionRecog1Label));
//       setBarData(data.map(entry => entry.emotionRecog1Score));
//       setWordList(data.map(entry => [entry.userMessage, 10]));
//     } catch (error) {
//       console.error("Error fetching emotion analysis data:", error);
//     }
//   }, [sysUserId, startDate, endDate]);

//   useEffect(() => {
//     if (sysUserId && startDate && endDate) {
//       fetchData();
//     }
//   }, [sysUserId, startDate, endDate, fetchData]);

//   return (
//     <div>
//       <h2>這是情緒分析結果頁面</h2>
//       <p>使用者ID: {sysUserId}</p>

//       <h3>情緒分析折線圖</h3>
//       <EmotionLineChart labels={labels} introspection={introspection} temper={temper} attitude={attitude} sensitivity={sensitivity} />

//       <h3>標籤數量長條圖</h3>
//       <EmotionBarChart barLabels={barLabels} barData={barData} />

//       <h3>文字雲</h3>
//       <WordCloudComponent wordList={wordList} />
//     </div>
//   );
// }

// export default EmotionAnalysis;


















// import axios from 'axios';
// import React, { useEffect, useState, useCallback } from 'react';
// import EmotionLineChart from '../../components/homepage/EmotionLineChart';
// import EmotionBarChart from '../../components/homepage/EmotionBarChart';
// import WordCloudComponent from '../../components/homepage/WordCloudComponent';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// function EmotionAnalysis({ sysUserId }) {
//   const [labels, setLabels] = useState([]);
//   const [introspection, setIntrospection] = useState([]);
//   const [temper, setTemper] = useState([]);
//   const [attitude, setAttitude] = useState([]);
//   const [sensitivity, setSensitivity] = useState([]);
//   const [barLabels, setBarLabels] = useState([]);
//   const [barData, setBarData] = useState([]);
//   const [wordList, setWordList] = useState([]);

//   // 添加選擇起始和結束日期的狀態
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);

//   const fetchData = useCallback(async () => {
//     try {
//       const params = {
//         startDate: startDate ? startDate.toISOString().split('T')[0] : null, // 只傳遞日期部分
//         endDate: endDate ? endDate.toISOString().split('T')[0] : null,       // 只傳遞日期部分
//       };
//       const response = await axios.get(`http://localhost:8080/api/emotionAnalyses/user/${sysUserId}`, { params });
//       const data = response.data;
  
//       console.log("Data received from server:", data);
//       if (!data || data.length === 0) {
//         console.warn(`No data returned from the server for sysUserId: ${sysUserId}`);
//         return;
//       }

//       // 更新狀態
//       setLabels(data.map(entry => entry.createdTime));
//       setIntrospection(data.map(entry => entry.classIntrospectionPer));
//       setTemper(data.map(entry => entry.classTemperPer));
//       setAttitude(data.map(entry => entry.classAttitudePer));
//       setSensitivity(data.map(entry => entry.classSensitivityPer));
//       setBarLabels(data.map(entry => entry.emotionRecog1Label));
//       setBarData(data.map(entry => entry.emotionRecog1Score));
//       setWordList(data.map(entry => [entry.userMessage, 10])); // 假設每個消息都出現 10 次
//     } catch (error) {
//       console.error("Error fetching emotion analysis data:", error);
//     }
// }, [sysUserId, startDate, endDate]);

//   // 使用 useEffect 監控 sysUserId、startDate 和 endDate 的變化
//   useEffect(() => {
//     if (sysUserId) {
//       fetchData();
//     }
//   }, [sysUserId, fetchData]);

//   return (
//     <div>
//       <h2>這是情緒分析結果頁面</h2>
//       <p>使用者ID: {sysUserId}</p>

//       {/* 起始和結束時間選擇器 */}
//       <div>
//         <label>開始日期: </label>
//         <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
//         <label>結束日期: </label>
//         <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
//       </div>

//       <h3>情緒分析折線圖</h3>
//       <EmotionLineChart labels={labels} introspection={introspection} temper={temper} attitude={attitude} sensitivity={sensitivity} />

//       <h3>標籤數量長條圖</h3>
//       <EmotionBarChart barLabels={barLabels} barData={barData} />

//       <h3>文字雲</h3>
//       <WordCloudComponent wordList={wordList} />
//     </div>
//   );
// }

// export default EmotionAnalysis;



// import axios from 'axios';
// import React, { useEffect, useState, useCallback  } from 'react';
// import EmotionLineChart from '../../components/homepage/EmotionLineChart';
// import EmotionBarChart from '../../components/homepage/EmotionBarChart';
// import WordCloudComponent from '../../components/homepage/WordCloudComponent';

// function EmotionAnalysis({ userId ,sysUserId}) {
//   const [labels, setLabels] = useState([]);
//   const [introspection, setIntrospection] = useState([]);
//   const [temper, setTemper] = useState([]);
//   const [attitude, setAttitude] = useState([]);
//   const [sensitivity, setSensitivity] = useState([]);
//   const [barLabels, setBarLabels] = useState([]);
//   const [barData, setBarData] = useState([]);
//   const [wordList, setWordList] = useState([]);


//   const fetchData = useCallback(async () => {
//     try {
//       console.log("Fetching data for sysUserId:", sysUserId);
//       const response = await axios.get(`http://localhost:8080/api/emotionAnalyses/user/${sysUserId}`);
//       const data = response.data;
  
//       console.log("Data received from server:", data);
//       if (!data || data.length === 0) {
//         console.warn(`No data returned from the server for sysUserId: ${sysUserId}`);
//         return;
//       }
  
//       console.log("Data fetched:", data);
  
//       // 確保數據結構正確並更新狀態
//         setLabels(data.labels || []);                 // 確保 labels 為數組
//         setIntrospection(data.introspection || []);   // 確保 introspection 為數組
//         setTemper(data.temper || []);                 // 確保 temper 為數組
//         setAttitude(data.attitude || []);             // 確保 attitude 為數組
//         setSensitivity(data.sensitivity || []);       // 確保 sensitivity 為數組
//         setBarLabels(data.barLabels || []);           // 確保 barLabels 為數組
//         setBarData(data.barData || []);               // 確保 barData 為數組
//         setWordList(data.wordList || []);             // 確保 wordList 為數組
  
//     } catch (error) {
//       console.error("Error fetching emotion analysis data:", error);
//     }
//   }, [sysUserId]);  // 確保 useCallback 僅在 sysUserId 改變時更新



//   useEffect(() => {
//     // 確保在 sysUserId 改變時調用 fetchData
//     if (sysUserId) {
//       fetchData();
//     }
//   }, [sysUserId, fetchData]); // 將 fetchData 添加到依賴數組中
  


//   // useEffect(() => {
//   //   // 從後端獲取數據
//   //   const fetchData = async () => {
//   //     try {
//   //       console.log("Fetching data for sysUserId:", sysUserId);
  
//   //       // 通過 sysUserId 請求數據
//   //       const response = await axios.get(`/api/emotionAnalyses/user/${sysUserId}`);
//   //       console.log("【測試中】Received response:", response);  // 新增這行

  
//   //       // 獲取後端返回的數據
//   //       const data = response.data;
  
//   //       if (!data || data.length === 0) {
//   //         console.warn("No data returned from the server for sysUserId:", sysUserId); // 新增警告
//   //       }
//   //       // 打印數據以便進行調試
//   //       console.log("Data fetched:", data);
  
//   //       // 確保前端數據結構的完整性，並更新狀態
//   //       setLabels(data.labels || []);                 // 確保 labels 為數組
//   //       setIntrospection(data.introspection || []);   // 確保 introspection 為數組
//   //       setTemper(data.temper || []);                 // 確保 temper 為數組
//   //       setAttitude(data.attitude || []);             // 確保 attitude 為數組
//   //       setSensitivity(data.sensitivity || []);       // 確保 sensitivity 為數組
//   //       setBarLabels(data.barLabels || []);           // 確保 barLabels 為數組
//   //       setBarData(data.barData || []);               // 確保 barData 為數組
//   //       setWordList(data.wordList || []);             // 確保 wordList 為數組
  
//   //     } catch (error) {
//   //       console.error("【Error fetching emotion analysis data:", error);
//   //     }
//   //   };
  
//   //   // 如果 sysUserId 存在，則執行數據獲取
//   //   if (sysUserId) {
//   //     fetchData();
//   //   }
  
//   // }, [sysUserId]); // 當 sysUserId 改變時重新執行 useEffect
  





//   // useEffect(() => {
//   //   // 從後端獲取數據
//   //   const fetchData = async () => {
//   //     try {
//   //       console.log("Fetching data for sysUserId:", sysUserId);
//   //       // const response = await axios.get(`/api/emotionAnalyses`, {
//   //       //   params: { sysUserId } // 傳遞 sysUserId 作為查詢參數
//   //       // });
//   //       const response = await axios.get(`/api/emotionAnalyses/user/${sysUserId}`);

//   //       const data = response.data;

//   //       console.log("Data fetched:", data);
//   //       setLabels(data.labels || []);
//   //       setIntrospection(data.introspection || []);
//   //       setTemper(data.temper || []);
//   //       setAttitude(data.attitude || []);
//   //       setSensitivity(data.sensitivity || []);
//   //       setBarLabels(data.barLabels || []);
//   //       setBarData(data.barData || []);
//   //       setWordList(data.wordList || []);
        
//   //     } catch (error) {
//   //       console.error("Error fetching emotion analysis data:", error);
//   //     }
//   //   };

//   //   fetchData();
//   // }, [sysUserId]);

//   return (
//     <div>
//       <h2>這是情緒分析結果頁面</h2>
//       <p>使用者ID: {sysUserId}</p>

//       <h3>情緒分析折線圖</h3>
//       <EmotionLineChart labels={labels} introspection={introspection} temper={temper} attitude={attitude} sensitivity={sensitivity} />

//       <h3>標籤數量長條圖</h3>
//       <EmotionBarChart barLabels={barLabels} barData={barData} />

//       <h3>文字雲</h3>
//       <WordCloudComponent wordList={wordList} />
//     </div>
//   );
// }

// export default EmotionAnalysis;





// import React, { useEffect, useState } from 'react';
// import EmotionLineChart from '../../components/homepage/EmotionLineChart';
// import EmotionBarChart from '../../components/homepage/EmotionBarChart';
// import WordCloudComponent from '../../components/homepage/WordCloudComponent';
// import axios from 'axios';

// function EmotionAnalysis({ userId ,sysUserId}) {
//   const [labels, setLabels] = useState([]);
//   const [introspection, setIntrospection] = useState([]);
//   const [temper, setTemper] = useState([]);
//   const [attitude, setAttitude] = useState([]);
//   const [sensitivity, setSensitivity] = useState([]);
//   const [barLabels, setBarLabels] = useState([]);
//   const [barData, setBarData] = useState([]);
//   const [wordList, setWordList] = useState([]);

//   useEffect(() => {
//     // 模擬後端數據獲取
//     const fetchData = async () => {
//       try {
//         console.log("Fetching data for sysUserId:", sysUserId);
//         const response = await axios.get(`/api/emotionAnalysis/${sysUserId}`);  // 獲取情緒數據的API路徑
//         const data = response.data;

//         console.log("Data fetched:", data);  // 確認獲取的數據
//         setLabels(data.labels);
//         setIntrospection(data.introspection);
//         setTemper(data.temper);
//         setAttitude(data.attitude);
//         setSensitivity(data.sensitivity);
//         setBarLabels(data.barLabels);
//         setBarData(data.barData);
//         setWordList(data.wordList);  // 例如：[['word1', 10], ['word2', 5]]

//         console.log("Labels:", data.labels);
//         console.log("Introspection data:", data.introspection);
//         console.log("Word list:", data.wordList);
//       } catch (error) {
//         console.error("Error fetching emotion analysis data:", error);
//       }
//     };

//     fetchData();
//   }, [sysUserId]);

//   return (
//     <div>
//       <h2>這是情緒分析結果頁面</h2>
//       <p>使用者ID: {sysUserId}</p>

//       <h3>情緒分析折線圖</h3>
//       <EmotionLineChart labels={labels} introspection={introspection} temper={temper} attitude={attitude} sensitivity={sensitivity} />

//       <h3>標籤數量長條圖</h3>
//       <EmotionBarChart barLabels={barLabels} barData={barData} />

//       <h3>文字雲</h3>
//       <WordCloudComponent wordList={wordList} />
//     </div>
//   );
// }

// export default EmotionAnalysis;






// import React, { useEffect, useState } from 'react';
// import EmotionLineChart from '../../components/homepage/EmotionLineChart';
// import EmotionBarChart from '../../components/homepage/EmotionBarChart';
// import WordCloudComponent from '../../components/homepage/WordCloudComponent';
// import axios from 'axios';

// function EmotionAnalysis({ sysUserId }) {
//   const [labels, setLabels] = useState([]);
//   const [introspection, setIntrospection] = useState([]);
//   const [temper, setTemper] = useState([]);
//   const [attitude, setAttitude] = useState([]);
//   const [sensitivity, setSensitivity] = useState([]);
//   const [barLabels, setBarLabels] = useState([]);
//   const [barData, setBarData] = useState([]);
//   const [wordList, setWordList] = useState([]);

//   useEffect(() => {
//     // 模擬後端數據獲取
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`/api/emotionAnalysis/${sysUserId}`);  // 獲取情緒數據的API路徑
//         const data = response.data;
        
//         // 假設後端返回的是類似的數據結構
//         setLabels(data.labels);
//         setIntrospection(data.introspection);
//         setTemper(data.temper);
//         setAttitude(data.attitude);
//         setSensitivity(data.sensitivity);
//         setBarLabels(data.barLabels);
//         setBarData(data.barData);
//         setWordList(data.wordList);  // 例如：[['word1', 10], ['word2', 5]]
//       } catch (error) {
//         console.error("Error fetching emotion analysis data:", error);
//       }
//     };

//     fetchData();
//   }, [sysUserId]);

//   return (
//     <div>
//       <h2>這是情緒分析結果頁面</h2>
//       <p>使用者ID: {sysUserId}</p>

//       <h3>情緒分析折線圖</h3>
//       <EmotionLineChart labels={labels} introspection={introspection} temper={temper} attitude={attitude} sensitivity={sensitivity} />

//       <h3>標籤數量長條圖</h3>
//       <EmotionBarChart barLabels={barLabels} barData={barData} />

//       <h3>文字雲</h3>
//       <WordCloudComponent wordList={wordList} />
//     </div>
//   );
// }

// export default EmotionAnalysis;


// import React from 'react';

// function EmotionAnalysis({ sysUserId }) {  // 接收 props 中的 sysUserId
//   return (
//     <div>
//       <h2>這是情緒分析結果頁面</h2>
//       <p>使用者ID: {sysUserId}</p>  {/* 用 <p> 標籤顯示 sysUserId */}
//     </div>
//   );
// }

// export default EmotionAnalysis;

