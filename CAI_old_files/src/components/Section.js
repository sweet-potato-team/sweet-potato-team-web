import React, { forwardRef, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Overlay, Popover } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css'; // 確保引入Bootstrap Icons
import '../index.css';

const Section = forwardRef(({ title, backgroundColor, children, onSendClick, showDatePickers = true }, ref) => {
  const [hover, setHover] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const startRef = useRef(null);
  const endRef = useRef(null);
  const dateContainerRef = useRef(null);


  
  const titleStyle = {
    background: "#EFEBE6",
    color: '#574938',
    padding: '10px 20px',
    borderRadius: '50px',
    display: 'inline-block',
    transition: 'transform 0.2s',
    boxShadow: '4px 4px 6px rgba(0,0,0,0.2)',
    marginRight: 'auto',
    cursor: 'pointer',
  };

  const titleHoverStyle = {
    transform: hover ? 'scale(1.1)' : 'none',
  };

  const dateContainerStyle = {
    background: "#EFEBE6",
    padding: '10px 30px',
    borderRadius: '50px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '4px 4px 6px rgba(0,0,0,0.2)',
    cursor: 'pointer',
  };

  const datePickerButtonStyle = {
    background: 'transparent',
    color: '#574938',
    padding: '10px 20px',
    borderRadius: '50px',
    border: '2px solid #B7A58F',
    cursor: 'pointer',
    marginLeft: '10px',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  };

  const formatDate = (date) => date ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}` : '';

  // 發送按鈕的處理函數，通過 props 將選擇的日期範圍傳遞到上層組件
  const handleSendClick = () => {
    onSendClick({
      start: formatDate(startDate),
      end: formatDate(endDate)
    });
  };

  return (
    <div ref={ref} className="section" style={{ minHeight: '500px', backgroundColor, padding: '80px 60px', marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <h2
          style={{ ...titleStyle, ...titleHoverStyle }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {title}
        </h2>

        {showDatePickers && (
          <div ref={dateContainerRef} style={dateContainerStyle}>
            <i className="bi bi-calendar-week" style={{ marginRight: '10px', color: '#574938' }}></i>
            <button
              ref={startRef}
              style={datePickerButtonStyle}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D3C8BB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => setShowStartDatePicker(!showStartDatePicker)}
            >
              {startDate ? formatDate(startDate) : '选择起始日期'}
            </button>
            <span style={{ margin: '0 10px' }}> - </span>
            <button
              ref={endRef}
              style={datePickerButtonStyle}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D3C8BB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => setShowEndDatePicker(!showEndDatePicker)}
            >
              {endDate ? formatDate(endDate) : '选择结束日期'}
            </button>
            <i className="bi bi-send" style={{ marginLeft: '10px', color: '#574938', cursor: 'pointer' }} onClick={handleSendClick}></i>
          </div>
        )}
      </div>

      {showStartDatePicker && showDatePickers && (
        <Overlay target={startRef.current} show={showStartDatePicker} placement="bottom">
          <Popover>
            <Popover.Body>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setShowStartDatePicker(false);
                }}
                inline
                selectsStart
                startDate={startDate}
                endDate={endDate}
                highlightDates={[{ 'react-datepicker__day--highlighted-custom': [startDate, endDate] }]}
                dayClassName={() => 'custom-highlight'}
              />
            </Popover.Body>
          </Popover>
        </Overlay>
      )}

      {showEndDatePicker && showDatePickers && (
        <Overlay target={endRef.current} show={showEndDatePicker} placement="bottom">
          <Popover>
            <Popover.Body>
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  setEndDate(date);
                  setShowEndDatePicker(false);
                }}
                inline
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                highlightDates={[{ 'react-datepicker__day--highlighted-custom': [startDate, endDate] }]}
                dayClassName={() => 'custom-highlight'}
              />
            </Popover.Body>
          </Popover>
        </Overlay>
      )}

<div style={{ width: '100%', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
  {children}
</div>

    </div>
  );
});

export default Section;