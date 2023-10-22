import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios';
import { useNavigate, redirect, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

import '../css/logins.css'


function Logins() {
    const [email, set_emails] = useState([]);
    const [password, set_passwords] = useState([]);
    const [userdata, set_userdata] = useState([]);
    const [useremails, set_useremail] = useState([])
    const [admin_emailcheck, setadmin_emailcheck] = useState([])
    const [adminemail, set_adminemail] = useState([]);

    // for got password

    const [fgemail, setfgEmail] = useState('');
    const [fgpassword, setfgPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();

    const username = (e) => {
        set_emails(e.target.value)
        setfgEmail(e.target.value)
    }
    const passwords = (e) => {
        set_passwords(e.target.value)
        setfgPassword(e.target.value)
    };

    // ดึงข้อมูลข้อมูลอีเมลมาเช็ค
    useEffect(() => {
        axios.get('http://localhost:4001/users/getUsers').then((users) => {
            set_userdata(users.data)
        })
            .catch((error) => {
                console.log(error)
            })

        axios.get('http://localhost:4001/admin/email_admin')
            .then((response) => {
                setadmin_emailcheck(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });

    }, []);

    useEffect(() => {
        const email = userdata.map((item) => item.useremail)
        const setadminemail = admin_emailcheck.map((items) => items.adminmail)
        set_adminemail(setadminemail)
        set_useremail(email)
    }, [userdata, admin_emailcheck]);

    const login = () => {
        if (useremails.includes(email)) {
            axios.post('http://localhost:4001/users/logins', { email, password })
                .then((res) => {
                    if (res.data.data && res.data.data._id) {
                        const user = res.data.data._id.toString();
                        console.log(res.data.data.statusverify)
                        if (rememberMe) {
                            localStorage.setItem('email', fgemail);
                            localStorage.setItem('password', fgpassword);
                        }
                        else if (res.data.data.statusverify === false) {
                            sendOTP(email);
                            navigate('/Verify_otp', { state: { email } })
                        }else if(res.data.data.statusverify === true){
                            navigate('/Dashbord', { state: { user } })
                        }

                        // fecttopage(data);

                    } else if (res.data.success === false) {
                        console.log("Email or password Invalid")
                    }
                }).catch((err) => {
                    console.log(err)
                })
        } else if (adminemail.includes(email)) {
            axios.post('http://localhost:4001/admin/loginsadmin', { email, password })
                .then((admin) => {
                    if (admin.data.success && admin.data.data._id) {
                        console.log(admin.data)
                        const idadmin = admin.data.data._id.toString();
                        if (rememberMe) {
                            localStorage.setItem('email', fgemail);
                            localStorage.setItem('password', fgpassword);
                        }
                        // navigate('/Dowload_ad/' + adminemail)
                        navigate('/Dashbord_ad', { state: { idadmin } })

                        // admintopage(emailadmin);
                    } else {
                        console.log(admin.data.message)
                    }

                }).catch((error) => {
                    console.log(error)
                })
        }
    }

    // ส่งคำขอ OTP
    const sendOTP = (email) => {
        axios.post('http://localhost:4001/otp/sendOTP', { email })
            .then((OTP) => {
                console.log(OTP)
            }).catch((err) => {
                console.log(err)
            })
    }

    const fecttopage = (data) => {
        console.log(data)
        // navigate('/Dowload/' + data)
    }
    const admintopage = (emailadmin) => {
        console.log(emailadmin)
        // navigate('/Download_ad/' + emailadmin)
    }

    const storedUsername = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');

    useEffect(() => {
        if (storedUsername && storedPassword) {
            set_emails(storedUsername)
            set_passwords(storedPassword)
        }
    }, []);

    return (
        <div className='login-container'>
            <div className='bg'>
            </div>
            <div className='item-bg'>
                <div className='item-title'>
                    <div className='login-title'>
                        <div className='item-login'>
                            <h1>LOGIN</h1>
                        </div>
                        <div className='login-des'>
                            <p>Please login to book. Thankyou</p>
                        </div>
                    </div>
                </div>
                <div className='content-login'>
                    <div className='value-content'>
                        <div className='login'>
                            <div className='item-email'>
                                <label htmlFor="email" className="icon"> <FontAwesomeIcon icon={faEnvelope} /></label>
                                <input className='input' type="email" id='email' name='email' value={email} onChange={username} placeholder='email' />
                            </div>
                            <div className='item-password'>
                                <label htmlFor="password" className="icon"><FontAwesomeIcon icon={faLock} /></label>
                                <input className='input' type="password" id='password' name='password' value={password} onChange={passwords} placeholder='password' />
                            </div>
                            <div className='item-value'>
                                <div className='input-radio'>
                                    <div className='value-forgot'>
                                        <div className='radio'>
                                            <input className='radio' type="radio" name="forgot" id="forgot" defaultChecked={rememberMe} onClick={() => setRememberMe(!rememberMe)} />
                                        </div>
                                        <div className='forgot'>
                                            <label htmlFor="forgot"  >Forget Password?</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='login-btn'>
                                <button type='button' onClick={login}>Login</button>
                                <p>Don’t have an account? <Link className='link' to={'/Register'}>Sign Up</Link></p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Logins