import React from 'react';

function Step4({ rentalData, handleClose }) {
  const containerStyle = {
    backgroundColor: '#f8f9fa',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#28a745',
  };

  const buttonStyle = {
    minWidth: '120px',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#28a745',
    borderColor: '#28a745',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '2rem',
  };

  const handleClick = () => {
    if (handleClose) {
      handleClose(); // 調用父組件傳來的 handleClose 函數來關閉視窗
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>申請成功</h2>
      <p>已將預約資料送至所填寫之郵箱，請查收並等待管理員審核。</p>
      <button style={buttonStyle} onClick={handleClick}>確認</button>
    </div>
  );
}

export default Step4;