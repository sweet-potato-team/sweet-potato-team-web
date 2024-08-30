import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ToggleSwitch({ toggleView, setToggleView }) {
  const navigate = useNavigate();
  const location = useLocation();

  const containerStyle = {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '50px',
    backgroundColor: '#f1f1f1',
    borderRadius: '25px',
    overflow: 'hidden',
    boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.3)',
  };

  useEffect(() => {
    // 基於路由位置設置 toggle 狀態
    const view = location.pathname.includes('/spaces/view_free_times') ? false : true;
    setToggleView(view);
  }, [location, setToggleView]);

  const handleNavigate = (view) => {
    // 允許動畫執行一段時間再進行導航
    setTimeout(() => {
      navigate(view ? '/spaces' : '/spaces/view_free_times');
    }, 300);
    setToggleView(view);
  };

  const optionStyle = (active) => ({
    flex: 1,
    textAlign: 'center',
    lineHeight: '50px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: active ? 'white' : '#415A77',
    zIndex: 1,
    cursor: 'pointer',
    transition: 'color 0.3s',
  });

  const sliderStyle = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
    backgroundColor: '#415A77',
    borderRadius: '25px',
    transition: 'transform 0.3s ease',
    transform: toggleView ? 'translateX(100%)' : 'translateX(0)',
  };

  return (
    <div style={containerStyle}>
      <div
        style={optionStyle(!toggleView)}
        onClick={() => handleNavigate(false)}
      >
        時間總覽
      </div>
      <div
        style={optionStyle(toggleView)}
        onClick={() => handleNavigate(true)}
      >
        查看空間
      </div>
      <div style={sliderStyle}></div>
    </div>
  );
}

export default ToggleSwitch;


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function ToggleSwitch({ toggleView, setToggleView }) {
//   const navigate = useNavigate();
//   const containerStyle = {
//     position: 'relative',
//     display: 'flex',
//     width: '100%',
//     height: '50px',
//     backgroundColor: '#f1f1f1',
//     borderRadius: '25px',
//     overflow: 'hidden',
//     boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.3)',
//   };

//   // 監聽 toggleView 的變化並執行導航
//   useEffect(() => {
//     if (toggleView) {
//       navigate('/spaces');
//     } else {
//       navigate('/spaces/view_free_times');
//     }
//   }, [toggleView, navigate]);

//   const optionStyle = (active) => ({
//     flex: 1,
//     textAlign: 'center',
//     lineHeight: '50px',
//     fontSize: '20px',
//     fontWeight: 'bold',
//     color: active ? 'white' : '#415A77',
//     zIndex: 1,
//     cursor: 'pointer',
//     transition: 'color 0.3s',
//   });

//   const sliderStyle = {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     width: '50%',
//     backgroundColor: '#415A77',
//     borderRadius: '25px',
//     transition: 'transform 0.3s ease',
//     transform: toggleView ? 'translateX(100%)' : 'translateX(0)',
//   };

//   const handleToggle = (view) => {
//     setToggleView(view);
//   };

//   return (
//     <div style={containerStyle}>
//       <div
//         style={optionStyle(!toggleView)}
//         onClick={() => handleToggle(false)}
//       >
//         時間總覽
//       </div>
//       <div
//         style={optionStyle(toggleView)}
//         onClick={() => handleToggle(true)}
//       >
//         查看空間
//       </div>
//       <div style={sliderStyle}></div>
//     </div>
//   );
// }

// export default ToggleSwitch;

// import React from 'react';

// function ToggleSwitch({ toggleView, setToggleView, navigate }) {
//   const containerStyle = {
//     position: 'relative',
//     display: 'flex',
//     width: '100%',
//     height: '50px',
//     backgroundColor: '#f1f1f1',
//     borderRadius: '25px',
//     overflow: 'hidden',
//     boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.3)',
//   };

//   const handleNavigate = (view) => {
//     setToggleView(view); // 更新视图状态
//     if (view) {
//       navigate('/spaces'); // 导航到查看空间视图
//     } else {
//       navigate('/spaces/view_free_times'); // 导航到时间总览视图
//     }
//   };
  

//   const optionStyle = (active) => ({
//     flex: 1,
//     textAlign: 'center',
//     lineHeight: '50px',
//     fontSize: '20px',
//     fontWeight: 'bold',
//     color: active ? 'white' : '#415A77',
//     zIndex: 1,
//     cursor: 'pointer',
//     transition: 'color 0.3s',
//   });

//   const sliderStyle = {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     width: '50%',
//     backgroundColor: '#415A77',
//     borderRadius: '25px',
//     transition: 'transform 0.3s ease',
//     transform: toggleView ? 'translateX(100%)' : 'translateX(0)',
//   };

//   return (
//     <div style={containerStyle}>
//       <div
//         style={optionStyle(!toggleView)}
//         onClick={() => handleNavigate(false)}
//       >
//         時間總覽
//       </div>
//       <div
//         style={optionStyle(toggleView)}
//         onClick={() => handleNavigate(true)}
//       >
//         查看空間
//       </div>
//       <div style={sliderStyle}></div>
//     </div>
//   );
// }

// export default ToggleSwitch;
