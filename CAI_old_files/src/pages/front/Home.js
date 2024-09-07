import React from 'react';
import LineLoginButton from '../../components/LineLoginButton';

function Home() {
  const handleLineLogin = () => {
    const clientId = '2004253998';
    const redirectUri = 'http://localhost:3000/LineLoginPage';
    let link = 'https://access.line.me/oauth2/v2.1/authorize?';
    link += 'response_type=code';
    link += `&client_id=${clientId}`;
    link += `&redirect_uri=${redirectUri}`;
    link += '&state=login';
    link += '&scope=profile%20openid';
    window.location.href = link;
  };

  const backgroundStyle = {
    backgroundImage: 'url(https://i.imgur.com/7WAozhs.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',  // 設定背景填滿視窗高度
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  return (
    <div style={backgroundStyle}>
      <LineLoginButton onClick={handleLineLogin} />
    </div>
  );
}

export default Home;
