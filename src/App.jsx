import { BrowserRouter , Route , Routes  } from 'react-router-dom'
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
import Payment from './compornent/Payment'
import Navbars from './compornent/Navbar'
import Home from './compornent/firstpage/Home'
import Home_login from './compornent/firstpage/Home_login'
import Navbar_home from './compornent/firstpage/Navbar_home'
import Verify_otp from './compornent/Verify_otp'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='indexs' element={<Indexs/>}/>
        {/* <Route path='/Logins' element={<Login/>}/> */}
        <Route path='/Register' element={<Regiser/>}/>
        <Route path='/Dashbord' element={<Dashbord/>}/>
        <Route path='/Book_car/' element={<Book_car/>}/>
        <Route path='/Dowload/:usersemail' element={<Dowload/>}/>
        <Route path='/Incrud/:IDuser' element={<Incurd_em/>}/>
        <Route path='/Dashbord_ad' element={<Dasgbord_ad/>}/>
        <Route path='/Register_ad' element={<Register_admin/>}/>
        <Route path='/Download_ad/:email_admin' element={<Dowload_ad/>}/>
        <Route path='/Store' element={<Store/>}/>
        <Route path='/Profile/:UserId' element={<Profile/>}/>
        <Route path='/Detail_store' element={<Detail_store/>}/>
        <Route path='/Pust_product/:IDstore' element={<Push_product/>}/>
        <Route path='/Booking_histre/:IDuser' element={<Booking_History/>}/>
        <Route path='/Booking_confirm/:IDuser' element={<Booking_confirm/>}/>
        <Route  path='/login' element={<Logins/>} />
        <Route path='/History' element={<History/>}/>
        <Route path='/Payment' element={<Payment/>}/>
        <Route path='/Navbers' element={<Navbars/>} />
        <Route path='/Navber_home' element={<Navbar_home/>} />
        <Route path='/Home' element={<Home/>} />
        <Route path='/' element={<Home_login/>} />
        <Route path='/Verify_otp' element={<Verify_otp/>}/>
      </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
