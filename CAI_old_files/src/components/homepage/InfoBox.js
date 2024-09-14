import React from 'react';
import '../../frontpage.css'; // 確保引入CSS樣式文件

function InfoBox({ title, onClick, children }) {
  return (
    <div className="infoBox" onClick={onClick}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export default InfoBox;
