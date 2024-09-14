import React, { useState, useEffect } from 'react'; // 引入 useEffect
import { useNavigate, Outlet } from 'react-router-dom';
import ToggleSwitch from '../../components/ToggleSwitch';
import NavBar from '../../components/homepage/NavBar'; // 引入 NavBar
import axios from 'axios';
import Loading from '../../components/Loading'; // 引入 Loading

import '../../backpage.css';

const AdminPage = () => {
  const [toggleView, setToggleView] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false); // 設置是否為管理員
  const [isLoading, setIsLoading] = useState(true); // Loading 狀態
  const navigate = useNavigate(); // 使用 useNavigate 來進行導航

  const options = [
    { label: '醫生清單', path: '/admin/allDoctors' },
    { label: '用戶清單', path: '/admin/allUsers' }
  ];

  const handleNavigate = (index) => {
    navigate(options[index].path); // 使用 navigate 進行路由切換
    setToggleView(index);
  };

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('hexToken=')).split('=')[1];

    const checkAdminStatus = async () => {
      try {
        const res = await axios.post('http://localhost:8080/users/check', {}, {
          headers: {
            Authorization: `Bearer ${token}` // 附加 JWT token
          }
        });
        if (res.data.success) {
          setIsAdmin(true); // 使用者是管理員
        } else {
          setIsAdmin(false); // 使用者不是管理員
        }
      } catch (err) {
        console.error("Error while checking admin status:", err);
      }
    };

    // 確保最少顯示0.5秒的加載效果
    const startLoadingTime = Date.now();

    checkAdminStatus().finally(() => {
      const elapsed = Date.now() - startLoadingTime;
      const remainingTime = Math.max(500 - elapsed, 0); // 確保至少顯示0.5秒
      setTimeout(() => {
        setIsLoading(false); // 停止 Loading
      }, remainingTime);
    });
  }, []);

  const sectionRefs = {
    home: React.createRef(),
    depression: React.createRef(),
    emotion: React.createRef(),
    records: React.createRef(),
    info: React.createRef()
  };

  return (
    <div className='adminContainer' style={{ minHeight: '100vh', overflowY: 'auto', backgroundColor:'#EFEBE6'}}>  {/* 確保頁面可以滾動 */}
      {/* 加載 Loading 元件 */}
      <Loading isLoading={isLoading} />

      {!isLoading && (  // 確保只在加載完成後顯示內容
        <>
          <NavBar sectionRefs={sectionRefs} isAdmin={isAdmin} /> {/* 傳遞 isAdmin 屬性給 NavBar */}
          {/* ToggleSwitch 設定寬度為 70% 並距離上方 40px */}
          <div style={{ width: '70%', margin: '40px auto' }}>
            <ToggleSwitch className='adminContainer' options={options} toggleView={toggleView} setToggleView={handleNavigate} />
          </div>
          {/* 使用 Outlet 來渲染對應的子路由 */}
          <Outlet />
        </>
      )}
    </div>
  );
};

export default AdminPage;


// import React, { useState, useEffect } from 'react'; // 引入 useEffect
// import { useNavigate, Outlet } from 'react-router-dom';
// import ToggleSwitch from '../../components/ToggleSwitch';
// import NavBar from '../../components/homepage/NavBar'; // 引入 NavBar
// import axios from 'axios';
// import Loading from '../../components/Loading'; // 引入 Loading

// const AdminPage = () => {
//   const [toggleView, setToggleView] = useState(0);
//   const [isAdmin, setIsAdmin] = useState(false); // 設置是否為管理員
//   const [isLoading, setIsLoading] = useState(true); // Loading 狀態
//   const navigate = useNavigate(); // 使用 useNavigate 來進行導航

//   const options = [
//     { label: '所有醫生', path: '/admin/allDoctors' },
//     { label: '所有用戶', path: '/admin/allUsers' }
//   ];

//   const handleNavigate = (index) => {
//     navigate(options[index].path); // 使用 navigate 進行路由切換
//     setToggleView(index);
//   };

//   useEffect(() => {
//     const token = document.cookie.split('; ').find(row => row.startsWith('hexToken=')).split('=')[1];

//     axios.post('http://localhost:8080/users/check', {}, {
//         headers: {
//             Authorization: `Bearer ${token}` // 附加 JWT token
//         }
//     })
//     .then(res => {
//         if (res.data.success) {
//             setIsAdmin(true); // 使用者是管理員
//         } else {
//             setIsAdmin(false); // 使用者不是管理員
//         }
//         setIsLoading(false); // 停止 Loading
//     })
//     .catch(err => {
//         console.error("Error while checking admin status:", err);
//         setIsLoading(false); // 停止 Loading
//     });
//   }, []);

//   const sectionRefs = {
//     home: React.createRef(),
//     depression: React.createRef(),
//     emotion: React.createRef(),
//     records: React.createRef(),
//     info: React.createRef()
//   };

//   return (
//     <div>
//       {/* 加載 Loading 元件 */}
//       <Loading isLoading={isLoading} />

//       {/* NavBar 包含返回按鈕 */}
//       <NavBar sectionRefs={sectionRefs} isAdmin={isAdmin} />
//       {/* ToggleSwitch 設定寬度為 70% 並距離上方 40px */}
//       <div style={{ width: '70%', margin: '40px auto' }}>
//         <ToggleSwitch options={options} toggleView={toggleView} setToggleView={handleNavigate} />
//       </div>
//       {/* 使用 Outlet 來渲染對應的子路由 */}
//       <Outlet />
//     </div>
//   );
// };

// export default AdminPage;


// import React, { useState, useEffect } from 'react'; // 引入 useEffect
// import { useNavigate, Outlet } from 'react-router-dom';
// import ToggleSwitch from '../../components/ToggleSwitch';
// import NavBar from '../../components/homepage/NavBar'; // 引入 NavBar
// import axios from 'axios';

// const AdminPage = () => {
//   const [toggleView, setToggleView] = useState(0);
//   const [isAdmin, setIsAdmin] = useState(false); // 設置是否為管理員
//   const navigate = useNavigate(); // 使用 useNavigate 來進行導航

//   const options = [
//     { label: '所有醫生', path: '/admin/allDoctors' },
//     { label: '所有用戶', path: '/admin/allUsers' }
//   ];

//   const handleNavigate = (index) => {
//     navigate(options[index].path); // 使用 navigate 進行路由切換
//     setToggleView(index);
//   };

//   useEffect(() => {
//     const token = document.cookie.split('; ').find(row => row.startsWith('hexToken=')).split('=')[1];
  
//     axios.post('http://localhost:8080/users/check', {}, {
//         headers: {
//             Authorization: `Bearer ${token}` // 附加 JWT token
//         }
//     })
//     .then(res => {
//         if (res.data.success) {
//             setIsAdmin(true); // 使用者是管理員
//         } else {
//             setIsAdmin(false); // 使用者不是管理員
//         }
//     })
//     .catch(err => {
//         console.error("Error while checking admin status:", err);
//     });
//   }, []);
  

//   const sectionRefs = {
//     home: React.createRef(),
//     depression: React.createRef(),
//     emotion: React.createRef(),
//     records: React.createRef(),
//     info: React.createRef()
//   };

//   return (
//     <div>
//       <NavBar sectionRefs={sectionRefs} isAdmin={isAdmin} /> {/* 傳遞 isAdmin 屬性給 NavBar */}
//       <ToggleSwitch options={options} toggleView={toggleView} setToggleView={handleNavigate} />
//       {/* 使用 Outlet 來渲染對應的子路由 */}
//       <Outlet />
//     </div>
//   );
// };

// export default AdminPage;
