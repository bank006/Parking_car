import { BrowserRouter , Route , Routes } from 'react-router-dom'
import Login from './compornent/Login'
import Regiser from './compornent/Regiser'
import Indexs from './compornent/indexs'
import Dashbord from './compornent/Dashbord'
import Book_car from './compornent/Book_car'
import Dowload from './compornent/Dowload'
import Incurd_em from './compornent/Incurd_em'
import Dasgbord_ad from './compornent/Dasgbord_ad'

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
        <Route path='/Incrud' element={<Incurd_em/>}/>
        <Route path='/Dashbord_ad' element={<Dasgbord_ad/>}/>
      </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
