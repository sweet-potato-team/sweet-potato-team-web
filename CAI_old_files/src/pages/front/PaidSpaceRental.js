import React, { useState, useEffect } from 'react';
import Step1 from './PaidRentalSteps/Step1';
import Step2 from './PaidRentalSteps/Step2';
import Step3 from './PaidRentalSteps/Step3';
import Step4 from './PaidRentalSteps/Step4';
import axios from 'axios';

function PaidSpaceRental({ space, handleClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [rentalData, setRentalData] = useState({
    paidSpaceRentalUnit: '', 
    paidSpaceId: space.paidSpaceId, 
    paidSpaceRentalDateTimeStart1: '', 
    paidSpaceRentalDateTimeEnd1: '', 
    paidSpaceRentalDateTimeStart2: '', 
    paidSpaceRentalDateTimeEnd2: '', 
    paidSpaceRentalPhone: '', 
    paidSpaceRentalEmail: '', 
    paidSpaceRentalReason: '', 
    paidSpaceRentalRenter: '', 
    paidSpaceRentalUnitType: '', 
    paidSpaceRentalActivityType: '', 
    paidSpaceRentalActivityTypeOther: '', 
    paidSpaceRentalUsers: '', 
    paidSpaceRentalRemark1: '', 
    paidSpaceRentalRemark2: '', 
    paidSpaceRentalFeeActivityPartner: false, 
    paidSpaceRentalAgree: false, 
    paidSpaceRentalSuccess: 0, 
    paidSpaceRentalFeeSpace: null, 
    paidSpaceRentalFeeClean: null, 
    paidSpaceRentalFeePermission: null, 
    paidSpaceRentalPayDate: null, 
    chargeId: null,
    paidSpaceRentalFeeSpaceType: 2 
  });
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    console.log('Current Step:', currentStep);
  }, [currentStep]);

  useEffect(() => {
    console.log('Rental Data:', rentalData);
  }, [rentalData]);

  const nextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleChange = (input) => (e) => {
    let value = e.target.value;
    setRentalData((prevData) => ({
      ...prevData,
      [input]: value,
    }));
  };

  const calculatePayDate = (startDateTime) => {
    const date = new Date(startDateTime);
    let daysToSubtract = 3;

    while (daysToSubtract > 0) {
      date.setDate(date.getDate() - 1);
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        daysToSubtract--;
      }
    }

    return date.toISOString().split('T')[0];
  };

  const handleConfirm = async (transformedData) => {
    try {
      const earliestDateTime = rentalData.paidSpaceRentalDateTimeStart1 < rentalData.paidSpaceRentalDateTimeStart2 || !rentalData.paidSpaceRentalDateTimeStart2 
        ? rentalData.paidSpaceRentalDateTimeStart1 
        : rentalData.paidSpaceRentalDateTimeStart2;

      const postData = {
        ...transformedData,
        paidSpaceRentalPayDate: calculatePayDate(earliestDateTime),
        paidSpaceRentalActivityTypeOther: transformedData.paidSpaceRentalActivityType === 3 ? transformedData.paidSpaceRentalActivityTypeOther : '', 
        paidSpaceRentalAgree: rentalData.paidSpaceRentalAgree ? 1 : 0, 
        paidSpaceRentalFeeActivityPartner: rentalData.paidSpaceRentalFeeActivityPartner ? 1 : 0, 
      };

      console.log('POST Data:', postData);

      const response = await axios.post('http://localhost:8080/paid_space_rentals', postData);

      console.log('POST response:', response.data);

      // 準備電子郵件內容
      const formattedStartDate1 = rentalData.paidSpaceRentalDateTimeStart1.replace('T', ' ');
      const formattedEndDate1 = rentalData.paidSpaceRentalDateTimeEnd1.replace('T', ' ');
      const formattedStartDate2 = rentalData.paidSpaceRentalDateTimeStart2 ? rentalData.paidSpaceRentalDateTimeStart2.replace('T', ' ') : null;
      const formattedEndDate2 = rentalData.paidSpaceRentalDateTimeEnd2 ? rentalData.paidSpaceRentalDateTimeEnd2.replace('T', ' ') : null;

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
              <p>親愛的 ${rentalData.paidSpaceRentalRenter}，</p>
              <p>您的租借申請已成功提交。以下是您的租借詳情：</p>
              <div class="centered-box">
                <ul>
                  <li><strong>申請場地： </strong> ${space.paidSpaceName}</li>                
                  <li><strong>申請單位： </strong> ${rentalData.paidSpaceRentalUnit}</li>
                  <li><strong>第一筆申請開始時間： </strong> ${formattedStartDate1}</li>
                  <li><strong>第一筆申請結束時間： </strong> ${formattedEndDate1}</li>
                  ${formattedStartDate2 && formattedEndDate2 ? `
                  <li><strong>第二筆申請開始時間： </strong> ${formattedStartDate2}</li>
                  <li><strong>第二筆申請結束時間： </strong> ${formattedEndDate2}</li>` : ''}
                  <li><strong>聯絡電話： </strong> ${rentalData.paidSpaceRentalPhone}</li>
                  <li><strong>租借事由： </strong> ${rentalData.paidSpaceRentalReason}</li>
                  <li><strong>空間費用： </strong> ${rentalData.paidSpaceRentalFeeSpace}</li>
                  <li><strong>清潔費用： </strong> ${rentalData.paidSpaceRentalFeeClean}</li>
                  <li><strong>保證金： </strong> ${rentalData.paidSpaceRentalFeePermission}</li>
                </ul>
              </div>
              <p>請再次確認上表內容無誤，我們會盡快審核您的申請，請在申請通過後於活動開始前三個工作天進行繳費，若有活動議程資料也請繳費時一並附上提交。</p>
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
        to: rentalData.paidSpaceRentalEmail,
        subject: '租借空間確認通知',
        body: emailBody,
      });

      console.log('Email sent to:', rentalData.paidSpaceRentalEmail);

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
      {!showWarning && currentStep === 1 && <Step1 nextStep={nextStep} setRentalData={setRentalData} spaceName={space.paidSpaceName} rentalData={rentalData}/>}
      {!showWarning && currentStep === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} rentalData={rentalData} setRentalData={setRentalData} />}
      {!showWarning && currentStep === 3 && <Step3 nextStep={nextStep} prevStep={prevStep} rentalData={rentalData} setRentalData={setRentalData} handleConfirm={handleConfirm} />}
      {!showWarning && currentStep === 4 && <Step4 rentalData={rentalData} handleClose={handleClose} />}
    </div>
  );
}

export default PaidSpaceRental;