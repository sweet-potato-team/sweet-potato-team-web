import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from 'react-bootstrap';

// 通用日期选择器组件
const CustomDatePicker = ({ label, selectedDate, onChange, backgroundColor, hoverColor }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [hover, setHover] = useState(false);

  const buttonStyle = {
    backgroundColor: backgroundColor,
    color: '#574938',
    padding: '10px 20px',
    borderRadius: '50px',
    display: 'inline-block',
    transition: 'transform 0.2s, background-color 0.2s',
    boxShadow: '4px 4px 6px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    border: 'none',
    marginTop: '10px'
  };

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  return (
    <div>
      <Button
        style={{ ...buttonStyle, backgroundColor: hover ? hoverColor : backgroundColor }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setShowPicker(!showPicker)}
      >
        {label}: {`${selectedDate.getFullYear()}年${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日`}
      </Button>
      {showPicker && (
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            onChange(date);
            setShowPicker(false);
          }}
          inline
          dateFormat="yyyy/MM/dd"
        />
      )}
    </div>
  );
};

export default CustomDatePicker;
