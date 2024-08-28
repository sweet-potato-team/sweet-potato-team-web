import React from 'react';
import ReturnHomeButton from './ReturnHomeButton'; // 確保引入正確的組件

const NavigationBar = () => {
  return (
    <div className="d-flex justify-content-between align-items-center" style={{ padding: '10px 0', borderBottom: '1px solid #ddd' }}>
      <ReturnHomeButton />
      <img 
        src="http://www.caic.ncu.edu.tw/images/joomlashine/logo/logo.png" 
        alt="Logo" 
        style={{ height: '50px', objectFit: 'contain' }} 
      />
      <div style={{ width: '50px' }} /> {/* 佔位符使圖片保持居中 */}
    </div>
  );
}

export default NavigationBar;
