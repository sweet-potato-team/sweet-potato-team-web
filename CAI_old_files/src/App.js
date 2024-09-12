import { Routes, Route, Navigate } from 'react-router-dom';
import LineLoginPage from './pages/front/LineLoginPage';
import Login from './pages/Login';
import Home from './pages/front/Home';
import AdminPage from './pages/admin/AdminPage'; 
import AllDoctors from './components/AllDoctors'; 
import AllUsers from './components/AllUsers';     

function App() {
  return (
    <div className="App" style={{ width: '100%' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* 允許沒有 sys_user_id 的 LineLoginPage 路由 */}
        <Route path="/LineLoginPage" element={<LineLoginPage />} />
        <Route path="/LineLoginPage/:sys_user_id/*" element={<LineLoginPage />} />
        <Route path="/LineLoginPage/:userId" element={<LineLoginPage />} />
        {/* <Route path="/LineLoginPage/:userId" element={<LineLoginPage />} /> */}


        {/* <Route path="/LineLoginPage/:userId" component={LineLoginPage} /> */}


        {/* 管理員頁面 */}
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<Navigate to="/admin/allDoctors" />} />
          <Route path="allDoctors" element={<AllDoctors />} />
          <Route path="allUsers" element={<AllUsers />} />
        </Route>
        
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;





// import { Routes, Route, Navigate } from 'react-router-dom';
// import LineLoginPage from './pages/front/LineLoginPage';
// import DepressionScaleData from './pages/front/DepressionScaleData';
// import EmotionAnalysis from './pages/front/EmotionAnalysis';
// import MedicationRecords from './pages/front/MedicationRecords';
// import UserInfo from './pages/front/UserInfo';
// import Homepage from './pages/front/Homepage';
// import Login from './pages/Login';
// import Home from './pages/front/Home';
// import AdminPage from './pages/admin/AdminPage'; 
// import AllDoctors from './components/AllDoctors'; 
// import AllUsers from './components/AllUsers';     

// function App() {
//   return (
//     <div className="App">
//       <Routes>
//         <Route path="/" element={<Home />} />
        
//         {/* 允許沒有 sys_user_id 的 LineLoginPage 路由 */}
//         <Route path="/LineLoginPage" element={<LineLoginPage />} />

//         {/* 包含 sys_user_id 的路由 */}
//         <Route path="/LineLoginPage/:sys_user_id/*" element={<LineLoginPage />}>
//           <Route path="Homepage" element={<Homepage />} />  {/* 對應 HomePage */}
//           <Route path="Depression" element={<DepressionScaleData />} />
//           <Route path="Emotion" element={<EmotionAnalysis />} />
//           <Route path="Records" element={<MedicationRecords />} />
//           <Route path="Info" element={<UserInfo />} />
//         </Route>

//         {/* 管理員頁面 */}
//         <Route path="/admin" element={<AdminPage />}>
//           <Route index element={<Navigate to="/admin/allDoctors" />} />
//           <Route path="allDoctors" element={<AllDoctors />} />
//           <Route path="allUsers" element={<AllUsers />} />
//         </Route>
        
//         <Route path="/login" element={<Login />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;