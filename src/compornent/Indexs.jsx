import React from 'react'
import { Link } from 'react-router-dom'

function Indexs() {
  return (
    <div>
        <h1>index</h1>
        {/* <Link to={'/Logins'}>login</Link> */}
        <Link to={'/login'}>logins</Link>
        <Link to={'/Register'}>Register</Link>
        <p>สมัครผู้ให้บริการ</p>
        <Link to={'/Incrud'}>สมัครผู้ให้บริการ</Link>
    </div>
  )
}

export default Indexs