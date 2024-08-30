import { Routes, Route} from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminSpaces from './pages/admin/AdminSpaces';
import AdminPaidSpaces from './pages/admin/AdminPaidSpaces';
import Home from './pages/front/Home';
import Spaces from './pages/front/Spaces';
// import PaidSpaces from './pages/front/PaidSpaces';
import SpacesViewFreeTimes from './pages/front/SpacesViewFreeTimes';


import SpaceRental from './pages/front/SpaceRental';
import AdminSpaceRentals from './pages/admin/AdminSpaceRentals';

function App() {

  return (
    <div className='App'>
      <Routes>
        {/* 直接將這些頁面掛載在 '/' 路徑下 */}
        <Route path='/' element={<Home />}></Route>
          {/* <Route path='paid_spaces' element={<PaidSpaces />}></Route> */}
          <Route path='spaces' element={<Spaces />}></Route>
          <Route path='spaces/view_free_times' element={<SpacesViewFreeTimes />}></Route>
          <Route path='space_rentals' element={<SpaceRental />}></Route>
        
        <Route path='/login' element={<Login />}></Route>
        <Route path='/admin' element={<Dashboard />}>                   
          <Route path='space_rentals' element={<AdminSpaceRentals />}></Route>
          <Route path='spaces' element={<AdminSpaces />}></Route>
          {/* <Route path='paid_spaces' element={<AdminPaidSpaces />}></Route> */}

        </Route>
      </Routes>
    </div>
  );
}

export default App;