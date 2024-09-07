import React, { useEffect, useState, useRef } from 'react';
import NavBar from '../../components/homepage/NavBar';  
import Footer from '../../components/homepage/Footer';  
import Section from '../../components/Section';
import DepressionScaleData from './DepressionScaleData'; 
import EmotionAnalysis from './EmotionAnalysis'; 
import MedicationRecords from './MedicationRecords'; 
import UserInfo from './UserInfo'; 
import { useNavigate } from 'react-router-dom';

function LineLoginPage() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // 使用 useRef 來引用區塊元素
  const homeRef = useRef(null);
  const depressionRef = useRef(null);
  const emotionRef = useRef(null);
  const recordsRef = useRef(null);
  const infoRef = useRef(null);

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
        .then(data => fetch(`http://localhost:8080/api/lineLogin/${data.id}`))
        .then(response => response.json())
        .then(userInfo => {
          setUserData(userInfo);
          navigate('/LineLoginPage', { replace: true });
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

  // 調整樣式以添加 padding 和適當的頁面佈局
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
      // padding: '80px 60px', // 加大 padding-top 保證標題不被遮住

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
      color: 'black',
      borderRadius: '10px',
      padding: '20px',
      textAlign: 'center',
      height: '300px',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    sectionContainer: {
      paddingTop: '40px', // 在每個 section 增加 padding
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar sectionRefs={{
        home: homeRef,
        depression: depressionRef,
        emotion: emotionRef,
        records: recordsRef,
        info: infoRef,
      }} />
      <div style={{ flex: 1 }}>
        {userData ? (
          <>
            {/* 使用 homeRef 引用這個主頁部分 */}
            <div ref={homeRef} style={styles.userPage}>
              <div style={styles.profileSection}>
                <img src={userData.avatar} alt="User Avatar" style={styles.userAvatar} />
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
                <div
                  style={styles.infoBox}
                  onClick={() => handleClick(depressionRef, '憂鬱量表數據')}
                >
                  <h3>憂鬱量表數據</h3>
                </div>
                <div
                  style={styles.infoBox}
                  onClick={() => handleClick(recordsRef, '服藥紀錄')}
                >
                  <h3>服藥紀錄</h3>
                </div>
                <div
                  style={styles.infoBox}
                  onClick={() => handleClick(emotionRef, '情緒分析')}
                >
                  <h3>情緒分析</h3>
                </div>
                <div
                  style={styles.infoBox}
                  onClick={() => handleClick(infoRef, '個人資訊')}
                >
                  <h3>個人資訊</h3>
                </div>
              </div>
            </div>

            {/* 每個 Section 上方增加 padding */}
            <div style={styles.sectionContainer}>
              <Section ref={depressionRef} title="憂鬱量表結果" backgroundColor="#D3C8BB">
                <DepressionScaleData />
              </Section>
            </div>

            <div style={styles.sectionContainer}>
              <Section ref={emotionRef} title="情緒分析結果" backgroundColor="#EFEBE6">
                <EmotionAnalysis />
              </Section>
            </div>

            <div style={styles.sectionContainer}>
              <Section ref={recordsRef} title="服藥紀錄" backgroundColor="#D3C8BB">
                <MedicationRecords />
              </Section>
            </div>

            <div style={styles.sectionContainer}>
              <Section ref={infoRef} title="個人資訊" backgroundColor="#EFEBE6">
                <UserInfo />
              </Section>
            </div>
          </>
        ) : (
          <p>正在加載使用者資料...</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default LineLoginPage;




// import React, { useEffect, useState, useRef } from 'react';
// import NavBar from '../../components/homepage/NavBar';  
// import Footer from '../../components/homepage/Footer';  
// import Section from '../../components/Section';
// import DepressionScaleData from './DepressionScaleData'; 
// import EmotionAnalysis from './EmotionAnalysis'; 
// import MedicationRecords from './MedicationRecords'; 
// import UserInfo from './UserInfo'; 
// import { useNavigate } from 'react-router-dom';

// function LineLoginPage() {
//   const [userData, setUserData] = useState(null);
//   const navigate = useNavigate();

//   // 使用 useRef 來引用區塊元素
//   const homeRef = useRef(null);
//   const depressionRef = useRef(null);
//   const emotionRef = useRef(null);
//   const recordsRef = useRef(null);
//   const infoRef = useRef(null);

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
//         .then(response => response.json())
//         .then(data => fetch(`http://localhost:8080/api/lineLogin/${data.id}`))
//         .then(response => response.json())
//         .then(userInfo => {
//           setUserData(userInfo);
//           navigate('/LineLoginPage', { replace: true });
//         })
//         .catch(error => console.error('Error:', error.message));
//     }
//   }, [navigate]);

//   const handleClick = (ref, sectionName) => {
//     console.log(`正在導航到區塊：${sectionName}`);
//     if (ref.current) {
//       ref.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   // 將原先 Homepage 的樣式提取到這裡
//   const styles = {
//     userPage: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '40px',
//       backgroundColor: '#BFA286',
//       color: 'white',
//       height: '100vh',
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
//       color: 'black',
//       borderRadius: '10px',
//       padding: '20px',
//       textAlign: 'center',
//       height: '350px',
//       cursor: 'pointer',
//       transition: 'transform 0.2s, box-shadow 0.2s',
//       boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
//         {userData ? (
//           <>
//             {/* 使用 homeRef 引用這個主頁部分 */}
//             <div ref={homeRef} style={styles.userPage}>
//               <div style={styles.profileSection}>
//                 <img src={userData.avatar} alt="User Avatar" style={styles.userAvatar} />
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
//                 {/* 憂鬱量表數據區塊 */}
//                 <div
//                   style={styles.infoBox}
//                   onClick={() => handleClick(depressionRef, '憂鬱量表數據')}
//                 >
//                   <h3>憂鬱量表數據</h3>
//                 </div>

//                 {/* 服藥紀錄區塊 */}
//                 <div
//                   style={styles.infoBox}
//                   onClick={() => handleClick(recordsRef, '服藥紀錄')}
//                 >
//                   <h3>服藥紀錄</h3>
//                 </div>

//                 {/* 情緒分析區塊 */}
//                 <div
//                   style={styles.infoBox}
//                   onClick={() => handleClick(emotionRef, '情緒分析')}
//                 >
//                   <h3>情緒分析</h3>
//                 </div>

//                 {/* 個人資訊區塊 */}
//                 <div
//                   style={styles.infoBox}
//                   onClick={() => handleClick(infoRef, '個人資訊')}
//                 >
//                   <h3>個人資訊</h3>
//                 </div>
//               </div>
//             </div>

//             <Section ref={depressionRef} title="憂鬱量表結果" backgroundColor="#D3C8BB">
//               <DepressionScaleData />
//             </Section>

//             <Section ref={emotionRef} title="情緒分析結果" backgroundColor="#EFEBE6">
//               <EmotionAnalysis />
//             </Section>

//             <Section ref={recordsRef} title="服藥紀錄" backgroundColor="#D3C8BB">
//               <MedicationRecords />
//             </Section>

//             <Section ref={infoRef} title="個人資訊" backgroundColor="#EFEBE6">
//               <UserInfo />
//             </Section>
//           </>
//         ) : (
//           <p>正在加載使用者資料...</p>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default LineLoginPage;


// import React, { useEffect, useState, useRef } from 'react';
// import NavBar from '../../components/homepage/NavBar';  
// import Footer from '../../components/homepage/Footer';  
// import Section from '../../components/Section';
// import DepressionScaleData from './DepressionScaleData'; 
// import EmotionAnalysis from './EmotionAnalysis'; 
// import MedicationRecords from './MedicationRecords'; 
// import UserInfo from './UserInfo'; 
// import { useNavigate } from 'react-router-dom';

// function LineLoginPage() {
//   const [userData, setUserData] = useState(null);
//   const navigate = useNavigate();

//   // 使用 useRef 來引用區塊元素
//   const homeRef = useRef(null); // 為主頁設置 ref
//   const depressionRef = useRef(null);
//   const emotionRef = useRef(null);
//   const recordsRef = useRef(null);
//   const infoRef = useRef(null);

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
//         .then(response => response.json())
//         .then(data => fetch(`http://localhost:8080/api/lineLogin/${data.id}`))
//         .then(response => response.json())
//         .then(userInfo => {
//           setUserData(userInfo);
//           navigate('/LineLoginPage', { replace: true });
//         })
//         .catch(error => console.error('Error:', error.message));
//     }
//   }, [navigate]);

//   const handleClick = (ref, sectionName) => {
//     console.log(`正在導航到區塊：${sectionName}`);
//     if (ref.current) {
//       ref.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//       <NavBar sectionRefs={{
//         home: homeRef, // 將主頁的 ref 傳給 NavBar
//         depression: depressionRef,
//         emotion: emotionRef,
//         records: recordsRef,
//         info: infoRef,
//       }} />
//       <div style={{ flex: 1 }}>
//         {userData ? (
//           <>
//             {/* 使用 homeRef 引用這個主頁部分 */}
//             <div ref={homeRef} style={{ padding: '40px', backgroundColor: '#BFA286', color: 'white' }}>
//               <h2>{userData.name}</h2>
//               <p>性別：{userData.gender}</p>
//               <p>年齡：{userData.age}</p>
//               <button onClick={() => handleClick(depressionRef, '憂鬱量表數據')}>憂鬱量表數據</button>
//               <button onClick={() => handleClick(recordsRef, '服藥紀錄')}>服藥紀錄</button>
//               <button onClick={() => handleClick(emotionRef, '情緒分析')}>情緒分析</button>
//               <button onClick={() => handleClick(infoRef, '個人資訊')}>個人資訊</button>
//             </div>

//             <Section ref={depressionRef} title="憂鬱量表結果" backgroundColor="#D3C8BB">
//               <DepressionScaleData />
//             </Section>

//             <Section ref={emotionRef} title="情緒分析結果" backgroundColor="#EFEBE6">
//               <EmotionAnalysis />
//             </Section>

//             <Section ref={recordsRef} title="服藥紀錄" backgroundColor="#D3C8BB">
//               <MedicationRecords />
//             </Section>

//             <Section ref={infoRef} title="個人資訊" backgroundColor="#EFEBE6">
//               <UserInfo />
//             </Section>
//           </>
//         ) : (
//           <p>正在加載使用者資料...</p>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default LineLoginPage;


// import React, { useEffect, useState, useRef } from 'react';
// import NavBar from '../../components/homepage/NavBar';  
// import Footer from '../../components/homepage/Footer';  
// import Section from '../../components/Section';
// import DepressionScaleData from './DepressionScaleData'; 
// import EmotionAnalysis from './EmotionAnalysis'; 
// import MedicationRecords from './MedicationRecords'; 
// import UserInfo from './UserInfo'; 
// import { useNavigate } from 'react-router-dom';

// function LineLoginPage() {
//   const [userData, setUserData] = useState(null);
//   const navigate = useNavigate();

//   // 使用 useRef 來引用區塊元素
//   const homeRef = useRef(null);
//   const depressionRef = useRef(null);
//   const emotionRef = useRef(null);
//   const recordsRef = useRef(null);
//   const infoRef = useRef(null);


//     // 使用 ref 來滾動到指定區域
//     const handleClick = (ref, sectionName) => {
//       console.log(`正在導航到區塊：${sectionName}`);
//       if (ref.current) {
//         console.log(`觸發滑動到 ${sectionName} 區塊`);
//         ref.current.scrollIntoView({ behavior: 'smooth' });
//       } else {
//         console.log(`找不到區塊：${sectionName}`);
//       }
//     };
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
//         .then(response => response.json())
//         .then(data => fetch(`http://localhost:8080/api/lineLogin/${data.id}`))
//         .then(response => response.json())
//         .then(userInfo => {
//           setUserData(userInfo);
//           navigate('/LineLoginPage', { replace: true });
//         })
//         .catch(error => console.error('Error:', error.message));
//     }
//   }, [navigate]);

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//       {/* 將各個區塊的 refs 傳遞給 NavBar */}
//       <NavBar sectionRefs={{
//         home: homeRef,
//         depression: depressionRef,
//         emotion: emotionRef,
//         records: recordsRef,
//         info: infoRef,
//       }} />
//       <div style={{ flex: 1 }}>
//         {userData ? (
//           <>
//             {/* <Section ref={homeRef} title="主頁" backgroundColor="#F0F0F0">
//               <h2>主頁內容</h2>
//             </Section> */}
//             <div style={{ padding: '40px', backgroundColor: '#BFA286', color: 'white' }}>
//               <h2>{userData.name}</h2>
//               <p>性別：{userData.gender}</p>
//               <p>年齡：{userData.age}</p>
//               <button onClick={() => handleClick(depressionRef, '憂鬱量表數據')}>憂鬱量表數據</button>
//               <button onClick={() => handleClick(recordsRef, '服藥紀錄')}>服藥紀錄</button>
//               <button onClick={() => handleClick(emotionRef, '情緒分析')}>情緒分析</button>
//               <button onClick={() => handleClick(infoRef, '個人資訊')}>個人資訊</button>
//             </div>


//             <Section ref={depressionRef} title="憂鬱量表結果" backgroundColor="#D3C8BB">
//               <DepressionScaleData />
//             </Section>

//             <Section ref={emotionRef} title="情緒分析結果" backgroundColor="#EFEBE6">
//               <EmotionAnalysis />
//             </Section>

//             <Section ref={recordsRef} title="服藥紀錄" backgroundColor="#D3C8BB">
//               <MedicationRecords />
//             </Section>

//             <Section ref={infoRef} title="個人資訊" backgroundColor="#EFEBE6">
//               <UserInfo />
//             </Section>
//           </>
//         ) : (
//           <p>正在加載使用者資料...</p>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default LineLoginPage;








// import React, { useEffect, useState } from 'react';
// import NavBar from '../../components/homepage/NavBar';  
// import Footer from '../../components/homepage/Footer';  
// import Section from '../../components/Section';
// import Homepage from './Homepage'; 
// import DepressionScaleData from './DepressionScaleData'; 
// import EmotionAnalysis from './EmotionAnalysis'; 
// import MedicationRecords from './MedicationRecords'; 
// import UserInfo from './UserInfo'; 

// function LineLoginPage() {
//   const [userData, setUserData] = useState(null);

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
//         .then(response => response.json())
//         .then(data => fetch(`http://localhost:8080/api/lineLogin/${data.id}`))
//         .then(response => response.json())
//         .then(userInfo => {
//           setUserData(userInfo);
//         })
//         .catch(error => console.error('Error:', error.message));
//     }
//   }, []);

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//       <NavBar />
//       <div style={{ flex: 1 }}>
//         {userData ? (
//           <>
//             <Homepage userData={userData} sysUserId={userData.sysUserId} />

//             <Section id="depression-section" title="憂鬱量表結果" backgroundColor="#D3C8BB">
//               <DepressionScaleData />
//             </Section>

//             <Section id="emotion-section" title="情緒分析結果" backgroundColor="#EFEBE6">
//               <EmotionAnalysis />
//             </Section>

//             <Section id="records-section" title="服藥紀錄" backgroundColor="#D3C8BB">
//               <MedicationRecords />
//             </Section>

//             <Section id="info-section" title="個人資訊" backgroundColor="#EFEBE6">
//               <UserInfo />
//             </Section>
//           </>
//         ) : (
//           <p>正在加載使用者資料...</p>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default LineLoginPage;


















// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import NavBar from '../../components/homepage/NavBar';  
// import Footer from '../../components/homepage/Footer';  
// import Section from '../../components/Section';
// import Homepage from './Homepage'; // 這是你 Home 的子頁面
// import DepressionScaleData from './DepressionScaleData'; // 憂鬱量表結果頁面
// import EmotionAnalysis from './EmotionAnalysis'; // 情緒分析頁面
// import MedicationRecords from './MedicationRecords'; // 服藥紀錄頁面
// import UserInfo from './UserInfo'; // 個人資訊頁面



// function LineLoginPage() {
//   const [userData, setUserData] = useState(null); // 使用 userData 來儲存 LINE 使用者資料
//   const navigate = useNavigate();

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const code = params.get('code');
  
//     console.log("Received code from URL params:", code); // Log 獲取的 code
  
//     if (code) {
//       // 發送請求以獲取 token
//       fetch('http://localhost:8080/api/lineLogin/token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ code, redirectUri: 'http://localhost:3000/LineLoginPage' }),
//       })
//         .then(response => {
//           console.log("Token request response status:", response.status); // Log token 請求的回應狀態
//           if (!response.ok) {
//             throw new Error('Failed to fetch token from LINE API');
//           }
//           return response.json();
//         })
//         .then(data => {
//           console.log("Received data from token request:", data); // Log 獲取的 token data
//           if (!data.id) {
//             throw new Error('No user ID returned from LINE API');
//           }
  
//           // 發送請求以獲取 user info
//           return fetch(`http://localhost:8080/api/lineLogin/${data.id}`);
//         })
//         .then(response => {
//           console.log("User info request response status:", response.status); // Log user info 請求的回應狀態
//           if (!response.ok) {
//             throw new Error('Failed to fetch user info');
//           }
//           return response.json();
//         })
//         .then(userInfo => {
//           console.log("Received user info:", userInfo); // Log 獲取的 userInfo
//           console.log("【檢查是否有 sysUserId】:", userInfo.sysUserId);  // 檢查是否有 sysUserId
  
//           if (!userInfo) {
//             throw new Error('User info is empty');
//           }
  
//           userInfo.avatar = userInfo.avatar || ''; // 假設回應中有 avatar
//           setUserData(userInfo); // 儲存使用者資料
  
//           // 進行路由導航
//           if (userInfo.sysUserId) {
//             navigate(`/LineLoginPage/${userInfo.sysUserId}/Home`);
//           } else {
//             console.log("Received user info:", userInfo);
//             console.log("sysUserId:", userInfo.sysUserId);  // 檢查是否獲取到 sysUserId
  
//             console.error("No sysUserId in userInfo");
//           }
//         })
//         .catch(error => {
//           console.error('Error:', error.message); // 輸出錯誤訊息
//         });
//     } else {
//       console.log("No code present in URL params.");
//     }
//   }, [navigate]);


//   return (



//     <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//       <NavBar />
//       <div style={{ flex: 1 }}>
//         {userData ? (
//           <>

//           <Homepage userData={userData} />


//             <Section title="憂鬱量表結果" backgroundColor="#D3C8BB">
//               <DepressionScaleData /> {/* 放入 DepressionScaleData 子頁面 */}
//             </Section>

//             <Section title="情緒分析結果" backgroundColor="#EFEBE6">
//               <EmotionAnalysis /> {/* 放入 EmotionAnalysis 子頁面 */}
//             </Section>

//             <Section title="服藥紀錄" backgroundColor="#D3C8BB">
//               <MedicationRecords /> {/* 放入 MedicationRecords 子頁面 */}
//             </Section>

//             <Section title="個人資訊" backgroundColor="#EFEBE6">
//               <UserInfo /> {/* 放入 UserInfo 子頁面 */}
//             </Section>
//           </>
//         ) : (
//           <p>正在加載使用者資料...</p>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );

//   // return (
//   //   <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//   //     <NavBar />
//   //     <div style={{ flex: 1 }}>
//   //       {/* 顯示子路由對應的內容 */}
//   //       {userData ? <Outlet /> : <p>正在加載使用者資料...</p>}
//   //     </div>
//   //     <Footer />
//   //   </div>
//   // );
// }

// export default LineLoginPage;

















// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function LineLoginPage() {
//   const [userData, setUserData] = useState({});
//   const navigate = useNavigate();

//   // useEffect(() => {
//   //   const params = new URLSearchParams(window.location.search);
//   //   const code = params.get('code');
  
//   //   if (code) {
//   //     fetch('http://localhost:8080/api/lineLogin/token', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify({ code, redirectUri: 'http://localhost:3000/LineLoginPage' }),
//   //     })
//   //       .then(response => response.json())
//   //       .then(data => {
//   //         fetch(`http://localhost:8080/api/lineLogin/${data.id}`)
//   //           .then(response => response.json())
//   //           .then(userInfo => {
//   //             console.log("User info before setting state:", userInfo); // 在這裡確認userInfo是否正確
//   //             setUserData(userInfo);
//   //             console.log("State after setting:", userData); // 確認狀態更新後的userData是否正確
            
//   //           })
//   //           .catch(error => console.error('Error fetching user info:', error));
//   //       })
//   //       .catch(error => console.error('Error fetching token:', error));
//   //   }
//   // }, [userData]);

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
//         .then(response => response.json())
//         .then(data => {
//           // 結合從LINE API獲取的資料和資料庫中的資料
//           fetch(`http://localhost:8080/api/lineLogin/${data.id}`)
//             .then(response => response.json())
//             .then(userInfo => {
//               // 添加來自LINE的資料
//               userInfo.avatar = data.avatar; // 來自LINE的頭像URL
//               // userInfo.name = data.name;     // 來自LINE的名字

//               setUserData(userInfo);
//             })
//             .catch(error => console.error('Error fetching user info:', error));
//         })
//         .catch(error => console.error('Error fetching token:', error));
//     }
// }, []);


// console.log("User data received:", userData);
// console.log("User avatar URL:", userData.avatar); 

//   const handleClick = (path) => {
//     navigate(path);
//   };

//   const handleBackClick = () => {
//     navigate('/admin'); // 假設管理頁面的路徑是 /admin，請根據實際路徑修改
//   };

//   const styles = {
//     userPage: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '40px',
//       backgroundColor: '#BFA286',
//       color: 'white',
//       height: '100vh',
//       boxSizing: 'border-box',
//     },
//     backButton: {
//       position: 'absolute',
//       top: '20px',
//       left: '20px',
//       padding: '10px 20px',
//       backgroundColor: '#4C574C',
//       color: 'white',
//       border: 'none',
//       borderRadius: '5px',
//       cursor: 'pointer',
//       fontSize: '1em',
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
//     userTitle: {
//       fontSize: '1.5em',
//       margin: '10px 0',
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
//       color: 'black',
//       borderRadius: '10px',
//       padding: '20px',
//       textAlign: 'center',
//       height: '350px',
//       cursor: 'pointer',
//       transition: 'transform 0.2s, box-shadow 0.2s',
//       boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//     },
//     infoBoxHover: {
//       transform: 'scale(1.05)',
//       boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
//     },
//     infoBoxTitle: {
//       marginBottom: '10px',
//       fontSize: '1.2em',
//       fontWeight: 'bold',
//     },
//     infoBoxContent: {
//       fontSize: '0.9em',
//       color: '#666',
//     },
//   };

//   return (
//     <div style={styles.userPage}>
//       <button style={styles.backButton} onClick={handleBackClick}>
//         返回管理頁面
//       </button>
//       <div style={styles.profileSection}>
//       <img src={userData.avatar} alt="User Avatar" style={styles.userAvatar} />
//         <h2 style={{fontWeight:'bold'}}>{userData.name}</h2>
//         <div style={styles.userDetails}>
//           <p>性別：{userData.gender}</p>
//           <p>年齡：{userData.age}</p>
//           <p>教育程度：{userData.education}</p>
//           <p>同住者：{userData.coResidents}</p>
//           <p>就醫頻率：{userData.medicalFrequency}</p>
//           <p>使用者ID：{userData.id}</p>
//         </div>
//       </div>
//       <div style={styles.infoSection}>
//         <div
//           style={styles.infoBox}
//           onClick={() => handleClick('/depression-scale-data')}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.transform = styles.infoBoxHover.transform;
//             e.currentTarget.style.boxShadow = styles.infoBoxHover.boxShadow;
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.transform = 'none';
//             e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
//           }}
//         >
//           <h3 style={styles.infoBoxTitle}>憂鬱量表數據</h3>
//           <p style={styles.infoBoxContent}>顯示相關數據...</p>
//         </div>
//         <div
//           style={styles.infoBox}
//           onClick={() => handleClick('/medication-record')}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.transform = styles.infoBoxHover.transform;
//             e.currentTarget.style.boxShadow = styles.infoBoxHover.boxShadow;
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.transform = 'none';
//             e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
//           }}
//         >
//           <h3 style={styles.infoBoxTitle}>服藥紀錄</h3>
//           <p style={styles.infoBoxContent}>顯示相關紀錄...</p>
//         </div>
//         <div
//           style={styles.infoBox}
//           onClick={() => handleClick('/whisper-report')}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.transform = styles.infoBoxHover.transform;
//             e.currentTarget.style.boxShadow = styles.infoBoxHover.boxShadow;
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.transform = 'none';
//             e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
//           }}
//         >
//           <h3 style={styles.infoBoxTitle}>悄悄話匯報</h3>
//           <p style={styles.infoBoxContent}>顯示相關內容...</p>
//         </div>
//         <div
//           style={styles.infoBox}
//           onClick={() => handleClick('/other')}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.transform = styles.infoBoxHover.transform;
//             e.currentTarget.style.boxShadow = styles.infoBoxHover.boxShadow;
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.transform = 'none';
//             e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
//           }}
//         >
//           <h3 style={styles.infoBoxTitle}>其他</h3>
//           <p style={styles.infoBoxContent}>顯示其他資訊...</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LineLoginPage;
