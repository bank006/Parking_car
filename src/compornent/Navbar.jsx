import React from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import '../css/navbar.css'


import Booking_History from './Booking_History'
import Shopping_cart from './Shopping_cart'
import History from './History'

function Navbars(props) {

  const { IDuser } = props.totalID
  return (
    <Navbar bg='dark' variant='dark'>
      <div className='container-nav'>
        <div className='title-nav'>
          <h1>Parkme</h1>
        </div>
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
        </Nav>
      </div>

    </Navbar>
  )
}

export default Navbars
