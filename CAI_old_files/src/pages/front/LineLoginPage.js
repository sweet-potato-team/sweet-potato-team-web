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

  const styles = {
    userPage: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '80px 60px',
      backgroundColor: '#BFA286',
      color: 'white',
      minHeight: '100vh',
      boxSizing: 'border-box',
    },
    profileSection: {
      textAlign: 'center',
      flexBasis: '30%',
    },
    userAvatar: {
      borderRadius: '50%',
      width: '200px',
      height: '200px',
      objectFit: 'cover',
      marginBottom: '20px',
    },
    userDetails: {
      fontSize: '1em',
      lineHeight: '1.8',
      textAlign: 'left',
      margin: '0 auto',
      maxWidth: '200px',
    },
    infoSection: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridGap: '20px',
      flexBasis: '60%',
    },
    infoBox: {
      backgroundColor: 'white',
      color: '#574938',
      borderRadius: '10px',
      padding: '20px',
      textAlign: 'center',
      height: '300px',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: '4px 4px 6px rgba(0,0,0,0.2)',
    },
    infoBoxHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    },
    sectionContainer: {
      paddingTop: '40px',
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' , width: '100%' }}>
      <NavBar sectionRefs={{
        home: homeRef,
        depression: depressionRef,
        emotion: emotionRef,
        records: recordsRef,
        info: infoRef,
      }} />
      <div style={{ flex: 1 , width: '100%' }}>
        <Loading isLoading={isLoading} /> {/* 加載動畫 */}
        {!isLoading && userData ? (
          <>
            <div ref={homeRef} style={styles.userPage}>
              <div style={styles.profileSection}>
                <img src={userData.avatar || avatar} alt="User Avatar" style={styles.userAvatar} />
                <h2 style={{ fontWeight: 'bold' }}>{userData.name}</h2>
                <div style={styles.userDetails}>
                  <p>性別：{userData.gender}</p>
                  <p>年齡：{userData.age}</p>
                  <p>教育程度：{userData.education}</p>
                  <p>同住者：{userData.coResidents}</p>
                  <p>就醫頻率：{userData.medicalFrequency}</p>
                  <p>使用者ID：{userData.id}</p>
                </div>
              </div>
              <div style={styles.infoSection}>
                <InfoBox styles={styles} title="憂鬱量表數據" onClick={() => handleClick(depressionRef, '憂鬱量表數據')} />
                <InfoBox styles={styles} title="服藥紀錄" onClick={() => handleClick(recordsRef, '服藥紀錄')} />
                <InfoBox styles={styles} title="情緒分析" onClick={() => handleClick(emotionRef, '情緒分析')} />
                <InfoBox styles={styles} title="個人資訊" onClick={() => handleClick(infoRef, '個人資訊')} />
              </div>
            </div>

            <Section ref={depressionRef} title="憂鬱量表結果" backgroundColor="#D3C8BB" 
  onSendClick={({ start, end }) => { 
    console.log(`憂鬱量表結果區塊: 開始時間: ${start} - 結束時間: ${end}`);
    setDepressionStartDate(start); // 為憂鬱量表設置開始時間
    setDepressionEndDate(end); // 為憂鬱量表設置結束時間
  }}
>
  <DepressionScaleData sysUserId={sysUserId} startDate={depressionStartDate} endDate={depressionEndDate} />
</Section>


            <div style={styles.sectionContainer}>
              <Section ref={emotionRef} title="情緒分析結果" backgroundColor="#D3C8BB" 
                onSendClick={({ start, end }) => { 
                  console.log(`情緒分析區塊: 開始時間: ${start} - 結束時間: ${end}`);
                  setEmotionStartDate(start);
                  setEmotionEndDate(end);
                }}
              >
                <EmotionAnalysis sysUserId={sysUserId} startDate={emotionStartDate} endDate={emotionEndDate} />
              </Section>
            </div>



            <div style={styles.sectionContainer}>
              <Section ref={recordsRef} title="服藥紀錄" backgroundColor="#D3C8BB"
                onSendClick={({ start, end }) => {
                  console.log(`服藥紀錄區塊: 開始時間: ${start} - 結束時間: ${end}`);
                }}
              >
                <MedicationRecords userId={userId} sysUserId={sysUserId}/>
              </Section>
            </div>


            <div style={styles.sectionContainer} >
              <Section ref={infoRef} title="個人資訊" backgroundColor="#D3C8BB" showDatePickers={false}
                onSendClick={({ start, end }) => {
                  console.log(`個人資訊區塊: 開始時間: ${start} - 結束時間: ${end}`);
                }}
              >
                <UserInfo userId={userId} sysUserId={sysUserId} />
              </Section>
            </div>
          </>
        ) : null}
      </div>
      <Footer />
    </div>
  );
}

