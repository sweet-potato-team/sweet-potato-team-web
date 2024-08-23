import React, { useState } from 'react';

function Step1({ nextStep, setRentalData, spaceName }) {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startSlot, setStartSlot] = useState(null);

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - startDate.getDay() + currentWeek * 7);

  const times = [
    '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
    '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00',
    '20:00-21:00', '21:00-22:00'
  ];

  const handleSlotMouseDown = (dayIndex, timeIndex) => {
    if (isSlotDisabled(dayIndex, timeIndex)) return;
    setIsSelecting(true);
    setStartSlot({ dayIndex, timeIndex });
    const selectedSlot = `${dayIndex}-${timeIndex}`;
    setSelectedSlots([selectedSlot]);
  };

  const handleSlotMouseOver = (dayIndex, timeIndex) => {
    if (!isSelecting || !startSlot || startSlot.dayIndex !== dayIndex || isSlotDisabled(dayIndex, timeIndex)) return;
    const selectedSlot = `${dayIndex}-${timeIndex}`;
    if (!selectedSlots.includes(selectedSlot)) {
      const newSlots = generateSlots(startSlot.timeIndex, timeIndex, dayIndex);
      setSelectedSlots(newSlots);
    }
  };

  const handleSlotMouseUp = () => {
    setIsSelecting(false);
    setStartSlot(null);
  };

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

  const isSlotDisabled = (dayIndex, timeIndex) => {
    const slotDate = new Date(startDate);
    slotDate.setDate(slotDate.getDate() + dayIndex);
    const [startHour] = times[timeIndex].split('-')[0].split(':');
    slotDate.setHours(startHour);

    return slotDate < today;
  };

  const handleConfirm = () => {
    let startDateTime = null;
    let endDateTime = null;
  
    selectedSlots.forEach((selectedSlot, index) => {
      const [dayIndex, timeIndex] = selectedSlot.split('-').map(Number);
      const slotDate = new Date(startDate);
      slotDate.setUTCDate(slotDate.getUTCDate() + dayIndex);
  
      const [startHour, startMinute] = times[timeIndex].split('-')[0].split(':');
      const [endHour, endMinute] = times[timeIndex].split('-')[1].split(':');
  
      if (index === 0) {
        slotDate.setUTCHours(startHour, startMinute, 0);
        startDateTime = new Date(slotDate);
      }
  
      if (index === selectedSlots.length - 1) {
        slotDate.setUTCHours(endHour, endMinute, 0);
        endDateTime = new Date(slotDate);
      }
    });
  
    const formattedStartDateTime = startDateTime.toISOString().slice(0, 16); // 格式化為 "yyyy-MM-dd'T'HH:mm"
    const formattedEndDateTime = endDateTime.toISOString().slice(0, 16); // 格式化為 "yyyy-MM-dd'T'HH:mm"
  
    setRentalData((prevData) => ({
      ...prevData,
      spaceRentalDateStart: formattedStartDateTime,
      spaceRentalDateEnd: formattedEndDateTime,
      freeSpaceName: spaceName,
    }));
  
    nextStep();
  };

  const handleWeekChange = (direction) => {
    setCurrentWeek(currentWeek + direction);
    setSelectedSlots([]);
  };

  const handleJumpToCurrentWeek = () => {
    setCurrentWeek(0);
    setSelectedSlots([]);
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)', userSelect: 'none', maxWidth: '900px', margin: 'auto', position: 'relative' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#495057', textAlign: 'center' }}>選擇時間</h2>
      
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
                const selectedSlot = `${dayIndex}-${timeIndex}`;
                const isSelected = selectedSlots.includes(selectedSlot);
                const isDisabled = isSlotDisabled(dayIndex, timeIndex);
                return (
                  <td
                    key={selectedSlot}
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
