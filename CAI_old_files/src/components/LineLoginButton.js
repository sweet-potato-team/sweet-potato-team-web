import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate
import BtnIcon from '../image/btn_base.png';

function LineLoginButton({ disabled, onClick }) {
    // 定義按鈕的寬度和高度
    const buttonSize = {
      width: '200px', // 統一按鈕寬度
      height: '54px', // 統一按鈕高度
    };

    const baseStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center', // 使內容居中對齊
      padding: '10px 20px',
      backgroundColor: '#06C755',
      border: 'none',
      borderRadius: '10px',
      color: '#FFFFFF',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      position: 'relative',
      ...buttonSize, // 使用統一的寬度和高度
    };
  
    const iconStyle = {
      width: '40px', // 圖標大小
      height: '40px',
      marginRight: '16px', // 調整圖標與文字之間的距離
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

    // 讓按鈕上下排列的容器樣式
    const buttonContainerStyle = {
      display: 'flex',
      flexDirection: 'column', // 讓按鈕垂直排列
      alignItems: 'center', // 使按鈕居中對齊
      gap: '20px', // 設置按鈕之間的間距
    };
  
    return (
      <div style={buttonContainerStyle}>
        <button
          style={{
            ...baseStyle,
            ...(disabled ? disabledStyle : {}),
            ...(disabled ? {} : { ':hover': hoverStyle, ':active': pressStyle }),
          }}
          onClick={onClick}
          disabled={disabled}
        >
          <img src={BtnIcon} alt="LINE" style={iconStyle} />
          <span style={disabled ? { color: '#1E1E1E' } : {}}>LINE Login</span>
        </button>

        {/* 新增的按鈕 */}
        <AdminButton buttonSize={buttonSize} />
      </div>
    );
  }
  
  // 新增進入管理頁面按鈕的子元件
  function AdminButton({ buttonSize }) {
    const [hover, setHover] = useState(false);
    const navigate = useNavigate(); // 使用 navigate 進行導航

    const baseStyle = {
      display: 'inline-block',
      padding: '10px 20px',
      backgroundColor: hover ? '#EFEBE6' : '#B7A58F', // 設定初始背景色和滑鼠懸停後的顏色
      color: hover ? '#B7A58F' : '#EFEBE6', // 文字顏色與背景色相對應
      border: 'none',
      borderRadius: '10px',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, color 0.3s ease',
      ...buttonSize, // 使用從父層傳遞的統一寬度和高度
    };

    const handleAdminClick = () => {
      navigate('/login'); // 導航到登入頁面
    };

    return (
      <button
        style={baseStyle}
        onMouseEnter={() => setHover(true)} // 滑鼠懸停時交換顏色
        onMouseLeave={() => setHover(false)} // 滑鼠離開時恢復顏色
        onClick={handleAdminClick} // 點擊後進入管理頁面
      >
        進入管理頁面
      </button>
    );
  }

  export default LineLoginButton;
