import React, { useState, useEffect } from 'react';
import Step1 from './PaidRentalSteps/Step1'; // 根據需要更改為新的步驟組件路徑
import Step2 from './PaidRentalSteps/Step2';
import Step3 from './PaidRentalSteps/Step3';
import Step4 from './PaidRentalSteps/Step4';
import axios from 'axios';

function PaidSpaceRental({ space, handleClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [rentalData, setRentalData] = useState({
      paidSpaceRentalUnit: '', // 申請單位
      paidSpaceId: space.paidSpaceId, // 空間 ID
      paidSpaceRentalDateTimeStart1: '', // 第一個申請開始日期
      paidSpaceRentalDateTimeEnd1: '', // 第一個申請結束日期
      paidSpaceRentalDateTimeStart2: '', // 第二個申請開始日期
      paidSpaceRentalDateTimeEnd2: '', // 第二個申請結束日期
      paidSpaceRentalPhone: '', // 聯絡電話
      paidSpaceRentalEmail: '', // 電子郵件
      paidSpaceRentalReason: '', // 申請理由
      paidSpaceRentalRenter: '', // 申請人
      paidSpaceRentalAgree: 1, // 假設使用者已同意規則，設為1
      paidSpaceRentalSuccess: 0 // 初始狀態為未通過，設為0
  });
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    console.log('Current Step:', currentStep);
    console.log('Rental Data:', rentalData);
  }, [currentStep, rentalData]);

  const nextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleChange = (input) => (e) => {
    const newValue = { ...rentalData, [input]: e.target.value };
    setRentalData(newValue);
    console.log('Updated Rental Data:', newValue);
  };

  const handleConfirm = async () => {
    console.log('Submitting Rental Data:', rentalData);
  
    try {
        const response = await axios.post('http://localhost:8080/paid_space_rentals', {
            paidSpaceId: rentalData.paidSpaceId,
            paidSpaceRentalUnit: rentalData.paidSpaceRentalUnit,
            paidSpaceRentalDateTimeStart1: rentalData.paidSpaceRentalDateTimeStart1,
            paidSpaceRentalDateTimeEnd1: rentalData.paidSpaceRentalDateTimeEnd1,
            paidSpaceRentalDateTimeStart2: rentalData.paidSpaceRentalDateTimeStart2,
            paidSpaceRentalDateTimeEnd2: rentalData.paidSpaceRentalDateTimeEnd2,
            paidSpaceRentalPhone: rentalData.paidSpaceRentalPhone,
            paidSpaceRentalEmail: rentalData.paidSpaceRentalEmail,
            paidSpaceRentalReason: rentalData.paidSpaceRentalReason,
            paidSpaceRentalRenter: rentalData.paidSpaceRentalRenter,
            paidSpaceRentalAgree: rentalData.paidSpaceRentalAgree,
            paidSpaceRentalSuccess: rentalData.paidSpaceRentalSuccess,
        });

        console.log('POST response:', response.data);

        setCurrentStep(4);
    } catch (error) {
      console.error('POST error:', error);
    }
  };

  const handleWarningConfirm = () => {
    setShowWarning(false);
  };

  const renderProgressBar = () => {
    const steps = [
      { label: '場地資訊', description: '選擇租借場地', step: 1 },
      { label: '租借時間', description: '框選租借時間段', step: 2 },
      { label: '租借申請單', description: '成立租借申請單', step: 3 },
      { label: '確認資料', description: '確認租借申請單填寫無誤並送出', step: 4 }
    ];

    const progressStep = currentStep === 1 ? 2 : currentStep === 2 ? 3 : currentStep === 3 ? 4 : 4;

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position: 'relative', padding: '20px 0' }}>
        {steps.map((step, index) => {
          const isPreviousStep = index + 1 < progressStep;
          const isCurrentStep = index + 1 === progressStep;

          return (
            <div key={index} style={{ textAlign: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: isPreviousStep ? 'rgba(40, 167, 69, 0.5)' : isCurrentStep ? '#28a745' : '#ccc',
                  margin: 'auto',
                  marginBottom: '15px',
                  lineHeight: '40px',
                  color: isPreviousStep || isCurrentStep ? '#fff' : '#333',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  transition: 'background-color 0.4s ease, color 0.4s ease, transform 0.4s ease',
                  transform: isCurrentStep ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: isCurrentStep ? '0 0 15px rgba(40, 167, 69, 0.6)' : 'none',
                  border: isCurrentStep ? '2px solid #28a745' : '2px solid #ccc'
                }}
              >
                {index + 1}
              </div>
              <div style={{ marginTop: '10px', color: isPreviousStep || isCurrentStep ? '#28a745' : '#333', fontWeight: isCurrentStep ? 'bold' : 'normal', transition: 'color 0.4s ease' }}>{step.label}</div>
              <div style={{ color: isPreviousStep || isCurrentStep ? '#28a745' : '#999', fontSize: '12px', transition: 'color 0.4s ease' }}>{step.description}</div>
              {index < steps.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 'calc(50% + 20px)',
                    right: '-50%',
                    height: '2px',
                    backgroundColor: isPreviousStep || isCurrentStep ? '#28a745' : '#ccc',
                    zIndex: -1,
                    transition: 'background-color 0.4s ease'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {showWarning && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              textAlign: 'center',
            }}
          >
            <p>好貴喔。點擊確認以繼續。</p>
            <button
              onClick={handleWarningConfirm}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              確認
            </button>
          </div>
        </div>
      )}
      {!showWarning && currentStep < 4 && renderProgressBar()}
      {!showWarning && currentStep === 1 && <Step1 nextStep={nextStep} setRentalData={setRentalData} spaceName={space.paidSpaceName} />}
      {!showWarning && currentStep === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} rentalData={rentalData} />}
      {!showWarning && currentStep === 3 && <Step3 nextStep={nextStep} prevStep={prevStep} rentalData={rentalData} handleConfirm={handleConfirm} />}
      {!showWarning && currentStep === 4 && <Step4 rentalData={rentalData} handleClose={handleClose} />}
    </div>
  );
}

export default PaidSpaceRental;
