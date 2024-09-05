import { Routes, Route, Navigate } from 'react-router-dom'; // 移除 Router
import Login from './pages/Login';
import LineLoginPage from './pages/front/LineLoginPage';
import Home from './pages/front/Home';
import AdminPage from './pages/admin/AdminPage'; // 引入 AdminPage
import AllDoctors from './component/AllDoctors'; // 引入 AllDoctors
import AllUsers from './component/AllUsers';     // 引入 AllUsers

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/LineLoginPage" element={<LineLoginPage />} />
        <Route path="/login" element={<Login />} />

        {/* AdminPage 作為父路由 */}
        <Route path="/admin" element={<AdminPage />}>
          {/* 設置默認跳轉到 /admin/allDoctors */}
          <Route index element={<Navigate to="/admin/allDoctors" />} />
          <Route path="allDoctors" element={<AllDoctors />} />
          <Route path="allUsers" element={<AllUsers />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
