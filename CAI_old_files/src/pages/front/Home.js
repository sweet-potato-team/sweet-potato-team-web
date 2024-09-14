import React from 'react';
import LineLoginButton from '../../components/LineLoginButton';

function Home() {
  const handleLineLogin = () => {
    const clientId = '2006291751';
    const redirectUri = 'http://localhost:3000/LineLoginPage';
    let link = 'https://access.line.me/oauth2/v2.1/authorize?';
    link += 'response_type=code';
    link += `&client_id=${clientId}`;
    link += `&redirect_uri=${redirectUri}`;
    link += '&state=login';
    link += '&scope=profile%20openid';
    window.location.href = link;
  };

  // 背景樣式
  const backgroundStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url(https://i.imgur.com/6Ej09iM.jpeg)',
    filter: 'blur(2px)',  // 只對背景應用模糊
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: -1,  // 將背景放到最底層
  };

  // 按鈕容器樣式，讓按鈕保持清晰
  const buttonContainerStyle = {
    position: 'relative',  // 保證按鈕位於背景之上
    zIndex: 1,  // 提升按鈕的層級，使其位於模糊背景之上
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',  // 讓按鈕居中顯示
  };

  return (
    <div>
      {/* 背景 */}
      <div style={backgroundStyle}></div>

      {/* 按鈕容器 */}
      <div style={buttonContainerStyle}>
        <LineLoginButton onClick={handleLineLogin} />
      </div>
    </div>
  );
}

export default Home;

// import React from 'react';
// import LineLoginButton from '../../components/LineLoginButton';

// function Home() {
//   const handleLineLogin = () => {
//     const clientId = '2006291751';
//     const redirectUri = 'http://localhost:3000/LineLoginPage';
//     let link = 'https://access.line.me/oauth2/v2.1/authorize?';
//     link += 'response_type=code';
//     link += `&client_id=${clientId}`;
//     link += `&redirect_uri=${redirectUri}`;
//     link += '&state=login';
//     link += '&scope=profile%20openid';
//     window.location.href = link;
//   };

//   const backgroundStyle = {
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundImage: 'url(https://i.imgur.com/6Ej09iM.jpeg)',
//     filter: 'blur(2px)',
//     backgroundSize: 'cover',
//     backgroundPosition: 'center',
//     height: '100vh',  // 設定背景填滿視窗高度
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center'
//   };



//   return (
//     <div style={backgroundStyle}>
//       <LineLoginButton onClick={handleLineLogin} />
//     </div>
//   );
// }

// export default Home;
