import React from 'react';
import { Link } from 'react-router-dom';

const ReturnHomeButton = () => {
  const buttonStyle = {
    position: 'absolute',
    top: '-20px',
    left: '-60px', 
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: '#000',
    padding: '8px 15px', // 調整padding大小
    borderRadius: '5px',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    zIndex: 2, 
  };

  const iconStyle = {
    fontSize: '2rem', // 調整icon大小
    marginRight: '10px',
  };

  const textStyle = {
    fontSize: '1.5rem', // 調整文字大小
    maxWidth: '0',
    overflow: 'hidden',
    transition: 'max-width 0.3s ease',
    whiteSpace: 'nowrap',
  };

  const handleMouseEnter = (e) => {
    e.target.querySelector('span').style.maxWidth = '150px';
  };

  const handleMouseLeave = (e) => {
    e.target.querySelector('span').style.maxWidth = '0';
  };

  return (
    <Link
      to="/"
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <i className="bi bi-house" style={iconStyle}></i>
      <span style={textStyle}>&lt; 返回主選單</span>
    </Link>
  );
};

export default ReturnHomeButton;
