import React, { useState, useEffect, useCallback } from 'react';

function Step2({ nextStep, prevStep, handleChange, rentalData, setRentalData }) {
  const [otherActivityType, setOtherActivityType] = useState(rentalData.paidSpaceRentalActivityType === '其他');
  const [isPaidEvent, setIsPaidEvent] = useState(false);

  const handleActivityTypeChange = useCallback((e) => {
    const value = e.target.value;
    handleChange('paidSpaceRentalActivityType')({ target: { value } });
    setOtherActivityType(value === '其他');
  }, [handleChange]);

  const handleUnitTypeChange = useCallback((e) => {
    const value = e.target.value;
    handleChange('paidSpaceRentalUnitType')({ target: { value } });

    if (value === '校外單位') {
      setRentalData((prevData) => ({
        ...prevData,
        paidSpaceRentalFeeSpaceType: 1, // 校外單位，固定收費類型為1
      }));
    } else if (value === '校內單位') {
      setRentalData((prevData) => ({
        ...prevData,
        paidSpaceRentalFeeSpaceType: isPaidEvent ? 2 : 3, // 校內單位：收費活動為2，非收費活動為3
      }));
    }
  }, [handleChange, isPaidEvent, setRentalData]);

  const handlePaidEventChange = (e) => {
    const isChecked = e.target.checked;
    setIsPaidEvent(isChecked);

    if (rentalData.paidSpaceRentalUnitType === '校內單位') {
      setRentalData((prevData) => ({
        ...prevData,
        paidSpaceRentalFeeSpaceType: isChecked ? 2 : 3, // 根據收費活動的選擇改變場地收費類型
      }));
    }
  };

  const handleNextStep = () => {
    const phoneRegex = /^09\d{8}$/; // 假設手機號碼格式為台灣的 09 開頭後接 8 位數字
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!rentalData.paidSpaceRentalRenter) {
      alert('請輸入借用人');
      return;
    }
    if (!rentalData.paidSpaceRentalUnit) {
      alert('請輸入申請單位');
      return;
    }
    if (rentalData.paidSpaceRentalUnitType === '---請選擇---') {
      alert('請選擇單位類型');
      return;
    }
    if (!phoneRegex.test(rentalData.paidSpaceRentalPhone)) {
      alert('請輸入正確的手機號碼格式');
      return;
    }
    if (!emailRegex.test(rentalData.paidSpaceRentalEmail)) {
      alert('請輸入正確的電子郵件格式');
      return;
    }
    if (rentalData.paidSpaceRentalActivityType === '---請選擇---') {
      alert('請選擇活動類型');
      return;
    }
    if (!rentalData.paidSpaceRentalReason) {
      alert('請輸入借用事由');
      return;
    }
    if (rentalData.paidSpaceRentalUsers <= 0) {
      alert('使用人數必須大於0');
      return;
    }
    if (!rentalData.paidSpaceRentalAgree) {
      alert('請同意付費空間規則才能繼續');
      return;
    }

    nextStep();
  };

  const handleCheckboxChange = (key) => (e) => {
    handleChange(key)({ target: { value: e.target.checked } });
  };

  useEffect(() => {
    if (!rentalData.paidSpaceRentalUnitType) {
      setRentalData((prevData) => ({
        ...prevData,
        paidSpaceRentalUnitType: '---請選擇---',
      }));
    }
    if (!rentalData.paidSpaceRentalActivityType) {
      setRentalData((prevData) => ({
        ...prevData,
        paidSpaceRentalActivityType: '---請選擇---',
      }));
    }
  }, [setRentalData, rentalData.paidSpaceRentalUnitType, rentalData.paidSpaceRentalActivityType]);

  // 返回上一步时，清空已选择的时间
  const handlePrevStep = () => {
    setRentalData((prevData) => ({
      ...prevData,
      paidSpaceRentalDateTimeStart1: '',
      paidSpaceRentalDateTimeEnd1: '',
      paidSpaceRentalDateTimeStart2: '',
      paidSpaceRentalDateTimeEnd2: '',
    }));
    prevStep();
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '2rem', borderRadius: '8px', boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#343a40' }}>填寫資料 <small style={{fontSize: '1rem',color:'red'}}>*為必填項</small></h2>
      <form>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>
          *借用人：
          <input type="text" style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ced4da' }} onChange={handleChange('paidSpaceRentalRenter')} value={rentalData.paidSpaceRentalRenter} />
        </label>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>
          *申請單位：
          <input type="text" style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ced4da' }} onChange={handleChange('paidSpaceRentalUnit')} value={rentalData.paidSpaceRentalUnit} />
        </label>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>
          *單位類型：
          <select style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ced4da' }} onChange={handleUnitTypeChange} value={rentalData.paidSpaceRentalUnitType}>
            <option value="---請選擇---">---請選擇---</option>
            <option value="校內單位">校內單位</option>
            <option value="校外單位">校外單位</option>
          </select>
        </label>
        {rentalData.paidSpaceRentalUnitType === '校內單位' && (
          <div style={{ marginBottom: '1rem' }}>
            <label>
              <input
                type="checkbox"
                onChange={handlePaidEventChange}
                checked={isPaidEvent}
              />
              此為收費活動
            </label>
          </div>
        )}
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>
          借用空間：
          <input type="text" style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ced4da' }} value={rentalData.paidSpaceName} readOnly />
        </label>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>
          申請時間日期1：
          <input type="text" style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ced4da' }} value={rentalData.paidSpaceRentalDateTimeStart1} readOnly />
        </label>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>
          申請時間日期1：
          <input type="text" style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ced4da' }} value={rentalData.paidSpaceRentalDateTimeEnd1} readOnly />
        </label>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>
          備註1：
          <input type="text" style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ced4da' }} onChange={handleChange('paidSpaceRentalRemark1')} value={rentalData.paidSpaceRentalRemark1} />
        </label>
        {rentalData.paidSpaceRentalDateTimeStart2 && rentalData.paidSpaceRentalDateTimeEnd2 && (
          <>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>
              申請開始時間2：
              <input type="text" style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ced4da' }} value={rentalData.paidSpaceRentalDateTimeStart2} readOnly />
            </label>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>
              申請結束時間2：
              <input type="text" style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ced4da' }} value={rentalData.paidSpaceRentalDateTimeEnd2} readOnly />
            </label>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>
              備註2：
              <input type="text" style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ced4da' }} onChange={handleChange('paidSpaceRentalRemark2')} value={rentalData.paidSpaceRentalRemark2} />
            </label>
          </>
        )}
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>
        *連絡電話：
          <input type="text" style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ced4da' }} onChange={handleChange('paidSpaceRentalPhone')} value={rentalData.paidSpaceRentalPhone} />
        </label>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>
        *電子郵件：
          <input type="email" style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ced4da' }} onChange={handleChange('paidSpaceRentalEmail')} value={rentalData.paidSpaceRentalEmail} />
        </label>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>
        *活動類型：
          <select style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ced4da' }} onChange={handleActivityTypeChange} value={rentalData.paidSpaceRentalActivityType}>
            <option value="---請選擇---">---請選擇---</option>
            <option value="學術演講">學術演講</option>
            <option value="學術研討會">學術研討會</option>
            <option value="其他">其他</option>
          </select>
        </label>
        {otherActivityType && (
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>
            其他活動類型：
            <input type="text" style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ced4da' }} onChange={handleChange('paidSpaceRentalActivityTypeOther')} value={rentalData.paidSpaceRentalActivityTypeOther || ''} />
          </label>
        )}
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>
        *借用事由：
          <input type="text" style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ced4da' }} onChange={handleChange('paidSpaceRentalReason')} value={rentalData.paidSpaceRentalReason} />
        </label>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>
        *使用人數：
          <input type="number" style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ced4da' }} onChange={handleChange('paidSpaceRentalUsers')} value={rentalData.paidSpaceRentalUsers} />
        </label>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            <input
              type="checkbox"
              onChange={handleCheckboxChange('paidSpaceRentalFeeActivityPartner')}
              checked={rentalData.paidSpaceRentalFeeActivityPartner}
            />
            是否與研發處合辦活動
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            <input
              type="checkbox"
              onChange={handleCheckboxChange('paidSpaceRentalAgree')}
              checked={rentalData.paidSpaceRentalAgree}
            />
            <strong> 是否同意付費空間規則</strong>
          </label>
        </div>
      </form>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button style={{ minWidth: '120px', padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: '5px', cursor: 'pointer', backgroundColor: '#6c757d', borderColor: '#6c757d', color: '#fff' }} onClick={handlePrevStep}>
          上一步
        </button>
        <button style={{ minWidth: '120px', padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: '5px', cursor: 'pointer', backgroundColor: '#007bff', borderColor: '#007bff', color: '#fff' }} onClick={handleNextStep}>
          確認資料
        </button>
      </div>
    </div>
  );
}

export default Step2;