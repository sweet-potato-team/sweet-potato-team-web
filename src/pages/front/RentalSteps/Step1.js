import React, { useState } from 'react';

function Step1({ nextStep, setRentalData, spaceName }) {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startSlot, setStartSlot] = useState(null);

  // 定義一週的天數
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - startDate.getDay() + currentWeek * 7); // 計算當前顯示的週

  // 定義可選擇的時間段
  const times = [
    '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
    '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00',
    '20:00-21:00', '21:00-22:00'
  ];

  // 當使用者按下滑鼠開始選擇時間段
  const handleSlotMouseDown = (dayIndex, timeIndex) => {
    if (isSlotDisabled(dayIndex, timeIndex)) return;
    setIsSelecting(true);
    setStartSlot({ dayIndex, timeIndex });
    const selectedSlot = `${dayIndex}-${timeIndex}`;

    setSelectedSlots([selectedSlot]);
  };

  // 當使用者拖動滑鼠來選擇時間段
  const handleSlotMouseOver = (dayIndex, timeIndex) => {
    if (!isSelecting || !startSlot || startSlot.dayIndex !== dayIndex || isSlotDisabled(dayIndex, timeIndex)) return; // 禁止跨天選擇或選擇禁用的時間格
    const selectedSlot = `${dayIndex}-${timeIndex}`;
    if (!selectedSlots.includes(selectedSlot)) {
      const newSlots = generateSlots(startSlot.timeIndex, timeIndex, dayIndex);
      setSelectedSlots(newSlots);
    }
  };

  // 當使用者釋放滑鼠按鍵後停止選擇
  const handleSlotMouseUp = () => {
    setIsSelecting(false);
    setStartSlot(null);
  };

  // 生成選中的時間段
  const generateSlots = (start, end, dayIndex) => {
    const range = start <= end ? [start, end] : [end, start];
    const newSlots = [];
    for (let i = range[0]; i <= range[1]; i++) {
      if (!isSlotDisabled(dayIndex, i)) {
        newSlots.push(`${dayIndex}-${i}`);
      }
    }
    return newSlots;
  };

  // 判斷時間格是否禁用
  const isSlotDisabled = (dayIndex, timeIndex) => {
    const slotDate = new Date(startDate);
    slotDate.setDate(slotDate.getDate() + dayIndex);
    const [startHour] = times[timeIndex].split('-')[0].split(':');
    slotDate.setHours(startHour);

    return slotDate < today; // 如果時間格早於今天則禁用
  };

  // 確認選擇的時間並進行下一步
  const handleConfirm = () => {
    const selectedDates = [];
    let lastDayIndex = null;
    let lastTimeIndex = null;
    let startSlot = null;
    let totalHours = 0;
  
    selectedSlots.forEach(slot => {
      const [dayIndex, timeIndex] = slot.split('-').map(Number);
      totalHours += 1; // 每選擇一個時間段，累計一個小時
  
      if (lastDayIndex === dayIndex && lastTimeIndex !== null && timeIndex === lastTimeIndex + 1) {
        // 如果是連續時間段，更新最後一個時間段
        lastTimeIndex = timeIndex;
      } else {
        // 如果是新的一天或不連續的時間段，將之前的時間段添加到列表
        if (startSlot) {
          selectedDates.push(formatSlot(startSlot, lastDayIndex, lastTimeIndex));
        }
        startSlot = { dayIndex, timeIndex };
        lastDayIndex = dayIndex;
        lastTimeIndex = timeIndex;
      }
    });
  
    // 添加最後的時間段
    if (startSlot) {
      selectedDates.push(formatSlot(startSlot, lastDayIndex, lastTimeIndex));
    }
  
    setRentalData(prevData => ({
      ...prevData,
      spaceRentalDateTime: selectedDates.join(', '),
      spaceRentalDateTimeCount: totalHours, // 記錄總共選擇了多少小時
      freeSpaceName: spaceName  // 將選擇的空間名稱存入租借數據
    }));
    nextStep();
  };
  


  // 格式化時間段為輸出格式
  const formatSlot = (startSlot, dayIndex, endSlot) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + startSlot.dayIndex);

    const end = new Date(startDate);
    end.setDate(end.getDate() + dayIndex);

    const startTime = times[startSlot.timeIndex].split('-')[0];
    const endTime = times[endSlot].split('-')[1];

    return `${daysOfWeek[dayIndex]} (${end.getMonth() + 1}/${end.getDate()}) ${startTime}-${endTime}`;

  };

  // 切換顯示的週
  const handleWeekChange = (direction) => {
    setCurrentWeek(currentWeek + direction);
    setSelectedSlots([]); // 切換周時清空選擇
  };

  // 跳回到當前的這周
  const handleJumpToCurrentWeek = () => {
    setCurrentWeek(0);
    setSelectedSlots([]); // 回到當前周時清空選擇
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)', userSelect: 'none', maxWidth: '900px', margin: 'auto', position: 'relative' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#495057', textAlign: 'center' }}>選擇時間</h2>
      
      {/* "回到這周" 按鈕放置在右上角 */}
      <button onClick={handleJumpToCurrentWeek} style={{ position: 'absolute', top: '20px', right: '20px', padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#28a745', color: '#fff', border: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        回到本周
      </button>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', tableLayout: 'fixed', fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
        <thead>
          <tr>
            <th style={{ padding: '12px', backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6', textAlign: 'center', color: '#6c757d', fontWeight: '600' }}>時間</th>
            {daysOfWeek.map((day, index) => {
              const date = new Date(startDate);
              date.setDate(date.getDate() + index);
              return (
                <th key={day} style={{ padding: '12px', backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6', textAlign: 'center', color: '#6c757d', fontWeight: '600', whiteSpace: 'nowrap' }}>
                  {day} <br /> ({date.getMonth() + 1}/{date.getDate()})
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {times.map((time, timeIndex) => (
            <tr key={time}>
              <td style={{ padding: '12px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6', textAlign: 'center', color: '#6c757d', fontWeight: '500' }}>{time}</td>
              {daysOfWeek.map((day, dayIndex) => {
                const slot = `${dayIndex}-${timeIndex}`;
                const isSelected = selectedSlots.includes(slot);
                const isDisabled = isSlotDisabled(dayIndex, timeIndex);
                return (
                  <td
                    key={slot}
                    style={{
                      padding: '12px',
                      border: '1px solid #dee2e6',
                      textAlign: 'center',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      backgroundColor: isSelected ? '#007bff' : isDisabled ? '#e9ecef' : '#ffffff',
                      color: isSelected ? '#ffffff' : isDisabled ? '#adb5bd' : '#495057',
                      borderRadius: isSelected ? '4px' : '0',
                      transition: 'background-color 0.3s, color 0.3s'
                    }}
                    onMouseDown={() => handleSlotMouseDown(dayIndex, timeIndex)}
                    onMouseOver={() => handleSlotMouseOver(dayIndex, timeIndex)}
                    onMouseUp={handleSlotMouseUp}
                  >
                    {isSelected ? '選擇中' : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <button onClick={() => handleWeekChange(-1)} style={{ minWidth: '120px', padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#6c757d', color: '#fff', border: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          上一周
        </button>
        <button onClick={handleConfirm} style={{ minWidth: '120px', padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#007bff', color: '#fff', border: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} disabled={selectedSlots.length === 0}>
          確認時間
        </button>
        <button onClick={() => handleWeekChange(1)} style={{ minWidth: '120px', padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#6c757d', color: '#fff', border: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          下一周
        </button>
      </div>
    </div>
  );
}

export default Step1;
