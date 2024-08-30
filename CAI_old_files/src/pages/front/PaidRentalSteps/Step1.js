import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css';
import { Overlay, Popover } from 'react-bootstrap'; 

function Step1({ nextStep, setRentalData, spaceName, rentalData }) {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startSlot, setStartSlot] = useState(null);
  const [isSecondSelection, setIsSecondSelection] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const target = useRef(null);

  useEffect(() => {
    if (rentalData.paidSpaceRentalDateTimeStart1 && rentalData.paidSpaceRentalDateTimeEnd1) {
      setIsSecondSelection(true);
    }
  }, [rentalData]);

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - startDate.getDay() + currentWeek * 7);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const times = [
    '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
    '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00',
    '20:00-21:00', '21:00-22:00'
  ];

  const isPartOfFirstSelection = (dayIndex, timeIndex) => {
    const slotDate = calculateDateTime(startDate, dayIndex, timeIndex);
    const firstSelectionStart = new Date(rentalData.paidSpaceRentalDateTimeStart1);
    const firstSelectionEnd = new Date(rentalData.paidSpaceRentalDateTimeEnd1);
    
    return slotDate >= firstSelectionStart && slotDate < firstSelectionEnd; 
  };

  const handleSlotMouseDown = (dayIndex, timeIndex) => {
    if (isSlotDisabled(dayIndex, timeIndex)) return;
    setIsSelecting(true);
    setStartSlot({ dayIndex, timeIndex });
    const selectedSlot = `${dayIndex}-${timeIndex}`;
    setSelectedSlots([selectedSlot]);
  };

  const handleSlotMouseOver = (dayIndex, timeIndex) => {
    if (!isSelecting || !startSlot || startSlot.dayIndex !== dayIndex || isSlotDisabled(dayIndex, timeIndex)) return;

    if (isPartOfFirstSelection(dayIndex, timeIndex)) return; 

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
      if (!isSlotDisabled(dayIndex, i) && !isPartOfFirstSelection(dayIndex, i)) {
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

    if (rentalData.paidSpaceRentalDateTimeStart1 && rentalData.paidSpaceRentalDateTimeEnd1) {
      const firstSelectionStart = new Date(rentalData.paidSpaceRentalDateTimeStart1);
      const firstSelectionEnd = new Date(rentalData.paidSpaceRentalDateTimeEnd1);
      
      // 只禁用已選時間段，不禁用其後的時段
      if (slotDate >= firstSelectionStart && slotDate < firstSelectionEnd) {
        return true;
      }
    }

    return slotDate < today;
  };

  const handleConfirm = () => {
    if (!isSecondSelection) {
      if (selectedSlots.length === 0) {
        alert('請選擇至少一個時間段');
        return;
      }

      const sortedSlots = selectedSlots.sort((a, b) => {
        const [dayA, timeA] = a.split('-').map(Number);
        const [dayB, timeB] = b.split('-').map(Number);
        if (dayA === dayB) {
          return timeA - timeB;
        }
        return dayA - dayB;
      });

      const firstSlot = sortedSlots[0];
      const lastSlot = sortedSlots[sortedSlots.length - 1];

      const [dayIndex1, timeIndex1] = firstSlot.split('-').map(Number);
      const [dayIndex2, timeIndex2] = lastSlot.split('-').map(Number);

      const startDateTime1 = calculateDateTime(startDate, dayIndex1, timeIndex1);
      const endDateTime1 = calculateDateTime(startDate, dayIndex2, timeIndex2, true);

      const formattedStartDateTime1 = formatDateTime(startDateTime1);
      const formattedEndDateTime1 = formatDateTime(endDateTime1);

      setRentalData((prevData) => ({
        ...prevData,
        paidSpaceRentalDateTimeStart1: formattedStartDateTime1,
        paidSpaceRentalDateTimeEnd1: formattedEndDateTime1,
        paidSpaceName: spaceName,
      }));

      const userWantsAnotherSlot = window.confirm('是否要選擇另一個租借時間段？');
      if (userWantsAnotherSlot) {
        setIsSecondSelection(true);
        setSelectedSlots([]);
      } else {
        nextStep();
      }
    } else {
      if (selectedSlots.length === 0) {
        alert('請選擇至少一個時間段');
        return;
      }

      const sortedSlots = selectedSlots.sort((a, b) => {
        const [dayA, timeA] = a.split('-').map(Number);
        const [dayB, timeB] = b.split('-').map(Number);
        if (dayA === dayB) {
          return timeA - timeB;
        }
        return dayA - dayB;
      });

      const firstSlot = sortedSlots[0];
      const lastSlot = sortedSlots[sortedSlots.length - 1];

      const [dayIndex1, timeIndex1] = firstSlot.split('-').map(Number);
      const [dayIndex2, timeIndex2] = lastSlot.split('-').map(Number);

      const startDateTime2 = calculateDateTime(startDate, dayIndex1, timeIndex1);
      const endDateTime2 = calculateDateTime(startDate, dayIndex2, timeIndex2, true);

      const formattedStartDateTime2 = formatDateTime(startDateTime2);
      const formattedEndDateTime2 = formatDateTime(endDateTime2);

      setRentalData((prevData) => ({
        ...prevData,
        paidSpaceRentalDateTimeStart2: formattedStartDateTime2,
        paidSpaceRentalDateTimeEnd2: formattedEndDateTime2,
      }));
      nextStep();
    }
  };

  const calculateDateTime = (baseDate, dayOffset, timeIndex, isEndTime = false) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + dayOffset);

    const [startTime, endTime] = times[timeIndex].split('-');
    const time = isEndTime ? endTime : startTime;
    const [hour, minute] = time.split(':').map(Number);

    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(0);
    date.setMilliseconds(0);

    if (isEndTime && hour === 22 && minute === 0) {
      date.setHours(22);
      date.setMinutes(0);
      date.setSeconds(0);
    }

    return date;
  };

  const formatDateTime = (date) => {
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date - timezoneOffset).toISOString().slice(0, 19).replace('T', ' ');
    return localISOTime;
  };

  const handleWeekChange = (direction) => {
    setCurrentWeek(currentWeek + direction);
    setSelectedSlots([]);
  };

  const handleJumpToCurrentWeek = () => {
    setCurrentWeek(0);
    setSelectedSlots([]);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setCurrentWeek(Math.floor((date - today) / (7 * 24 * 60 * 60 * 1000)));
    setShowDatePicker(false);
    setSelectedSlots([]);
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)', userSelect: 'none', maxWidth: '900px', margin: 'auto', position: 'relative' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#495057', textAlign: 'center' }}>選擇時間</h2>

      <button onClick={handleJumpToCurrentWeek} style={{ position: 'absolute', top: '20px', right: '20px', padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#28a745', color: '#fff', border: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        回到本周
      </button>

      <div
        ref={target}
        onClick={() => setShowDatePicker(!showDatePicker)}
        style={{
          textAlign: 'center',
          margin: '1rem auto',
          cursor: 'pointer',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          display: 'block',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          fontSize:'larger'
        }}
      >
        {`${startDate.getFullYear()}年${startDate.getMonth() + 1}月${startDate.getDate()}日 - ${endDate.getFullYear()}年${endDate.getMonth() + 1}月${endDate.getDate()}日`}
      </div>

      <Overlay target={target.current} show={showDatePicker} placement="bottom">
        <Popover id="popover-basic">
          <Popover.Body>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              inline
              dateFormat="yyyy年MM月dd日"
              calendarStartDay={1}
            />
          </Popover.Body>
        </Popover>
      </Overlay>

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
                const isPartOfFirstSelectionFlag = isPartOfFirstSelection(dayIndex, timeIndex);
                
                return (
                  <td
                    key={selectedSlot}
                    style={{
                      padding: '12px',
                      border: '1px solid #dee2e6',
                      textAlign: 'center',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      backgroundColor: isPartOfFirstSelectionFlag ? 'rgb(211, 233, 255)' : isSelected ? '#007bff' : isDisabled ? '#e9ecef' : '#ffffff',
                      color: isSelected ? '#ffffff' : isDisabled ? '#adb5bd' : '#495057',
                      borderRadius: isSelected ? '4px' : '0',
                      transition: 'background-color 0.3s, color 0.3s'
                    }}
                    onMouseDown={() => handleSlotMouseDown(dayIndex, timeIndex)}
                    onMouseOver={() => handleSlotMouseOver(dayIndex, timeIndex)}
                    onMouseUp={handleSlotMouseUp}
                  >
                    {isSelected ? '選擇中' : isPartOfFirstSelectionFlag ? '已選時間' : ''}
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