import React, { useState, useEffect } from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../css/navbar.css'
import Swal from 'sweetalert2'


import Booking_History from './Booking_History'
import Shopping_cart from './Shopping_cart'
import History from './History'
import Notification from './notification/notification'
import Iconprofile from './Iconprofile'

function Navbars(props) {

  const navigate = useNavigate();
  const { IDuser } = props.totalID

  const [booking, set_booking] = useState([])
  useEffect(() => {
    axios.get(`http://localhost:4001/booking/getbooking_product/${IDuser}`)
      .then((res) => {
        set_booking(res.data)
      }).catch((err) => {
        console.log(err);
      })
  }, []);

  useEffect(() => {
    updatedata();
  }, [booking])


  // เเสดงสินค้าที่ยังไม่ได้ชำระเงิน
  const [notibtn, set_notibtn] = useState(null)
  const updatedata = () => {
    // let lgbtn 
    if (booking.length === 0) {
      set_notibtn(null)
    } else {
      // set_showpopup(true)
      set_notibtn("มีสินค้าท่ียังไม่ได้รับการยืนยัน")
      callnoti();
    }
  }
  const callnoti = () => {
    Swal.fire({
      title: 'มีสินค้ายังไม่ได้ชำระเงินน้าา',
      icon: 'question',
      denyButtonText: 'close'
    })
  }


  return (
    <Navbar bg='dark' variant='dark'>
      <div className='container-nav'>
        <div className='title-navs'>
          <div className="logo">
            <img src="/public/logo.png" alt="" />
          </div>
          <div className="logo-name">
            <h1>PARKME</h1>
            <h2>MEPARK</h2>
          </div>
        </div>
        {/* <div className='title-nav'>
          <Notification message={{ notibtn }} />
        </div> */}

        <Nav className='nav'>
          <div className='item-page'>
            <Booking_History totalID={{ IDuser: IDuser }} />
          </div>
          <div className='item-page'>
            <Shopping_cart IDuser={{ IDuser: IDuser }} />
          </div>
          <div className='item-page'>
            <History IDuser={{ IDuser }} />
          </div>
          <div className='item-page'>
            <Iconprofile IDuser={{ IDuser }} />
          </div>
        </Nav>
      </div>

    </Navbar>
  )
}

export default Navbars
