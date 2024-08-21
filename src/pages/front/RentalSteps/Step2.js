import React from 'react';

function Step2({ nextStep, prevStep, handleChange, rentalData }) {
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

  const labelStyle = {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '0.5rem',
    color: '#495057',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    marginBottom: '1rem',
    borderRadius: '5px',
    border: '1px solid #ced4da',
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

  const nextButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    color: '#fff',
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>填寫資料</h2>
      <form>
        <label style={labelStyle}>
          申請單位：
          <input type="text" style={inputStyle} onChange={handleChange('spaceRentalUnit')} value={rentalData.spaceRentalUnit} />
        </label>
        <label style={labelStyle}>
          借用空間：
          <input type="text" style={inputStyle} value={rentalData.freeSpaceName} readOnly />
        </label>
        <label style={labelStyle}>
          借用日期與時段：
          <input type="text" style={inputStyle} value={rentalData.spaceRentalDateTime} readOnly />
        </label>
        <label style={labelStyle}>
          連絡電話：
          <input type="text" style={inputStyle} onChange={handleChange('spaceRentalPhone')} value={rentalData.spaceRentalPhone} />
        </label>
        <label style={labelStyle}>
          電子郵件：
          <input type="email" style={inputStyle} onChange={handleChange('spaceRentalEmail')} value={rentalData.spaceRentalEmail} />
        </label>
        <label style={labelStyle}>
          借用事由：
          <input type="text" style={inputStyle} onChange={handleChange('spaceRentalReason')} value={rentalData.spaceRentalReason} />
        </label>
        <label style={labelStyle}>
          借用人：
          <input type="text" style={inputStyle} onChange={handleChange('spaceRentalRenter')} value={rentalData.spaceRentalRenter} />
        </label>
      </form>

      <div style={buttonContainerStyle}>
        <button style={prevButtonStyle} onClick={prevStep}>
          上一步
        </button>
        <button style={nextButtonStyle} onClick={nextStep}>
          確認資料
        </button>
      </div>
    </div>
  );
}

export default Step2;