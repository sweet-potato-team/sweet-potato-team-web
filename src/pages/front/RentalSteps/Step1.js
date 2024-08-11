import React, { useState } from 'react';

function Step1({ nextStep, setRentalData, spaceName }) {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - startDate.getDay() + currentWeek * 7); // 計算當前顯示的周

  const times = [
    '08:00-08:50', '09:00-09:50', '10:00-10:50', '11:00-11:50',
    '12:00-12:50', '13:00-13:50', '14:00-14:50', '15:00-15:50',
    '16:00-16:50', '17:00-17:50', '18:00-18:50', '19:00-19:50',
    '20:00-20:50', '21:00-21:50'
  ];

  const handleSlotMouseDown = (dayIndex, timeIndex) => {
    setIsSelecting(true);
    const selectedSlot = `${dayIndex}-${timeIndex}`;
    setSelectedSlots([selectedSlot]);
  };

  const handleSlotMouseOver = (dayIndex, timeIndex) => {
    if (!isSelecting) return;
    const selectedSlot = `${dayIndex}-${timeIndex}`;
    if (selectedSlots[selectedSlots.length - 1] !== selectedSlot) {
      setSelectedSlots([...selectedSlots, selectedSlot]);
    }
  };

  const handleSlotMouseUp = () => {
    setIsSelecting(false);
  };

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

  const handleWeekChange = (direction) => {
    setCurrentWeek(currentWeek + direction);
    setSelectedSlots([]); // 切換周時清空選擇
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#343a40' }}>選擇時間</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
        <thead>
          <tr>
            <th></th>
            {daysOfWeek.map((day, index) => {
              const date = new Date(startDate);
              date.setDate(date.getDate() + index);
              return (
                <th key={day} style={{ padding: '10px', backgroundColor: '#f1f1f1', border: '1px solid #ccc', textAlign: 'center' }}>
                  {day} ({date.getMonth() + 1}/{date.getDate()})
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {times.map((time, timeIndex) => (
            <tr key={time}>
              <td style={{ padding: '10px', backgroundColor: '#f1f1f1', border: '1px solid #ccc', textAlign: 'center' }}>{time}</td>
              {daysOfWeek.map((day, dayIndex) => {
                const slot = `${dayIndex}-${timeIndex}`;
                const isSelected = selectedSlots.includes(slot);
                return (
                  <td
                    key={slot}
                    style={{
                      padding: '10px',
                      border: '1px solid #ccc',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#007bff' : '#fff',
                      color: isSelected ? '#fff' : '#000'
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
        <button onClick={() => handleWeekChange(-1)} style={{ minWidth: '120px', padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: '5px', cursor: 'pointer', backgroundColor: '#6c757d', color: '#fff' }}>
          上一周
        </button>
        <button onClick={handleConfirm} style={{ minWidth: '120px', padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: '5px', cursor: 'pointer', backgroundColor: '#007bff', color: '#fff' }} disabled={selectedSlots.length === 0}>
          確認時間
        </button>
        <button onClick={() => handleWeekChange(1)} style={{ minWidth: '120px', padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: '5px', cursor: 'pointer', backgroundColor: '#6c757d', color: '#fff' }}>
          下一周
        </button>
      </div>
    </div>
  );
}

export default Step1;
