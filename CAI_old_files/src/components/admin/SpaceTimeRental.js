import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

function SpaceTimeRental({ nextStep, setRentalData, spaceName, spaceId }) {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [timeSlots, setTimeSlots] = useState({});

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const startDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + currentWeek * 7);
    date.setHours(0, 0, 0, 0); // 將時間設為00:00:00以便比較日期
    return date;
  }, [currentWeek]);

  const endDate = useMemo(() => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + 6);
    date.setHours(23, 59, 59, 999); // 設定到當周的結束
    return date;
  }, [startDate]);

  const times = useMemo(() => [
    '08:00-08:30', '08:30-09:00', '09:00-09:30', '09:30-10:00',
    '10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-12:00',
    '12:00-12:30', '12:30-13:00', '13:00-13:30', '13:30-14:00',
    '14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00',
    '16:00-16:30', '16:30-17:00', '17:00-17:30', '17:30-18:00'
  ], []);

  useEffect(() => {
    console.log('Space ID:', spaceId);
    console.log('Current Week Start Date:', startDate);
    console.log('Current Week End Date:', endDate);

    const fetchTimeSlots = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/manage_free_times/free_space/${spaceId}`);
        console.log('Full response data:', response.data); // 打印完整的返回數據

        const records = response.data.results || response.data; // 如果沒有 results 字段，直接使用 data

        console.log('Fetched records:', records);

        if (!Array.isArray(records)) {
          console.error('Unexpected format:', records);
          return;
        }

        const newTimeSlots = {};

        records.forEach(record => {
          const start = new Date(record.startTime);
          const end = new Date(record.endTime);

          console.log(`Processing record from ${start} to ${end}`);

          // 檢查這筆記錄是否在當前周範圍內
          if (start >= startDate && start <= endDate) {
            const dayIndex = (start.getDay() - startDate.getDay() + 7) % 7;

            const startHour = start.getHours();
            const startMinute = start.getMinutes();
            const endHour = end.getHours();
            const endMinute = end.getMinutes();

            const startTimeIndex = times.findIndex(time => time.startsWith(`${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`));
            const endTimeIndex = times.findIndex(time => time.startsWith(`${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`));

            console.log(`Day index: ${dayIndex}, Start time index: ${startTimeIndex}, End time index: ${endTimeIndex}`);
            console.log(`Date Range: ${start} to ${end}, Day Index: ${dayIndex}, Start Time Index: ${startTimeIndex}, End Time Index: ${endTimeIndex}`);

            for (let i = startTimeIndex; i <= endTimeIndex; i++) {
              const slotKey = `${dayIndex}-${i}`;
              newTimeSlots[slotKey] = {
                status: record.manageStatus,
                unitName: record.spaceRentalUnit || 'N/A',
              };
            }
          } else {
            console.log(`Skipping record outside current week: ${start}`);
          }
        });

        console.log('New time slots:', newTimeSlots);

        setTimeSlots(newTimeSlots);
      } catch (error) {
        console.error('Error fetching time slots:', error);
      }
    };

    if (spaceId) {
      fetchTimeSlots();
    } else {
      console.error('spaceId is undefined');
    }
  }, [spaceId, currentWeek, times, startDate, endDate]);

  const handleWeekChange = (direction) => {
    setCurrentWeek(currentWeek + direction);
  };

  const handleJumpToCurrentWeek = () => {
    setCurrentWeek(0);
  };

  const getSlotStyle = (status) => {
    switch (status) {
      case 'wait':
        return { backgroundColor: '#FDEED8', color: '#000000' }; // 橘色
      case 'accept':
        return { backgroundColor: '#FACE90', color: '#000000' }; // 綠色
      case 'admin_blocked':
        return { backgroundColor: '#C6C4BB', color: '#000000' }; // 紅色
      default:
        return { backgroundColor: '#ffffff', color: '#495057' };
    }
  };
  


  return (
    <div style={{ padding: '2rem', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)', userSelect: 'none', maxWidth: '100%', margin: 'auto', position: 'relative' }}>
        {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <button 
                type='button' 
                className='btn me-2' 
                style={{ 
                    color: 'white', 
                    padding: '10px 20px',  // 增加按鈕大小
                    
                    backgroundColor: '#6096ba', 
                    borderRadius: '5px',
                    fontSize: '16px' // 調整字體大小
                }} 
                onMouseEnter={(e) => handleMouseEnter(e, '#6096ba')} 
                onMouseLeave={handleMouseLeave} 
                onClick={() => handleWeekChange(-1)}
            >
                <i className="bi bi-arrow-left-circle-fill" style={{ marginRight: '8px' }}></i> 上周
            </button>
            <button 
                type='button' 
                className='btn me-2' 
                style={{ 
                    color: 'white', 
                    padding: '10px 20px',  // 增加按鈕大小
                    backgroundColor: '#FACE90', 
                    borderRadius: '5px',
                    fontSize: '16px' // 調整字體大小
                }} 
                onMouseEnter={(e) => handleMouseEnter(e, '#FACE90')} 
                onMouseLeave={handleMouseLeave} 
                onClick={handleJumpToCurrentWeek}
            >
                回到本周
            </button>
            <button 
                type='button' 
                className='btn me-2' 
                style={{ 
                    color: 'white', 
                    padding: '10px 20px',  // 增加按鈕大小
                    
                    backgroundColor: '#6096ba', 
                    borderRadius: '5px',
                    fontSize: '16px' // 調整字體大小
                }} 
                onMouseEnter={(e) => handleMouseEnter(e, '#6096ba')} 
                onMouseLeave={handleMouseLeave} 
                onClick={() => handleWeekChange(1)}
            >
                下周 <i className="bi bi-arrow-right-circle-fill" style={{ marginLeft: '8px' }}></i>
            </button>
        </div> */}
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
    <button 
        type='button' 
        className='btn me-2' 
        style={{ 
            color: 'white', 
            padding: '10px 20px',  // 增加按鈕大小
            backgroundColor: '#6096ba', 
            borderRadius: '5px',
            fontSize: '16px' // 調整字體大小
        }} 

        onClick={() => handleWeekChange(-1)}
    >
        <i className="bi bi-arrow-left-circle-fill" style={{ marginRight: '8px' }}></i> 上周
    </button>
    <button 
        type='button' 
        className='btn me-2' 
        style={{ 
            color: 'white', 
            padding: '10px 20px',  // 增加按鈕大小
            backgroundColor: '#6096ba', 
            borderRadius: '5px',
            fontSize: '16px' // 調整字體大小
        }} 

        onClick={handleJumpToCurrentWeek}
    >
        回到本周
    </button>
    <button 
        type='button' 
        className='btn me-2' 
        style={{ 
            color: 'white', 
            padding: '10px 20px',  // 增加按鈕大小
            backgroundColor: '#6096ba', 
            borderRadius: '5px',
            fontSize: '16px' // 調整字體大小
        }} 

        onClick={() => handleWeekChange(1)}
    >
        下周 <i className="bi bi-arrow-right-circle-fill" style={{ marginLeft: '8px' }}></i>
    </button>
</div>


      {/* <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#495057', textAlign: 'center' }}>{`選擇時間 - ${spaceName}`}</h2> */}
      
      <div style={{ marginBottom: '1rem',  justifyContent: 'space-between', fontSize: '18px', color: '#000000', display: 'flex', alignItems: 'center' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '20px' }}>
          <i className="bi bi-check-circle-fill" style={{ color: '#FACE90', marginRight: '8px' }}></i>通過審核
        </span>
        
        <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '20px' }}>
          <i className="bi bi-dash-circle-fill" style={{ color: '#FDEED8', marginRight: '8px' }}></i>等待審核
        </span>

        <span style={{ display: 'inline-flex', alignItems: 'center' , marginRight: '20px'}}>
          <i className="bi bi-wrench-adjustable-circle-fill" style={{ color: '#C6C4BB', marginRight: '8px' }}></i>無法租借
        </span>
      </div>



<table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', tableLayout: 'fixed', fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
  <thead>
    <tr>
      <th style={{ padding: '12px', backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6', textAlign: 'center', color: '#6c757d', fontWeight: '600', minWidth: '150px' }}>時間</th>
      {daysOfWeek.map((day, index) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + index);
        return (
          <th key={day} style={{ padding: '12px', backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6', textAlign: 'center', color: '#6c757d', fontWeight: '600', whiteSpace: 'nowrap', minWidth: '150px' }}>
            {day} <br /> ({date.getMonth() + 1}/{date.getDate()})
          </th>
        );
      })}
    </tr>
  </thead>
  <tbody>
    {times.map((time, timeIndex) => (
      <tr key={time}>
        <td style={{ padding: '12px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6', textAlign: 'center', color: '#6c757d', fontWeight: '500', minWidth: '150px' }}>{time}</td>
        {daysOfWeek.map((day, dayIndex) => {
          const slotKey = `${dayIndex}-${timeIndex}`;
          const slot = timeSlots[slotKey];
          return (
            <td
              key={slotKey}
              style={{
                padding: '12px',
                border: '1px solid #dee2e6',
                textAlign: 'center',
                ...getSlotStyle(slot?.status),
                borderRadius: '4px',
                transition: 'background-color 0.3s, color 0.3s',
                minWidth: '150px'  // 修改這裡來增加欄位寬度
              }}
            >
{slot ? slot.unitName : ''}

            </td>
          );
        })}
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}

export default SpaceTimeRental;