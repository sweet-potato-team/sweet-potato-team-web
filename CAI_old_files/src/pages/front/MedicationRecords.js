import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../MedicationRecords.css'; // 引入 CSS

function MedicationRecords({ userId, sysUserId, startDate, endDate }) {
  const [alertRecords, setAlertRecords] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);  // 新增狀態以儲存錯誤訊息

  useEffect(() => {
    const fetchAlertRecords = async () => {
      try {
        const params = { startDate, endDate };
        console.log(`Fetching records for sysUserId: ${sysUserId}, startDate: ${startDate}, endDate: ${endDate}`);

        const response = await axios.get(`http://localhost:8080/api/alertRecords/user/${sysUserId}`, { params });
        console.log("API response:", response.data); // 打印整個回應，檢查 drugSideEffect 是否存在

        const records = response.data.map(record => {
          // 格式化日期為 "YYYY-MM-DD"
          const formattedDate = new Date(record.recordAlertDate).toISOString().split('T')[0];

          console.log(`【副作用】: ${record.drugSideEffect}`); // 打印副作用
          return {
            ...record,
            recordAlertDate: formattedDate, // 更新格式化後的日期
          };
        });

        setAlertRecords(records);
        setErrorMessage(null);  // 清除錯誤訊息
      } catch (error) {
        console.error('Error fetching alert records:', error);
        if (error.response && error.response.status === 404) {
          setErrorMessage("目前沒有任何資訊");
        } else {
          setErrorMessage("無法取得資料，請稍後再試");
        }
      }
    };

    if (startDate && endDate) {
      fetchAlertRecords();
    }
  }, [sysUserId, startDate, endDate]);

  // 使用圖示替代文字
  const getRecordStateIcon = (state) => {
    switch (state) {
      case 1: return <i className="bi bi-clipboard-check-fill" title="按時吃" style={{ color: '#EDBD82' }}></i>;
      case 2: return <i className="bi bi-clipboard-minus-fill" title="提醒後吃" style={{ color: '#7FAAC7' }}></i>;
      case 3: return <i className="bi bi-emoji-frown-fill" title="沒吃藥" style={{ color: '#2C4D63' }}></i>;
      default: return <i className="bi bi-exclamation-diamond-fill" title="未知" style={{ color: '#574938' }}></i>;
    }
  };

  return (
    <div className="scroll-container">
      {errorMessage ? (
        <div className="empty-message">
          <h3>{errorMessage}</h3>
        </div>
      ) : (
        <>
          {/* 在表格上方添加說明 */}
          <div className="icon-legend">
            <p>
              <span><i className="bi bi-clipboard-check-fill" style={{ color: '#EDBD82' }}></i>  -- 按時吃</span>
              <span><i className="bi bi-clipboard-minus-fill" style={{ color: '#7FAAC7' }}></i>  -- 提醒後吃</span>
              <span><i className="bi bi-emoji-frown-fill" style={{ color: '#2C4D63' }}></i>  -- 沒吃藥</span>
              <span><i className="bi bi-exclamation-diamond-fill" style={{ color: '#574938' }}></i>  -- 未知</span>
            </p>
          </div>
          <table className="styled-table">
            <thead>
              <tr>
                <th>藥袋ID</th>
                <th>提醒日期</th>
                <th>提醒狀態 1</th>
                <th>提醒狀態 2</th>
                <th>提醒狀態 3</th>
                <th>藥品副作用</th>
              </tr>
            </thead>
            <tbody>
              {alertRecords.map((record, index) => (
                <tr key={index} className="table-row">
                  <td>{record.drugBagId}</td>
                  <td>{record.recordAlertDate}</td>
                  <td>{getRecordStateIcon(record.recordState1)}</td>
                  <td>{getRecordStateIcon(record.recordState2)}</td>
                  <td>{getRecordStateIcon(record.recordState3)}</td>
                  <td>{record.drugSideEffect || '----'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default MedicationRecords;
