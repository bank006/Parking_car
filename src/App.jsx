import { BrowserRouter , Route , Routes  } from 'react-router-dom'
import { lazy, Suspense } from 'react';
import './App.css'

// import Login from './compornent/Login'
import Regiser from './compornent/Regiser'
import Indexs from './compornent/indexs'
import Dashbord from './compornent/Dashbord'
import Book_car from './compornent/Book_car'
import Dowload from './compornent/admin/Dowload'
import Incurd_em from './compornent/store/Incurd_em'
import Dasgbord_ad from './compornent/admin/Dasgbord_ad'
import Register_admin from './compornent/admin/Register_admin'
import Dowload_ad from './compornent/Dowload_ad'
import Store from './compornent/store/Store'
import Profile from './compornent/Profile'
import Detail_store from './compornent/store/Detail_store'
import Push_product from './compornent/store/Push_product'
import Booking_History from './compornent/Booking_History'
import Booking_confirm from './compornent/Booking_confirm'
import History from './compornent/History'
import Logins from './compornent/Logins'
import Payment from './compornent/patment/Payment'
import Navbars from './compornent/Navbar'
import Home from './compornent/firstpage/Home'
// import Home_login from './compornent/firstpage/Home_login'
const Home_login = lazy(() => import('./compornent/firstpage/Home_login'));
import Navbar_home from './compornent/firstpage/Navbar_home'
import Verify_otp from './compornent/Verify_otp'
// import Maps from './compornent/Maps'
const Maps = lazy(() => import('./compornent/Maps'));
import Selectpayment from './compornent/patment/Selectpayment'
import notification from './compornent/notification/notification';
import income from './compornent/store/income';
import incomeperday from './compornent/store/incomeperday';
import Iconprofile from './compornent/Iconprofile';
import Pdpa from './compornent/pdpa/Pdpa';
import Forgotpass from './compornent/Forgotpass';
import Historypayment from './compornent/historypayment/Historypayment';
import Chat from './compornent/Chat/Chat';
import Userbox from './compornent/Chat/Userbox';
import Chatstore from './compornent/store/Chatstore';
import Userboxstore from './compornent/store/Userboxstore';
import Review from './compornent/review/Review';
import Cancle from './compornent/Cancle';

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='indexs' element={<Indexs/>}/>
        {/* <Route path='/Logins' element={<Login/>}/> */}
        <Route path='/Register' element={<Regiser/>}/>
        <Route path='/Dashbord' element={<Dashbord/>}/>
        <Route path='/Book_car' element={<Book_car/>}/>
        <Route path='/Dowload/:usersemail' element={<Dowload/>}/>
        <Route path='/Incrud' element={<Incurd_em/>}/>
        <Route path='/Dashbord_ad' element={<Dasgbord_ad/>}/>
        <Route path='/Register_ad' element={<Register_admin/>}/>
        <Route path='/Download_ad/:email_admin' element={<Dowload_ad/>}/>
        <Route path='/Store' element={<Store/>}/>
        <Route path='/Profile' element={<Profile/>}/>
        <Route path='/Detail_store' element={<Detail_store/>}/>
        <Route path='/Pust_product/:IDstore' element={<Push_product/>}/>
        <Route path='/Booking_histre/:IDuser' element={<Booking_History/>}/>
        <Route path='/Booking_confirm' element={<Booking_confirm/>}/>
        <Route  path='/login' element={<Logins/>} />
        <Route path='/History' element={<History/>}/>
        <Route path='/Payment' element={<Payment/>}/>
        <Route path='/Navbers' element={<Navbars/>} />
        <Route path='/Navber_home' element={<Navbar_home/>} />
        <Route path='/Home' element={<Home/>} />
        {/* <Route path='/' element={<Home_login/>} /> */}
        <Route path='/' element={<Suspense fallback={<div>Loading...</div>}><Home_login /></Suspense>} />
        <Route path='/Verify_otp' element={<Verify_otp/>}/>
        {/* <Route path='/Maps' element={<Maps/>}/> */}
        <Route path='/Maps' element={<Suspense fallback={<div>Loading...</div>}><Maps/></Suspense>} />
        <Route path='/Selectpayment' element={<Selectpayment/>}/>
        <Route path='/Notification' element={<notification/>}/>
        <Route path='/Income' element={<income/>} />
        <Route path='/Incomeperday' element={<incomeperday/>} />
        <Route path="/Icons" element={<Iconprofile />} />
        <Route path='/Pdpa' element={<Pdpa/>}/>
        <Route path='/Forgot' element={<Forgotpass/>}/>
        <Route path='/Historypayment' element={<Historypayment/>}/>
        <Route path='/Chat' element={<Chat/>}/>
        <Route path='/Userbox' element={<Userbox/>}/>
        <Route path='/Chatstore' element={<Chatstore/>}/>
        <Route path='/Userboxstore' element={<Userboxstore/>}/>
        <Route path='/Review' element={<Review/>}/>
        <Route path='/Cancle' element={<Cancle/>}/>
      </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
