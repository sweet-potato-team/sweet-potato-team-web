import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LineLoginPage() {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const code = params.get('code');
  
  //   if (code) {
  //     fetch('http://localhost:8080/api/lineLogin/token', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ code, redirectUri: 'http://localhost:3000/LineLoginPage' }),
  //     })
  //       .then(response => response.json())
  //       .then(data => {
  //         fetch(`http://localhost:8080/api/lineLogin/${data.id}`)
  //           .then(response => response.json())
  //           .then(userInfo => {
  //             console.log("User info before setting state:", userInfo); // 在這裡確認userInfo是否正確
  //             setUserData(userInfo);
  //             console.log("State after setting:", userData); // 確認狀態更新後的userData是否正確
            
  //           })
  //           .catch(error => console.error('Error fetching user info:', error));
  //       })
  //       .catch(error => console.error('Error fetching token:', error));
  //   }
  // }, [userData]);

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
          // 結合從LINE API獲取的資料和資料庫中的資料
          fetch(`http://localhost:8080/api/lineLogin/${data.id}`)
            .then(response => response.json())
            .then(userInfo => {
              // 添加來自LINE的資料
              userInfo.avatar = data.avatar; // 來自LINE的頭像URL
              // userInfo.name = data.name;     // 來自LINE的名字

              setUserData(userInfo);
            })
            .catch(error => console.error('Error fetching user info:', error));
        })
        .catch(error => console.error('Error fetching token:', error));
    }
}, []);


console.log("User data received:", userData);
console.log("User avatar URL:", userData.avatar); 

  const handleClick = (path) => {
    navigate(path);
  };

  const handleBackClick = () => {
    navigate('/admin'); // 假設管理頁面的路徑是 /admin，請根據實際路徑修改
  };

  const styles = {
    userPage: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '40px',
      backgroundColor: '#BFA286',
      color: 'white',
      height: '100vh',
      boxSizing: 'border-box',
    },
    backButton: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      padding: '10px 20px',
      backgroundColor: '#4C574C',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1em',
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
    userTitle: {
      fontSize: '1.5em',
      margin: '10px 0',
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
      height: '350px',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    infoBoxHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    },
    infoBoxTitle: {
      marginBottom: '10px',
      fontSize: '1.2em',
      fontWeight: 'bold',
    },
    infoBoxContent: {
      fontSize: '0.9em',
      color: '#666',
    },
  };

  return (
    <div style={styles.userPage}>
      <button style={styles.backButton} onClick={handleBackClick}>
        返回管理頁面
      </button>
      <div style={styles.profileSection}>
      <img src={userData.avatar} alt="User Avatar" style={styles.userAvatar} />
        <h2 style={{fontWeight:'bold'}}>{userData.name}</h2>
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
          onClick={() => handleClick('/depression-scale-data')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = styles.infoBoxHover.transform;
            e.currentTarget.style.boxShadow = styles.infoBoxHover.boxShadow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          <h3 style={styles.infoBoxTitle}>憂鬱量表數據</h3>
          <p style={styles.infoBoxContent}>顯示相關數據...</p>
        </div>
        <div
          style={styles.infoBox}
          onClick={() => handleClick('/medication-record')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = styles.infoBoxHover.transform;
            e.currentTarget.style.boxShadow = styles.infoBoxHover.boxShadow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          <h3 style={styles.infoBoxTitle}>服藥紀錄</h3>
          <p style={styles.infoBoxContent}>顯示相關紀錄...</p>
        </div>
        <div
          style={styles.infoBox}
          onClick={() => handleClick('/whisper-report')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = styles.infoBoxHover.transform;
            e.currentTarget.style.boxShadow = styles.infoBoxHover.boxShadow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          <h3 style={styles.infoBoxTitle}>悄悄話匯報</h3>
          <p style={styles.infoBoxContent}>顯示相關內容...</p>
        </div>
        <div
          style={styles.infoBox}
          onClick={() => handleClick('/other')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = styles.infoBoxHover.transform;
            e.currentTarget.style.boxShadow = styles.infoBoxHover.boxShadow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          <h3 style={styles.infoBoxTitle}>其他</h3>
          <p style={styles.infoBoxContent}>顯示其他資訊...</p>
        </div>
      </div>
    </div>
  );
}

export default LineLoginPage;
