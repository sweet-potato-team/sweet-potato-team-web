import React, { useState, useEffect } from 'react';
import Step1 from './FreeRentalSteps/Step1';
import Step2 from './FreeRentalSteps/Step2';
import Step3 from './FreeRentalSteps/Step3';
import Step4 from './FreeRentalSteps/Step4';
import axios from 'axios';

function SpaceRental({ space, handleClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [rentalData, setRentalData] = useState({
      spaceRentalUnit: '', // 申請單位
      freeSpaceId: space.freeSpaceId, // 空間 ID
      spaceRentalDateStart: '', // 申請開始日期
      spaceRentalDateEnd: '', // 申請結束日期
      spaceRentalPhone: '', // 聯絡電話
      spaceRentalEmail: '', // 電子郵件
      spaceRentalReason: '', // 申請理由
      spaceRentalRenter: '' // 申請人
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
        const response = await axios.post('http://localhost:8080/space_rentals', {
            freeSpaceId: rentalData.freeSpaceId,
            spaceRentalUnit: rentalData.spaceRentalUnit,
            spaceRentalDateStart: rentalData.spaceRentalDateStart,
            spaceRentalDateEnd: rentalData.spaceRentalDateEnd,
            spaceRentalPhone: rentalData.spaceRentalPhone,
            spaceRentalEmail: rentalData.spaceRentalEmail,
            spaceRentalReason: rentalData.spaceRentalReason,
            spaceRentalRenter: rentalData.spaceRentalRenter,
            spaceRentalAgree: 1, // 假設使用者已同意規則，設為1
            spaceRentalSuccess: 0 // 初始狀態為未通過，設為0
        });

        console.log('POST response:', response.data);

        // 格式化日期時間去掉 'T'
        const formattedStartDate = rentalData.spaceRentalDateStart.replace('T', ' ');
        const formattedEndDate = rentalData.spaceRentalDateEnd.replace('T', ' ');

        const emailBody = `
        <html lang="zh-TW">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>租借申請確認</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.8;
              color: #333;
              background-color: #f2f2f2;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 40px auto;
              padding: 30px;
              border: 1px solid #ddd;
              border-radius: 8px;
              background-color: #ffffff;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .email-header {
              text-align: center;
              margin-bottom: 30px;
            }
            .email-header img {
              max-width: 400px;
              height: auto;
            }
            .email-header h2 {
              font-size: 24px;
              color: #333;
              margin: 20px 0 10px;
            }
            .email-content {
              font-size: 16px;
              line-height: 1.8;
              color: #555;
            }
            .email-content ul {
              list-style: none;
              padding: 0 20px;
            }
            .email-content ul li {
              margin-bottom: 10px;
            }
            .email-content ul li strong {
              color: #333;
            }
            .email-footer {
              text-align: center;
              font-size: 14px;
              color: #777;
              margin-top: 30px;
              border-top: 1px solid #ddd;
              padding-top: 10px;
              line-height: 1.4;
            }
            .email-footer p {
              margin: 5px 0;
            }
            .centered-box {
              display: block;
              margin: 20px auto;
              padding: 15 20px;
              border: 2px solid #333;
              border-radius: 10px;
              background-color: #f9f9f9;
              font-weight: bold;
              text-align: left;
              width: fit-content;
              max-width: 100%;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <img src="http://www.caic.ncu.edu.tw/images/joomlashine/logo/logo.png" alt="Logo" />
              <h2>租借申請已成功提交</h2>
            </div>
            <div class="email-content">
              <p>親愛的 ${rentalData.spaceRentalRenter}，</p>
              <p>您的租借申請已成功提交。以下是您的租借詳情：</p>
              <div class="centered-box">
                <ul>
                  <li><strong>申請場地： </strong> ${rentalData.freeSpaceName}</li>                
                  <li><strong>申請單位： </strong> ${rentalData.spaceRentalUnit}</li>
                  <li><strong>申請開始日期： </strong> ${formattedStartDate}</li>
                  <li><strong>申請結束日期： </strong> ${formattedEndDate}</li>
                  <li><strong>聯絡電話： </strong> ${rentalData.spaceRentalPhone}</li>
                  <li><strong>租借事由： </strong> ${rentalData.spaceRentalReason}</li>
                </ul>
              </div>
              <p>請再次確認上表內容無誤，我們會盡快審核您的申請</p>
              <p>如有任何問題，請隨時與我們聯繫。</p>
            </div>
            <div class="email-footer">
              <p>32001 桃園市中壢區中大路300號</p>
              <p>(03)490-8851</p>
              <p>(03)490-0488)</p>
              <p>(03)420-0697)</p>
              <p>中央大學總機電話: (03)422-7151 校內分機:27086~27089 傳真: (03)420-5604</p>
            </div>
          </div>
        </body>
        </html>
      `;
  
      await axios.post('http://localhost:8080/sendEmail', {
        to: rentalData.spaceRentalEmail,
        subject: '租借空間確認通知',
        body: emailBody,
      });
  
      console.log('Email sent to:', rentalData.spaceRentalEmail);
  
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
      {!showWarning && currentStep === 1 && <Step1 nextStep={nextStep} setRentalData={setRentalData} spaceName={space.freeSpaceName} />}
      {!showWarning && currentStep === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} rentalData={rentalData} />}
      {!showWarning && currentStep === 3 && <Step3 nextStep={nextStep} prevStep={prevStep} rentalData={rentalData} handleConfirm={handleConfirm} />}
      {!showWarning && currentStep === 4 && <Step4 rentalData={rentalData} handleClose={handleClose} />}
    </div>
  );
}

export default SpaceRental;
