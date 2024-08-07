import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate() //轉址登入後進到後台
  const [data, setData] = useState({
    username: '',
    password: '',
  });
  const [loginState, setLoginState] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setData({ ...data, [name]: value });
    console.log(data);
  };

  //api的發送
  const submit = async (e) => {
    try {
      const res = await axios.post('/v2/admin/signin', data);//api路徑+資料
      const { token, expired } = res.data;
      console.log(res.data);
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      // 儲存 Token
      if (res.data.success) {
        navigate('/admin/products')
      }
    } catch (error) {
      setLoginState(error.response.data);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('https://plus.unsplash.com/premium_photo-1665203421659-09089ede4ffa?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backgroundBlendMode: 'overlay', // 背景混合模式
        height: '100vh', // 高度设置为100vh以填充整个网页
        display: 'flex',
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        className='p-4'
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          width: '400px', // 固定宽度以确保元素居中
          textAlign: 'center',
        }}
      >
        <h2 className="fw-bold">管理員帳號登入帳號</h2>

        <div
          className={`alert alert-danger ${loginState.message ? 'd-block' : 'd-none'}`}
          role='alert'
        >
          {loginState.message}
        </div>
        <div className='mb-3'>
          <label htmlFor='email' className='form-label w-100' style={{textAlign:'left'}}>
            帳號：
            <input
              id='email'
              className='form-control'
              name='username'
              type='email'
              placeholder='請輸入帳號'
              borderRadius= '0.5 rem'
              onChange={handleChange}
              style={{ width: '100%' }} // 使输入框宽度填充整个表单
            />
          </label>
        </div>
        <div className='mb-3'>
          <label htmlFor='password' className='form-label w-100' style={{textAlign:'left'}}>
            密碼：
            <input
              type='password'
              className='form-control'
              name='password'
              id='password'
              placeholder='請輸入密碼'
              onChange={handleChange}
              style={{ width: '100%' }} // 使输入框宽度填充整个表单
            />
          </label>
        </div>
        <button
          type='button'
          className='btn btn-primary'
          onClick={submit}
          style={{ width: '100%' , fontSize: 'larger',  fontWeight: 'bold', color:'white'}} // 使按钮宽度填充整个表单
        >
          登入
        </button>
      </div>
    </div>
  );
}

export default Login;