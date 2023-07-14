import React from 'react'
import { Navbar , Container, Nav  } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Navbars() {
  return (
    <Navbar bg='dark' variant='dark'>
        <Container>
            <Nav>
                <h1>navbar</h1>
                {/* <Link to='/'></Link> */}
            </Nav>         
        </Container>

    </Navbar>
  )
}

export default Navbars
