import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: '',   
    password: '',
  });
  
  const [loginState, setLoginState] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/users/login', data);
      const { token } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(new Date().getTime() + 3600 * 1000).toUTCString()};`;
  
      if (res.data.success) {
        navigate('/admin');
      } else {
        setLoginState({ message: '登入失敗，請重試。' });
      }
    } catch (error) {
      setLoginState(error.response?.data || { message: '登入時發生錯誤，請稍後再試。' });
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div 
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
      }}
    >
      <i 
        className="bi bi-caret-left-fill" 
        onClick={handleBack}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: '#EFEBE6', // 更改為 #705E48
          fontSize: '24px',
          cursor: 'pointer',
          fontStyle: 'normal'
        }}
      >
        Back
      </i>

      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://i.imgur.com/vpXJVS3.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px)',
          zIndex: -1,
        }}
      />

      <div
        className='p-5'
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          width: '500px',
          textAlign: 'center',
        }}
      >
        <h2 className="fw-bold" style={{ fontSize: '2.5rem', color: '#705E48', marginBottom: '40px' }}> {/* 更改為 #705E48 */}
          管理員帳號登入
        </h2>

        {/* Render the login error message conditionally */}
        <div
          className={`alert alert-danger ${loginState.message ? 'd-block' : 'd-none'}`}
          role='alert'
          style={{ fontSize: '1rem', color: '#AC6A6A', marginBottom: '20px' }}
        >
          {loginState.message}
        </div>

        {/* Email and Password Input Fields */}
        <div className='mb-4 d-flex align-items-center'>
          <label htmlFor='email' className='form-label' style={{ textAlign: 'left', fontSize: '1.2rem', fontWeight: 'bold', color: '#705E48', marginRight: '10px', width: '80px' }}> {/* 更改為 #705E48 */}
            帳號：
          </label>
          <input
            id='email'
            className='form-control'
            name='email'
            type='email'
            placeholder='請輸入帳號'
            onChange={handleChange}
            style={{ flex: 1, padding: '10px', fontSize: '1rem' }}
          />
        </div>
        <div className='mb-5 d-flex align-items-center'>
          <label htmlFor='password' className='form-label' style={{ textAlign: 'left', fontSize: '1.2rem', fontWeight: 'bold', color: '#705E48', marginRight: '10px', width: '80px' }}> {/* 更改為 #705E48 */}
            密碼：
          </label>
          <input
            type='password'
            className='form-control'
            name='password'
            id='password'
            placeholder='請輸入密碼'
            onChange={handleChange}
            style={{ flex: 1, padding: '10px', fontSize: '1rem' }}
          />
        </div>

        {/* Submit Button */}
        <button
          type='button'
          className='btn'
          onClick={submit}
          style={{
            width: '100%',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            backgroundColor: '#EFEBE6', // 更改背景顏色為 #EFEBE6
            color: '#705E48', // 更改文字顏色為 #705E48
            borderRadius: '10px',
            padding: '12px',
            transition: 'background-color 0.3s, color 0.3s',
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#705E48'; // 滑鼠懸停時背景色變為 #705E48
            e.target.style.color = '#EFEBE6'; // 滑鼠懸停時文字顏色變為 #EFEBE6
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#EFEBE6'; // 滑鼠離開時恢復背景顏色
            e.target.style.color='#705E48'; // 滑鼠離開時恢復文字顏色
          }}
        >
          登入
        </button>
      </div>
    </div>
  );
}

export default Login;
