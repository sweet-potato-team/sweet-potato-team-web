import React, { useState } from 'react';

function Step1({ nextStep, setRentalData, spaceName }) {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startSlot, setStartSlot] = useState(null);

  // 定義一週的天數
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - startDate.getDay() + currentWeek * 7); // 計算當前顯示的週

  // 定義可選擇的時間段
  const times = [
    '08:00-08:50', '09:00-09:50', '10:00-10:50', '11:00-11:50',
    '12:00-12:50', '13:00-13:50', '14:00-14:50', '15:00-15:50',
    '16:00-16:50', '17:00-17:50', '18:00-18:50', '19:00-19:50',
    '20:00-20:50', '21:00-21:50'
  ];

  // 當使用者按下滑鼠開始選擇時間段
  const handleSlotMouseDown = (dayIndex, timeIndex) => {
    setIsSelecting(true);
    setStartSlot({ dayIndex, timeIndex });
    const selectedSlot = `${dayIndex}-${timeIndex}`;
    setSelectedSlots([selectedSlot]);
  };

  // 當使用者拖動滑鼠來選擇時間段
  const handleSlotMouseOver = (dayIndex, timeIndex) => {
    if (!isSelecting || !startSlot || startSlot.dayIndex !== dayIndex) return; // 禁止跨天選擇
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
      newSlots.push(`${dayIndex}-${i}`);
    }
    return newSlots;
  };

  // 確認選擇的時間並進行下一步
  const handleConfirm = () => {
    const selectedDates = selectedSlots.map(slot => {
      const [dayIndex, timeIndex] = slot.split('-').map(Number);
      const date = new Date(startDate);
      date.setDate(date.getDate() + dayIndex);
      return `${daysOfWeek[dayIndex]} (${date.getMonth() + 1}/${date.getDate()}) ${times[timeIndex]}`;
    });

    setRentalData(prevData => ({
      ...prevData,
      dateTime: selectedDates.join(', '),
      location: spaceName  // 將選擇的空間名稱存入租借數據
    }));
    nextStep();
  };

  // 切換顯示的週
  const handleWeekChange = (direction) => {
    setCurrentWeek(currentWeek + direction);
    setSelectedSlots([]); // 切換周時清空選擇
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)', userSelect: 'none', maxWidth: '900px', margin: 'auto' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#495057', textAlign: 'center' }}>選擇時間</h2>
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
                return (
                  <td
                    key={slot}
                    style={{
                      padding: '12px',
                      border: '1px solid #dee2e6',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#007bff' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#495057',
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
