import React from 'react'
import { useState, useEffect } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faCheck, faLock, faSpinner } from '@fortawesome/free-solid-svg-icons'

import '../css/forgotpass.css'

function Forgotpass() {

    const navigate = useNavigate();

    const [email, set_email] = useState([])
    const [verifypass, set_verifypass] = useState([])
    const [newpass, set_newpass] = useState('')
    const [agpass, set_agpass] = useState('')
    const [ID, set_ID] = useState(false)
    const [icons, set_icons] = useState(faEnvelope)

    const [btninput, setbtninput] = useState(false)

    //ใช้ในการตรวจอีเมล์
    const handleemail = (e) => {
        set_email(e.target.value);
        set_icons(faSpinner)

    }

    const handleverify = (e) => {
        set_verifypass(e.target.value)
    }

    const handlenewpass = (e) => {
        set_newpass(e.target.value)
    }

    const handleagainpass = (e) => {
        set_agpass(e.target.value)
    }

    useEffect(() => {
        if (email.length > 0) {
            set_icons(faSpinner)
            axios.get(`http://localhost:4001/users/forgotpass/${email}`)
                .then((res) => {
                    if (res.data !== '') {
                        set_ID(res.data._id)
                        set_icons(faCheck)
                    } else {
                        console.log("Email not found")
                    }

                }).catch((err) => {
                    console.log(err)
                })
        } else {
            set_icons(faEnvelope)
        }
    }, [email])

    // เช็คemail
    const checkemail = () => {
        axios.post('http://localhost:4001/otp/sendOTP', { email })
            .then((OTP) => {
                console.log(OTP)
            }).catch((err) => {
                console.log(err)
            })
    }

    // ยืนยัน OTP
    const verifyOTP = () => {
        const userOTP = verifypass
        axios.post('http://localhost:4001/otp/verify-otp', { email, userOTP })
            .then((response) => {
                setbtninput(response.data.success)
                set_verifypass([])
            }
            ).catch((err) => {
                console.log(err)
            })
    }

    const callnewpassword = () => {
        axios.put('http://localhost:4001/users/updatepassword', { ID, newpass })
            .then((newpassres) => {
                Swal.fire({
                    title: 'คุณได้ทำการเปลี่ยนรหัสเเล้ว',
                    confirmButtonText: 'ยืนยัน',
                }).then((conf)=>{
                    if (conf.isConfirmed){
                        navigate('/login')
                    }
                })
                
            }).catch((err) => {
                console.log(err)
            })
    }
    return (
        <div className='container-forgot'>
            <div className="item-forgot">
                <div className="item-input">
                    <div className="content-forgot">
                        <div className="title-item">
                            <p>Forgot Password</p>
                        </div>
                        <div className="title-item-des">
                            <p>Provide your account’s  blah blah</p>
                        </div>


                        {btninput !== false ? (
                            <div className=''>
                                <div className='input-forgot'>
                                    <label htmlFor="password1" ><FontAwesomeIcon icon={faLock} /></label>
                                    <input id='password1' value={newpass} type="password" placeholder='New password' onChange={handlenewpass} />
                                </div>
                                <div className='input-forgot'>
                                    <label htmlFor="password2"><FontAwesomeIcon icon={faLock} /></label>
                                    <input id='password2' value={agpass} type="password " placeholder='password' onChange={handleagainpass} />
                                </div>
                                <div className="btn-confirm">
                                    <button onClick={callnewpassword} >send</button>
                                </div>
                            </div>
                        ) :
                            <div className=''>
                                <div className={`input-forgot ${icons === faSpinner ? 'fapin' : ''}`}>
                                    <label htmlFor=""><FontAwesomeIcon icon={icons} /></label>
                                    <input type="email" placeholder='Email' onChange={handleemail} />
                                    <button onClick={checkemail}>Send</button>
                                </div>
                                <div className="input-forgot">
                                    <label htmlFor=""><FontAwesomeIcon icon={faLock} /></label>
                                    <input type="" placeholder='Verify Coder' onChange={handleverify} />
                                </div>
                                <div className="btn-confirm">
                                    <button onClick={verifyOTP} >verify</button>
                                </div>
                            </div>

                        }
                    </div>
                </div>
                <img src="../../public/mobile.png" alt="" />
            </div>
        </div>
    )
}

export default Forgotpass