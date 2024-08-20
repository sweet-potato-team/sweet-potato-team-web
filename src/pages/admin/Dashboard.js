import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useReducer, useState } from 'react';
import Message from '../../components/Message';
import { MessageContext, messageReducer, initState } from '../../store/messageStore';
import SidebarLink from '../../components/SidebarLink'; // 引入SidebarLink组件

function Dashboard() {
  const navigate = useNavigate();
  const reducer = useReducer(messageReducer, initState);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const logout = () => {
    document.cookie = 'hexToken=;';
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // 取出 Token
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('hexToken='))
    ?.split('=')[1];
  axios.defaults.headers.common['Authorization'] = token;

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
    <MessageContext.Provider value={reducer}>
      <Message />
      <div className='d-flex' style={{ minHeight: '100vh' }}>
        <div className={`bg-light d-flex flex-column justify-content-between ${isCollapsed ? 'collapsed-sidebar' : ''}`} style={{ width: isCollapsed ? '60px' : '200px', paddingTop: '20px' }}>
          <div>
            <div className="d-flex justify-content-between align-items-center px-3">
              {!isCollapsed && <h4 style={{ margin: 0 }}>後臺管理</h4>}
              <button className="btn btn-light btn-sm" onClick={toggleSidebar}>
                <i className={`bi ${isCollapsed ? 'bi-arrow-right-square' : 'bi-arrow-left-square'}`}></i>
              </button>
            </div>
            <ul className='list-group list-group-flush mt-3'>
              <SidebarLink to='/admin/spaces' iconClass='bi bi-chat-text' label='免費空間 列表' isCollapsed={isCollapsed} activeColor='#415A77' defaultColor='#415A77' />
              <SidebarLink to='/admin/paid_spaces' iconClass='bi bi-cash-coin' label='付費空間 列表' isCollapsed={isCollapsed} activeColor='#415A77' defaultColor='#415A77' />
              <SidebarLink to='/admin/space_rentals' iconClass='bi bi-chat-text' label='免費空間 紀錄' isCollapsed={isCollapsed} activeColor='#415a77' defaultColor='#415A77' />
              <SidebarLink to='/admin/paid_space_rentals' iconClass='bi bi-cash-coin' label='付費空間 紀錄' isCollapsed={isCollapsed} activeColor='#415a77' defaultColor='#415A77' />
              {/* <SidebarLink to='/admin/products' iconClass='bi bi-archive' label='產品列表' isCollapsed={isCollapsed} activeColor='#415A77' defaultColor='#415A77' />
              <SidebarLink to='/admin/coupons' iconClass='bi bi-ticket-perforated-fill' label='優惠卷列表' isCollapsed={isCollapsed} activeColor='#415A77' defaultColor='#415A77' /> */}
              {/* 新增的連結 */}
              <SidebarLink to='/admin/manage_times' iconClass='bi bi-clock-history' label='時間管理' isCollapsed={isCollapsed} activeColor='#415A77' defaultColor='#415A77' />
              <SidebarLink to='/admin/manage_charges' iconClass='bi bi-ticket-perforated' label='收費管理' isCollapsed={isCollapsed} activeColor='#415A77' defaultColor='#415A77' />
              <SidebarLink to='/admin/manage_documents' iconClass='bi bi-file-earmark-medical' label='文件管理' isCollapsed={isCollapsed} activeColor='#415A77' defaultColor='#415A77' />
            </ul>
          </div>
          <div className='p-3'>
            <button type='button' className='btn btn-sm btn-light w-100' onClick={logout}>
              <i className="bi bi-box-arrow-right me-2" />
              {!isCollapsed && '登出'}
            </button>
            {!isCollapsed && (
              <div className="text-center mt-3">
                <small className="text-muted">&copy; Potato team 🍠</small>
              </div>
            )}
          </div>
        </div>
        <div className='w-100'>{token && <Outlet />}</div>
      </div>
    </MessageContext.Provider>
  );
}

export default Dashboard;