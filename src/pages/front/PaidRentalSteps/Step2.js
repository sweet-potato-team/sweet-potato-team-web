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

  // 處理顯示時間，去掉 'T'
  const displayStartDate1 = rentalData.paidSpaceRentalDateTimeStart1.replace('T', ' ');
  const displayEndDate1 = rentalData.paidSpaceRentalDateTimeEnd1.replace('T', ' ');
  const displayStartDate2 = rentalData.paidSpaceRentalDateTimeStart2?.replace('T', ' ');
  const displayEndDate2 = rentalData.paidSpaceRentalDateTimeEnd2?.replace('T', ' ');

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>填寫資料</h2>
      <form>
        <label style={labelStyle}>
          申請單位：
          <input type="text" style={inputStyle} onChange={handleChange('paidSpaceRentalUnit')} value={rentalData.paidSpaceRentalUnit} />
        </label>
        <label style={labelStyle}>
          借用空間：
          <input type="text" style={inputStyle} value={rentalData.paidSpaceName} readOnly />
        </label>
        <label style={labelStyle}>
          申請開始日期1：
          <input type="text" style={inputStyle} value={displayStartDate1} readOnly />
        </label>
        <label style={labelStyle}>
          申請結束日期1：
          <input type="text" style={inputStyle} value={displayEndDate1} readOnly />
        </label>
        {displayStartDate2 && displayEndDate2 && (
          <>
            <label style={labelStyle}>
              申請開始日期2：
              <input type="text" style={inputStyle} value={displayStartDate2} readOnly />
            </label>
            <label style={labelStyle}>
              申請結束日期2：
              <input type="text" style={inputStyle} value={displayEndDate2} readOnly />
            </label>
          </>
        )}
        <label style={labelStyle}>
          連絡電話：
          <input type="text" style={inputStyle} onChange={handleChange('paidSpaceRentalPhone')} value={rentalData.paidSpaceRentalPhone} />
        </label>
        <label style={labelStyle}>
          電子郵件：
          <input type="email" style={inputStyle} onChange={handleChange('paidSpaceRentalEmail')} value={rentalData.paidSpaceRentalEmail} />
        </label>
        <label style={labelStyle}>
          借用事由：
          <input type="text" style={inputStyle} onChange={handleChange('paidSpaceRentalReason')} value={rentalData.paidSpaceRentalReason} />
        </label>
        <label style={labelStyle}>
          借用人：
          <input type="text" style={inputStyle} onChange={handleChange('paidSpaceRentalRenter')} value={rentalData.paidSpaceRentalRenter} />
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
