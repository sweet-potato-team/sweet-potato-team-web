import React, { useState } from 'react';

function Step3({ nextStep, prevStep, rentalData, handleConfirm }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerStyle = {
    backgroundColor: '#f8f9fa',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#343a40',
  };

  const summaryStyle = {
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '5px',
    marginBottom: '2rem',
    border: '1px solid #ced4da',
  };

  const labelStyle = {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '0.5rem',
    color: '#495057',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '2rem',
  };

  const buttonStyle = {
    minWidth: '120px',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
  };

  const prevButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    borderColor: '#6c757d',
    color: '#fff',
  };

  const confirmButtonStyle = {
    ...buttonStyle,
    backgroundColor: isSubmitting ? '#6c757d' : '#007bff',
    borderColor: isSubmitting ? '#6c757d' : '#007bff',
    color: '#fff',
    cursor: isSubmitting ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const handleConfirmAndNext = async () => {
    setIsSubmitting(true);
    try {
      await handleConfirm(); // 激活 handleConfirm 函數
      nextStep(); // POST成功後進入下一步
    } catch (error) {
      // 若有錯誤發生，可以在這裡處理，並將 isSubmitting 設回 false
      setIsSubmitting(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>確認資料</h2>
      <div style={summaryStyle}>
        <p style={labelStyle}>申請單位: {rentalData.unit}</p>
        <p style={labelStyle}>借用空間: {rentalData.location}</p>
        <p style={labelStyle}>借用日期與時段: {rentalData.dateTime}</p>
        <p style={labelStyle}>連絡電話: {rentalData.phone}</p>
        <p style={labelStyle}>電子郵件: {rentalData.email}</p>
        <p style={labelStyle}>借用事由: {rentalData.reason}</p>
        <p style={labelStyle}>借用人: {rentalData.renter}</p>
      </div>
      <div style={buttonContainerStyle}>
        <button style={prevButtonStyle} onClick={prevStep}>
          上一步
        </button>
        <button
          style={confirmButtonStyle}
          onClick={handleConfirmAndNext}
          disabled={isSubmitting} // 按鈕被禁用時不允許點擊
        >
          {isSubmitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
                style={{ marginRight: '8px' }}
              ></span>
              正在送出
            </>
          ) : (
            '確認預約'
          )}
        </button>
      </div>
    </div>
  );
}

export default Step3;