export default LineLoginPage;




// import React, { useEffect, useState, useRef  } from 'react';
// import NavBar from '../../components/homepage/NavBar';  
// import Footer from '../../components/homepage/Footer';  
// import Section from '../../components/Section';
// import DepressionScaleData from './DepressionScaleData'; 
// import EmotionAnalysis from './EmotionAnalysis'; 
// import MedicationRecords from './MedicationRecords'; 
// import UserInfo from './UserInfo'; 
// import { useNavigate } from 'react-router-dom';

// import InfoBox from '../../components/homepage/InfoBox';  
// import Loading from '../../components/Loading';  // 引入你自定義的 Loading 組件

// function LineLoginPage() {
//   const [userData, setUserData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);  // 新增 isLoading 狀態
//   const navigate = useNavigate();
//   const [avatar, setAvatar] = useState('');

//   const homeRef = useRef(null);
//   const depressionRef = useRef(null);
//   const emotionRef = useRef(null);
//   const recordsRef = useRef(null);
//   const infoRef = useRef(null);

//   const [userId, setUserId] = useState(null); // 新增状态用于存储 userId



//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const code = params.get('code');
  
//     if (code) {
//       fetch('http://localhost:8080/api/lineLogin/token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ code, redirectUri: 'http://localhost:3000/LineLoginPage' }),
//       })
//       .then(response => response.json())
//       .then(data => {
//         console.log("data.id : ", data.id);
//         setUserId(data.id); // 将 userId 设置为 data.id
//         return fetch(`http://localhost:8080/api/lineLogin/${data.id}`);
//       })
//       .then(response => response.json())
//       .then(userInfo => {
//         setUserData(userInfo);
//         console.log("userInfo.sysUserId : ", userInfo.sysUserId);
//         // 使用 navigate 进行路由跳转，确保 userId 作为参数被传递
//         navigate(`/LineLoginPage/${userInfo.sysUserId}`, { replace: true });

//         const basePath = '/images/';
//         let avatarPath = 'boy_young.png'; // Default
//         if (userInfo.gender === '女') {
//           avatarPath = userInfo.age > 40 ? 'girl_older.png' : 'girl_young.png';
//         } else {
//           avatarPath = userInfo.age > 40 ? 'man_older.png' : 'boy_young.png';
//         }
//         setAvatar(`${basePath}${avatarPath}`);
//       })
//       .finally(() => {
//         setIsLoading(false); // 当数据加载完成，设置 isLoading 为 false
//       })
//       .catch(error => console.error('Error:', error.message));
//     }
//   }, [navigate]);

  


