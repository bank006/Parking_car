import React from 'react'
import { Link } from 'react-router-dom'
import "./csspage/home_login.css"


function Home_login() {
    return (
        <div className='content-home'>
            <div className='nav-home'>
                <div className='item-nav'>
                    <div className='con-title'>
                        <div className='con-logo'>
                            <img src="/public/logo.png" alt="" />
                        </div>
                        <div className='title-nav'>
                            <p className='PARKME'>PARKME</p>
                            <p className='MEPARK'>MEPARK</p>
                        </div>
                    </div>
                    <div className='con-login'>
                        <Link className='logins' to={'/login'}>login</Link>
                    </div>

                </div>

                <div className='nav-content'>
                    <div className='content-title'>
                        <div className='box-content'>
                            <h1 className='WELCOM'>WELCOM</h1>
                            <div className='tos'>
                                <div className='fon'>
                                    <h1 className='to'>to</h1>
                                    <h1 className='Parkme-text'>PARKME</h1>
                                </div>
                            </div>
                            <div className='des'>
                                <p className='item-des'>The website parking application make you book a car easily and quickly, without having to waste time searching for parking</p>
                            </div>
                        </div>
                    </div>
                    <div className='btnto-login'>
                        <div className='item-click'>
                            <Link className='getstart' to={'/login'}>Get Start</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home_login