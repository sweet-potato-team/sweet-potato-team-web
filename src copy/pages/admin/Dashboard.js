import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useReducer, useState } from 'react';
import Message from '../../components/Message';
import { MessageContext, messageReducer, initState } from '../../store/messageStore';

function Dashboard() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(messageReducer, initState);
  const [token, setToken] = useState(null);

  const logout = () => {
    document.cookie = 'hexToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT'; // 清除 token
    navigate('/login');
  };

  useEffect(() => {
    const cookieToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('hexToken='))
      ?.split('=')[1];
    
    if (cookieToken) {
      setToken(cookieToken);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!token) return;
  
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    (async () => {
      try {
        const response = await axios.post('http://localhost:8080/users/check', {}, { headers });
        if (response.data.isValid) {
          navigate('/admin/spaces'); // 僅在成功驗證後跳轉
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate('/login');
        }
      }
    })();
  }, [token, navigate]); // 在這裡添加 navigate
  
  return (
    <MessageContext.Provider value={[state, dispatch]}>
      <Message />
      <nav className='navbar navbar-expand-lg bg-dark'>
        <div className='container-fluid'>
          <p className='text-white mb-0' style={{ fontWeight: 'bold', fontSize: '28px' }}>
            <i className="bi bi-house-gear">  </i>
            產學營運中心空間租借系統後台管理系統
          </p>
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarNav'
            aria-controls='navbarNav'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon' />
          </button>
          <div
            className='collapse navbar-collapse justify-content-end'
            id='navbarNav'
          >
            <ul className='navbar-nav'>
              <li className='nav-item'>
                <button
                  type='button'
                  className='btn btn-sm btn-light'
                  onClick={logout}
                >
                  登出
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className='d-flex' style={{ minHeight: 'calc(100vh - 56px)' }}>
        <div className='bg-light' style={{ width: '200px' }}>
          <ul className='list-group list-group-flush'>
            <NavLink
              className='list-group-item list-group-item-action py-3'
              to='/admin/spaces'
            >
              <i className='bi bi-door-open me-2' />
              空間列表
            </NavLink>
            <NavLink
              className='list-group-item list-group-item-action py-3'
              to='/admin/spaces_rentals'
            >
              <i className='bi bi-receipt me-2' />
              空間租借列表
            </NavLink>
            <NavLink
              className='list-group-item list-group-item-action py-3'
              to='/admin/products'
            >
              <i className='bi bi-archive me-2' />
              產品列表
            </NavLink>
            <NavLink
              to='/admin/coupons'
              className='list-group-item list-group-item-action py-3'
            >
              <i className='bi bi-ticket-perforated-fill me-2' />
              優惠卷列表
            </NavLink>
          </ul>
        </div>
        <div className='w-100'>{token && <Outlet />}</div>
      </div>
    </MessageContext.Provider>
  );
}

export default Dashboard;
