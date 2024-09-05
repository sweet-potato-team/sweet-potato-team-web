import React from 'react';
import BtnIcon from '../image/btn_base.png';

function LineLoginButton({ disabled, onClick }) {
    const baseStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '10px 20px 10px 15px',
      backgroundColor: '#06C755',
      border: 'none',
      borderRadius: '10px',
      color: '#FFFFFF',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      position: 'relative',
    };
  
    const iconStyle = {
      width: '40px', // 增加圖像的大小
      height: '40px',
      marginRight: '16px', // 調整圖像與文字之間的距離
    };
  
    const hoverStyle = {
      boxShadow: '0 0 0 10px rgba(0, 0, 0, 0.10)',
    };
  
    const pressStyle = {
      boxShadow: '0 0 0 30px rgba(0, 0, 0, 0.30)',
    };
  
    const disabledStyle = {
      backgroundColor: '#E5E5E5',
      color: '#1E1E1E',
      cursor: 'not-allowed',
      boxShadow: 'none',
    };
  
    return (
      <button
        style={{
          ...baseStyle,
          ...(disabled ? disabledStyle : {}),
          ...(disabled ? {} : { ':hover': hoverStyle, ':active': pressStyle }),
          justifyContent: 'center', // 使內容居中對齊
        }}
        onClick={onClick}
        disabled={disabled}
      >
        <img src={BtnIcon} alt="LINE" style={iconStyle} />
        <span style={disabled ? { color: '#1E1E1E' } : {}}>Log in with LINE</span>
      </button>
    );
  }
  
  export default LineLoginButton;