import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import ToggleSwitch from '../../components/ToggleSwitch';

const AdminPage = () => {
  const [toggleView, setToggleView] = useState(0);
  const navigate = useNavigate(); // 使用 useNavigate 來進行導航

  const options = [
    { label: '所有醫生', path: '/admin/allDoctors' },
    { label: '所有用戶', path: '/admin/allUsers' }
  ];

  const handleNavigate = (index) => {
    navigate(options[index].path); // 使用 navigate 進行路由切換
    setToggleView(index);
  };

  return (
    <div>
      <ToggleSwitch options={options} toggleView={toggleView} setToggleView={handleNavigate} />
      {/* 使用 Outlet 來渲染對應的子路由 */}
      <Outlet />
    </div>
  );
};

export default AdminPage;
