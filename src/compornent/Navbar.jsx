import React from 'react'
import { Navbar , Container, Nav  } from 'react-bootstrap'
import { Link } from 'react-router-dom'


import Booking_History from './Booking_History'
import Shopping_cart from './Shopping_cart'
import History from './History'

function Navbars(props) {

  const { IDuser } = props.totalID;
  return (
    <Navbar bg='dark' variant='dark'>
        <Container>
            <Nav>
                <Booking_History totalID = {{IDuser : IDuser }}/>
                <Shopping_cart IDuser ={{IDuser : IDuser}}/>
                <History IDuser = {{IDuser}}/>
                {/* <Link to='/'></Link> */}
            </Nav>         
        </Container>

    </Navbar>
  )
}

export default Navbars
