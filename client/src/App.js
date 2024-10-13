import { HashRouter, Routes, Route } from 'react-router-dom';
import AdminLogin from './Admin/AdminLogin';
import AddDriver from './Admin/AddDriver';
import UserLogin from  './User/UserLogin';
import DriverLogin from './Driver/DriverLogin'
import DriverLocation from './Driver/DriverLocation'
import Home from './Home';
import UserRegister from './User/UserRegister';
import UserVerify from './User/UserVerify';
import ViewBus from './User/ViewBus';
import UserForgot from './User/UserForgot';

function App() {
  return (
   <>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home/>} />

        <Route path="/adminlogin" element={<AdminLogin/>} />
        <Route path="/adddriver" element={<AddDriver/>} />

        <Route path='/userlogin' element={<UserLogin/>} />
        <Route path='/userregister' element={<UserRegister/>} />
        <Route path='/viewbus' element={<ViewBus/>} />
        <Route path="/forgotpassword" element={<UserForgot />} />
        <Route path="/verify" element={<UserVerify />} />



        <Route path='/driverlogin' element={<DriverLogin/>}/>
        <Route path='/driverdashboard' element={<DriverLocation/>}/>
          
      </Routes>
    </HashRouter>
   </>
  );
}

export default App;
