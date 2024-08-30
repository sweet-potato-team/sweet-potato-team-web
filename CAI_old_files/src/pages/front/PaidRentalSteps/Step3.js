import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Step3({ nextStep, prevStep, rentalData, setRentalData, handleConfirm }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchChargeIdAndFees = async () => {
      try {
        console.log('開始計算費用...');
        const chargeLevel = rentalData.paidSpaceRentalFeeSpaceType;

        let finalSpaceFee = 0;
        let maxCleanFee = 0; // 記錄當日最高的清潔費
        let maxPermissionFee = 0; // 記錄當日最高的保證金
        let totalDayHours = 0; // 記錄總共的白天時數
        let totalNightHours = 0; // 記錄總共的晚上時數
        let chargeId = null; // 記錄 chargeId

        const isWeekendOrHoliday = (date) => {
          const day = date.getDay();
          return day === 0 || day === 6; // 0是周日，6是周六，假設此處有邏輯判斷是否為國定假日
        };

        const calculateFeeForPeriod = async (startTime, endTime, isDaytime) => {
          const hours = (endTime - startTime) / (1000 * 60 * 60);
          if (isDaytime) {
            totalDayHours += hours;
          } else {
            totalNightHours += hours;
          }

          console.log(`計算時間段: ${startTime} - ${endTime}, 時數: ${hours} 小時`);

          const category = isDaytime ? 1 : 2;
          const chargeResponse = await axios.get('http://localhost:8080/manage_charges', {
            params: {
              paidSpaceId: rentalData.paidSpaceId,
              chargeLevel: chargeLevel,
              chargeCategory: category,
            },
          });

          const chargeData = chargeResponse.data.results[0];
          if (chargeData) {
            chargeId = chargeData.chargeId; // 取得 chargeId
            const baseFee = chargeData.chargeRentalFeeSpace;
            const extraFee = hours > 4 ? (hours - 4) * (baseFee / 4) : 0;
            finalSpaceFee += baseFee + extraFee;

            console.log(`場地費計算: 基本費用為 ${baseFee}，加上額外時數費用 ${extraFee}，總計: ${finalSpaceFee}`);

            // 只更新同一天內的最高清潔費和保證金
            maxCleanFee = Math.max(maxCleanFee, chargeData.chargeRentalFeeClean);
            maxPermissionFee = Math.max(maxPermissionFee, chargeData.chargeRentalFeePermission);

            console.log(`當前清潔費: ${maxCleanFee}，保證金: ${maxPermissionFee}`);
          }
        };

        const rentalStartTime1 = new Date(rentalData.paidSpaceRentalDateTimeStart1);
        const rentalEndTime1 = new Date(rentalData.paidSpaceRentalDateTimeEnd1);
        const rentalStartTime2 = rentalData.paidSpaceRentalDateTimeStart2 ? new Date(rentalData.paidSpaceRentalDateTimeStart2) : null;
        const rentalEndTime2 = rentalData.paidSpaceRentalDateTimeEnd2 ? new Date(rentalData.paidSpaceRentalDateTimeEnd2) : null;

        console.log('計算第一段時間的費用...');
        const midDayEndTime1 = new Date(rentalStartTime1);
        midDayEndTime1.setHours(17, 0, 0); // 設定白天結束時間17:00

        if (isWeekendOrHoliday(rentalStartTime1) || rentalStartTime1.getHours() >= 17 || rentalEndTime1.getHours() <= 8) {
          await calculateFeeForPeriod(rentalStartTime1, rentalEndTime1, false);
        } else if (rentalEndTime1 <= midDayEndTime1) {
          // 第一段時間完全在白天
          await calculateFeeForPeriod(rentalStartTime1, rentalEndTime1, true);
        } else {
          // 跨越白天和晚上
          await calculateFeeForPeriod(rentalStartTime1, midDayEndTime1, true);
          await calculateFeeForPeriod(midDayEndTime1, rentalEndTime1, false);
        }

        if (rentalStartTime2 && rentalEndTime2 && rentalStartTime1.toDateString() === rentalStartTime2.toDateString()) {
          console.log('計算第二段時間的費用...');
          const midDayEndTime2 = new Date(rentalStartTime2);
          midDayEndTime2.setHours(17, 0, 0); // 設定白天結束時間17:00

          if (isWeekendOrHoliday(rentalStartTime2) || rentalStartTime2.getHours() >= 17 || rentalEndTime2.getHours() <= 8) {
            await calculateFeeForPeriod(rentalStartTime2, rentalEndTime2, false);
          } else if (rentalEndTime2 <= midDayEndTime2) {
            await calculateFeeForPeriod(rentalStartTime2, rentalEndTime2, true);
          } else {
            await calculateFeeForPeriod(rentalStartTime2, midDayEndTime2, true);
            await calculateFeeForPeriod(midDayEndTime2, rentalEndTime2, false);
          }
        }

        // 合併計算總的白天和晚上時間的費用
        console.log('最終合併計算...');
        finalSpaceFee = 0;

        // 白天計算
        if (totalDayHours > 0) {
          const dayChargeResponse = await axios.get('http://localhost:8080/manage_charges', {
            params: {
              paidSpaceId: rentalData.paidSpaceId,
              chargeLevel: chargeLevel,
              chargeCategory: 1, // 白天
            },
          });
          const dayChargeData = dayChargeResponse.data.results[0];
          if (dayChargeData) {
            const baseFee = dayChargeData.chargeRentalFeeSpace;
            const extraFee = totalDayHours > 4 ? (totalDayHours - 4) * (baseFee / 4) : 0;
            finalSpaceFee += baseFee + extraFee;
          }
        }

        // 晚上計算
        if (totalNightHours > 0) {
          const nightChargeResponse = await axios.get('http://localhost:8080/manage_charges', {
            params: {
              paidSpaceId: rentalData.paidSpaceId,
              chargeLevel: chargeLevel,
              chargeCategory: 2, // 晚上
            },
          });
          const nightChargeData = nightChargeResponse.data.results[0];
          if (nightChargeData) {
            const baseFee = nightChargeData.chargeRentalFeeSpace;
            const extraFee = totalNightHours > 4 ? (totalNightHours - 4) * (baseFee / 4) : 0;
            finalSpaceFee += baseFee + extraFee;
          }
        }

        // 如果勾選了「與研發處合辦活動」，則場地費打五折
        if (rentalData.paidSpaceRentalFeeActivityPartner) {
          console.log('與研發處合辦活動，場地費打五折');
          finalSpaceFee *= 0.5;
        }

        console.log(`最終場地費用: ${finalSpaceFee}`);
        console.log(`最終清潔費用: ${maxCleanFee}`);
        console.log(`最終保證金: ${maxPermissionFee}`);

        setRentalData((prevData) => ({
          ...prevData,
          paidSpaceRentalFeeSpace: finalSpaceFee,
          paidSpaceRentalFeeClean: maxCleanFee, // 當天的最高清潔費
          paidSpaceRentalFeePermission: maxPermissionFee, // 當天的最高保證金
          chargeId: chargeId, // 儲存 chargeId
        }));
      } catch (error) {
        console.error('計算費用時出錯:', error);
      }
    };

    fetchChargeIdAndFees();
  }, [
    rentalData.paidSpaceId,
    rentalData.paidSpaceRentalDateTimeStart1,
    rentalData.paidSpaceRentalDateTimeEnd1,
    rentalData.paidSpaceRentalDateTimeStart2,
    rentalData.paidSpaceRentalDateTimeEnd2,
    rentalData.paidSpaceRentalFeeSpaceType,
    rentalData.paidSpaceRentalActivityType,
    rentalData.paidSpaceRentalFeeActivityPartner,
    setRentalData
  ]);

  const handleConfirmAndNext = async () => {
    setIsSubmitting(true);
    try {
      const earliestDateTime = rentalData.paidSpaceRentalDateTimeStart1 < rentalData.paidSpaceRentalDateTimeStart2 || !rentalData.paidSpaceRentalDateTimeStart2 
        ? rentalData.paidSpaceRentalDateTimeStart1 
        : rentalData.paidSpaceRentalDateTimeStart2;

      const transformedData = {
        ...rentalData,
        paidSpaceRentalUnitType: rentalData.paidSpaceRentalUnitType === '校內單位' ? 1 : 2,
        paidSpaceRentalActivityType: rentalData.paidSpaceRentalActivityType === '學術演講' ? 1 :
                                     rentalData.paidSpaceRentalActivityType === '學術研討會' ? 2 : 3,
        paidSpaceRentalPayDate: calculatePayDate(earliestDateTime),
        chargeId: rentalData.chargeId, // 包含 chargeId
      };

      await handleConfirm(transformedData);
      nextStep();
    } catch (error) {
      setIsSubmitting(false);
    }
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

  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '2rem', borderRadius: '8px', boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#343a40' }}>確認資料</h2>
      <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '5px', marginBottom: '2rem', border: '1px solid #ced4da' }}>
        <p style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>申請單位: {rentalData.paidSpaceRentalUnit}</p>
        <p style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>單位類型: {rentalData.paidSpaceRentalUnitType}</p>
        <p style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>借用空間: {rentalData.paidSpaceName}</p>
        <p style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>申請開始日期1: {rentalData.paidSpaceRentalDateTimeStart1}</p>
        <p style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>申請結束日期1: {rentalData.paidSpaceRentalDateTimeEnd1}</p>
        {rentalData.paidSpaceRentalDateTimeStart2 && rentalData.paidSpaceRentalDateTimeEnd2 && (
          <>
            <p style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>申請開始日期2: {rentalData.paidSpaceRentalDateTimeStart2}</p>
            <p style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>申請結束日期2: {rentalData.paidSpaceRentalDateTimeEnd2}</p>
          </>
        )}
        <p style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>備註1: {rentalData.paidSpaceRentalRemark1}</p>
        {rentalData.paidSpaceRentalRemark2 && (
          <p style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>備註2: {rentalData.paidSpaceRentalRemark2}</p>
        )}
        <p style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>連絡電話: {rentalData.paidSpaceRentalPhone}</p>
        <p style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>電子郵件: {rentalData.paidSpaceRentalEmail}</p>
        <p style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>活動類型: {rentalData.paidSpaceRentalActivityType}</p>
        {rentalData.paidSpaceRentalActivityType === '其他' && (
          <p style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>其他活動類型：{rentalData.paidSpaceRentalActivityTypeOther}</p>
        )}
        <p style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>借用事由：{rentalData.paidSpaceRentalReason}</p>
        <p style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>使用人數：{rentalData.paidSpaceRentalUsers}</p>
        <p style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>是否與研發處合辦活動：{rentalData.paidSpaceRentalFeeActivityPartner ? '是' : '否'}</p>
        <p style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>空間費用：{rentalData.paidSpaceRentalFeeSpace || '0'}</p>
        <p style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>清潔費用：{rentalData.paidSpaceRentalFeeClean || '0'}</p>
        <p style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#495057' }}>保證金：{rentalData.paidSpaceRentalFeePermission || '0'}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button style={{ minWidth: '120px', padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: '5px', cursor: 'pointer', backgroundColor: '#6c757d', borderColor: '#6c757d', color: '#fff' }} onClick={prevStep}>
          上一步
        </button>
        <button
          style={{ minWidth: '120px', padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: '5px', cursor: isSubmitting ? 'not-allowed' : 'pointer', backgroundColor: isSubmitting ? '#6c757d' : '#007bff', borderColor: isSubmitting ? '#6c757d' : '#007bff', color: '#fff' }}
          onClick={handleConfirmAndNext}
          disabled={isSubmitting}
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