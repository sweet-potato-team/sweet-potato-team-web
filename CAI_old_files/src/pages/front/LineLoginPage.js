import React, { useEffect, useState, useRef } from 'react';
import NavBar from '../../components/homepage/NavBar';  
import Footer from '../../components/homepage/Footer';  
import Section from '../../components/Section';
import DepressionScaleData from './DepressionScaleData'; 
import EmotionAnalysis from './EmotionAnalysis'; 
import MedicationRecords from './MedicationRecords'; 
import UserInfo from './UserInfo'; 
import { useNavigate } from 'react-router-dom';

import InfoBox from '../../components/homepage/InfoBox';  
import Loading from '../../components/Loading';  // 引入你自定義的 Loading 組件

import '../../frontpage.css';
import '../../index.css';


function LineLoginPage() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);  // 新增 isLoading 狀態
  const [userId, setUserId] = useState(null);  // 儲存 Line 的 userId
  const [sysUserId, setSysUserId] = useState(null);  // 儲存後端返回的 sysUserId
  const [avatar, setAvatar] = useState('');

  const navigate = useNavigate();
  const homeRef = useRef(null);
  const depressionRef = useRef(null);
  const emotionRef = useRef(null);
  const recordsRef = useRef(null);
  const infoRef = useRef(null);


  const [emotionStartDate, setEmotionStartDate] = useState(null); // 情緒分析區塊日期
  const [emotionEndDate, setEmotionEndDate] = useState(null);
  
  const [depressionStartDate, setDepressionStartDate] = useState(null); // 憂鬱量表區塊日期
  const [depressionEndDate, setDepressionEndDate] = useState(null);

  const [medicationStartDate, setMedicationStartDate] = useState(null); // 憂鬱量表區塊日期
  const [medicationEndDate, setMedicationEndDate] = useState(null);
  

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
  
    if (code) {
      fetch('http://localhost:8080/api/lineLogin/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, redirectUri: 'http://localhost:3000/LineLoginPage' }),
      })
      .then(response => response.json())
      .then(data => {
        console.log("data.id (userId): ", data.id);
        setUserId(data.id);  // 儲存 Line userId
        return fetch(`http://localhost:8080/api/lineLogin/${data.id}`);
      })
      .then(response => response.json())
      .then(userInfo => {
        setUserData(userInfo);
        console.log("userInfo.sysUserId: ", userInfo.sysUserId);
        setSysUserId(userInfo.sysUserId);  // 儲存 sysUserId
        navigate(`/LineLoginPage/${userInfo.sysUserId}`, { replace: true });

        const basePath = '/images/';
        let avatarPath = 'boy_young.png'; // Default
        if (userInfo.gender === '女') {
          avatarPath = userInfo.age > 40 ? 'girl_older.png' : 'girl_young.png';
        } else {
          avatarPath = userInfo.age > 40 ? 'man_older.png' : 'boy_young.png';
        }
        setAvatar(`${basePath}${avatarPath}`);
      })
      .finally(() => {
        setIsLoading(false);  // 加載完成
      })
      .catch(error => console.error('Error:', error.message));
    }
  }, [navigate]);

  const handleClick = (ref, sectionName) => {
    console.log(`正在導航到區塊：${sectionName}`);
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };



  return (
    <div className="lineLoginPage">
      <NavBar sectionRefs={{
        home: homeRef,
        depression: depressionRef,
        emotion: emotionRef,
        records: recordsRef,
        info: infoRef,
      }} 
      className="NavBar"/>
      <div style={{ flex: 1 }}>
        <Loading isLoading={isLoading} />
        {!isLoading && userData ? (
          <>
            <div ref={homeRef} className="userPage">
              <div className="profileSection">
                <img src={userData.avatar || avatar} alt="User Avatar" className="userAvatar" />
                <h2>{userData.name}</h2>
                <div className="userDetails">
                  <p>性別：{userData.gender}</p>
                  <p>年齡：{userData.age}</p>
                  <p>教育程度：{userData.education}</p>
                  <p>同住者：{userData.coResidents}</p>
                  <p>就醫頻率：{userData.medicalFrequency}</p>
                  <p>使用者ID：{userData.id}</p>
                </div>
              </div>
              <div className="infoSection">
                <InfoBox title="憂鬱量表數據" onClick={() => handleClick(depressionRef, '憂鬱量表數據')} />
                <InfoBox title="服藥紀錄" onClick={() => handleClick(recordsRef, '服藥紀錄')} />
                <InfoBox title="情緒分析" onClick={() => handleClick(emotionRef, '情緒分析')} />
                <InfoBox title="個人資訊" onClick={() => handleClick(infoRef, '個人資訊')} />
              </div>
            </div>

            <div className="sectionContainer">
              <Section ref={depressionRef} title="憂鬱量表結果" backgroundColor="#D3C8BB" onSendClick={({ start, end }) => { 
                console.log(`憂鬱量表結果區塊: 開始時間: ${start} - 結束時間: ${end}`);
                setDepressionStartDate(start);
                setDepressionEndDate(end);
              }}>
                <DepressionScaleData sysUserId={sysUserId} startDate={depressionStartDate} endDate={depressionEndDate} />
              </Section>
              <Section ref={emotionRef} title="情緒分析結果" backgroundColor="#D3C8BB" onSendClick={({ start, end }) => { 
                console.log(`情緒分析區塊: 開始時間: ${start} - 結束時間: ${end}`);
                setEmotionStartDate(start);
                setEmotionEndDate(end);
              }}>
                <EmotionAnalysis sysUserId={sysUserId} startDate={emotionStartDate} endDate={emotionEndDate} />
              </Section>
              <Section ref={recordsRef} title="服藥紀錄" backgroundColor="#D3C8BB" onSendClick={({ start, end }) => {
                console.log(`服藥紀錄區塊: 開始時間: ${start} - 結束時間: ${end}`);
                setMedicationStartDate(start);
                setMedicationEndDate(end);
              }}>
                <MedicationRecords userId={userId} sysUserId={sysUserId} startDate={medicationStartDate} endDate={medicationEndDate} />
              </Section>
              <Section ref={infoRef} title="個人資訊" backgroundColor="#D3C8BB" showDatePickers={false} onSendClick={({ start, end }) => {
                console.log(`個人資訊區塊: 開始時間: ${start} - 結束時間: ${end}`);
              }}>
                <UserInfo userId={userId} sysUserId={sysUserId} />
              </Section>
            </div>
          </>
        ) : null}
      </div>
      <Footer  className="Footer"/>
    </div>
  );
}

export default LineLoginPage;
