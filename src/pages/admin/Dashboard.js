import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useReducer } from 'react';
import Message from '../../components/Message';
import { MessageContext, messageReducer, initState } from '../../store/messageStore';

function Dashboard() {
  const navigate = useNavigate();
  const reducer = useReducer(messageReducer, initState);

  const logout = () => {
    document.cookie = 'hexToken=;';
    navigate('/login');
  };

  // 取出 Token
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('hexToken='))
    ?.split('=')[1];
  axios.defaults.headers.common['Authorization'] = token;
  useEffect(() => {
    if (!token) {
      return navigate('/login');
    }
    (async () => {
      try {
        await axios.post('/v2/api/user/check');
      } catch (error) {
        if (!error.response.data.success) {
          navigate('/login');
        }
      }
    })();
  }, [navigate, token]);

  return (
    <MessageContext.Provider value={reducer}>
      <Message />
      <nav className='navbar navbar-expand-lg bg-dark'>
        <div className='container-fluid'>
          <p className='text-white mb-0' style={{ fontWeight: 'bold', fontSize: '28px'  }}>
            <i className="bi bi-house-gear">  </i>
              產學營運中心空間租借系統後台管理系統</p>
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