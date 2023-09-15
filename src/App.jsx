import { BrowserRouter , Route , Routes  } from 'react-router-dom'
import Login from './compornent/Login'
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

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Indexs/>}/>
        <Route path='/Logins' element={<Login/>}/>
        <Route path='/Register' element={<Regiser/>}/>
        <Route path='/Dashbord/:IDuser' element={<Dashbord/>}/>
        <Route path='/Book_car/' element={<Book_car/>}/>
        <Route path='/Dowload/:usersemail' element={<Dowload/>}/>
        <Route path='/Incrud/:IDuser' element={<Incurd_em/>}/>
        <Route path='/Dashbord_ad/:IDadmin' element={<Dasgbord_ad/>}/>
        <Route path='/Register_ad' element={<Register_admin/>}/>
        <Route path='/Download_ad/:email_admin' element={<Dowload_ad/>}/>
        <Route path='/Store/:IDstore' element={<Store/>}/>
        <Route path='/Profile/:UserId' element={<Profile/>}/>
        <Route path='/Detail_store/:IDstore/:IDuser' element={<Detail_store/>}/>
        <Route path='/Pust_product/:IDstore' element={<Push_product/>}/>
      </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
