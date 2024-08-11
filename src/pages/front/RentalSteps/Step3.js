import React from 'react';

function Step3({ nextStep, prevStep, rentalData }) {
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
  };

  const prevButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    borderColor: '#6c757d',
    color: '#fff',
  };

  const confirmButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    color: '#fff',
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
        <button style={confirmButtonStyle} onClick={nextStep}>
          確認預約
        </button>
      </div>
    </div>
  );
}

export default Step3;