//   const handleClick = (ref, sectionName) => {
//     console.log(`正在導航到區塊：${sectionName}`);
//     if (ref.current) {
//       ref.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   const styles = {
//     userPage: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '80px 60px',
//       backgroundColor: '#BFA286',
//       color: 'white',
//       minHeight: '100vh',
//       boxSizing: 'border-box',
//     },
//     profileSection: {
//       textAlign: 'center',
//       flexBasis: '30%',
//     },
//     userAvatar: {
//       borderRadius: '50%',
//       width: '200px',
//       height: '200px',
//       objectFit: 'cover',
//       marginBottom: '20px',
//     },
//     userDetails: {
//       fontSize: '1em',
//       lineHeight: '1.8',
//       textAlign: 'left',
//       margin: '0 auto',
//       maxWidth: '200px',
//     },
//     infoSection: {
//       display: 'grid',
//       gridTemplateColumns: '1fr 1fr',
//       gridGap: '20px',
//       flexBasis: '60%',
//     },
//     infoBox: {
//       backgroundColor: 'white',
//       color: '#574938',
//       borderRadius: '10px',
//       padding: '20px',
//       textAlign: 'center',
//       height: '300px',
//       cursor: 'pointer',
//       transition: 'transform 0.2s, box-shadow 0.2s',
//       boxShadow: '4px 4px 6px rgba(0,0,0,0.2)',
//     },
//     infoBoxHover: {
//       transform: 'scale(1.05)',
//       boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
//     },
//     sectionContainer: {
//       paddingTop: '40px',
//     },
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//       <NavBar sectionRefs={{
//         home: homeRef,
//         depression: depressionRef,
//         emotion: emotionRef,
//         records: recordsRef,
//         info: infoRef,
//       }} />
//       <div style={{ flex: 1 }}>
//         <Loading isLoading={isLoading} /> {/* 加載動畫 */}
//         {!isLoading && userData ? (
//           <>
//             <div ref={homeRef} style={styles.userPage}>
//               <div style={styles.profileSection}>
//                 <img src={userData.avatar || avatar} alt="User Avatar" style={styles.userAvatar} />
//                 <h2 style={{ fontWeight: 'bold' }}>{userData.name}</h2>
//                 <div style={styles.userDetails}>
//                   <p>性別：{userData.gender}</p>
//                   <p>年齡：{userData.age}</p>
//                   <p>教育程度：{userData.education}</p>
//                   <p>同住者：{userData.coResidents}</p>
//                   <p>就醫頻率：{userData.medicalFrequency}</p>
//                   <p>使用者ID：{userData.id}</p>
//                 </div>
//               </div>
//               <div style={styles.infoSection}>
//                 <InfoBox styles={styles} title="憂鬱量表數據" onClick={() => handleClick(depressionRef, '憂鬱量表數據')} />
//                 <InfoBox styles={styles} title="服藥紀錄" onClick={() => handleClick(recordsRef, '服藥紀錄')} />
//                 <InfoBox styles={styles} title="情緒分析" onClick={() => handleClick(emotionRef, '情緒分析')} />
//                 <InfoBox styles={styles} title="個人資訊" onClick={() => handleClick(infoRef, '個人資訊')} />
//               </div>
//             </div>

//             <div style={styles.sectionContainer}>
//               <Section ref={depressionRef} title="憂鬱量表結果" backgroundColor="#D3C8BB" 
//                 onSendClick={({ start, end }) => { 
//                   console.log(`憂鬱量表結果區塊: 開始時間: ${start} - 結束時間: ${end}`);
//                 }}
//               >
//                 <DepressionScaleData userId={userId}/>
//               </Section>
//             </div>

//             <div style={styles.sectionContainer}>
//               <Section ref={emotionRef} title="情緒分析結果" backgroundColor="#D3C8BB" 
//                 onSendClick={({ start, end }) => { 
//                   console.log(`情緒分析區塊: 開始時間: ${start} - 結束時間: ${end}`);
//                 }}
//               >
//                 <EmotionAnalysis userId={userId} />
//               </Section>
//             </div>

//             <div style={styles.sectionContainer}>
//               <Section ref={recordsRef} title="服藥紀錄" backgroundColor="#D3C8BB"
//                 onSendClick={({ start, end }) => {
//                   console.log(`服藥紀錄區塊: 開始時間: ${start} - 結束時間: ${end}`);
//                 }}
//               >
//                 <MedicationRecords userId={userId}/>
//               </Section>
//             </div>


//             <div style={styles.sectionContainer} >
//               <Section ref={infoRef} title="個人資訊" backgroundColor="#D3C8BB" showDatePickers={false}
//                 onSendClick={({ start, end }) => {
//                   console.log(`個人資訊區塊: 開始時間: ${start} - 結束時間: ${end}`);
//                 }}
//               >
//                 <UserInfo userId={userId} />
//               </Section>
//             </div>
//           </>
//         ) : null}
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default LineLoginPage;