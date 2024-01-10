import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import '../css/otp.css'
import '../css/register.css'


function Regiser() {
    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [passwordnh, setpasswordnh] = useState('');
    // สำหรับการเช็คค่า email ซำ้ใน users เเละการส่งเข้าลูปเพื่อดึงข้อมูล
    const [datas, setdata] = useState([]);
    const [emails, setEmails] = useState([]);

    const [cpass, setcpass] = useState('')

    // สำหรับการเช็คค่า email ซำ้ใน admin เเละการส่งเข้าลูปเพื่อดึงข้อมูล
    const [admin_emailcheck, setadmin_emailcheck] = useState([])
    const [emaildata, setemaildata] = useState([])

    const navigate = useNavigate();

    const handleregister = (e) => {
        e.preventDefault();

        try {
            if (name == '') {
                alert("something went worng")
                navigate("/Register")
            } else if (password == '') {
                alert("something went wrong")
                navigate("/Register")
            } else if (emails.includes(email) || emaildata.includes(email) || email == '') {
                alert("Email went wrong")
                navigate("/Register")
            } else if (password != cpass) {
                alert("password not match")
                navigate("/Register")
            } else {
                // navigate("/logins")
                const statusverify = false;
                axios.post('http://localhost:4001/users/register', { name, email, password, passwordnh, statusverify })
                sendOTP(email);
                navigate('/Verify_otp', { state: { email } })
            }
        }
        catch (error) {
            console.log(error)
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

    const name1 = (e) => {
        setname(e.target.value)
    }
    const email1 = (e) => {
        setemail(e.target.value)
    }
    const password1 = (e) => {
        setpassword(e.target.value)
        setpasswordnh(e.target.value)
    }
    const cpass1 = (e) => {
        setcpass(e.target.value)
    }

    // การดึง APIs สำหรับการเช็คอีเมลของ users
    useEffect(() => {
        axios.get('http://localhost:4001/users/getemail')
            .then((datas) => {
                setdata(datas.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    // การลูปเอาข้อมูลใน Array
    useEffect(() => {
        const emailList = datas.map((item) => item.email);
        setEmails(emailList);

    }, [datas]);

    // การดึง APIs สำหรับการเช็คอีเมลของ admin
    useEffect(() => {
        axios.get('http://localhost:4001/admin/email_admin')
            .then((response) => {
                setadmin_emailcheck(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [])
    // console.log(email_admin)

    // การลูปเอาข้อมูลใน Array
    useEffect(() => {
        const email_admin = admin_emailcheck.map((item) => item.adminmail);
        setemaildata(email_admin)
    }, [admin_emailcheck])

    return (
        <div className='content-regis'>
            <div className='item-register'>
                <div className='form-regis'>
                    <div className='box-register'>
                        <div className='regis-title'>
                            <p>REGISTER</p>
                        </div>
                        <div className='containerinput'></div>
                        <div className='regis-boxinput'>
                            <label className='regis-icon' htmlFor="username"><FontAwesomeIcon icon={faUser} /></label>
                            <input className='regis-input' type="text" onChange={name1} placeholder='username' />
                        </div>
                        <div className='regis-boxinput'>
                            <label className='regis-icon' htmlFor="email"><FontAwesomeIcon icon={faEnvelope} />  </label>
                            <input className='regis-input' type="email" onChange={email1} placeholder='email' />
                        </div>
                        <div className='regis-boxinput'>
                            <label className='regis-icon' htmlFor="password"><FontAwesomeIcon icon={faLock} />  </label>
                            <input className='regis-input' type="password" onChange={password1} placeholder='password' />
                        </div>
                        <div className='regis-boxinput'>
                            <label className='regis-icon' htmlFor="confrimepassword"><FontAwesomeIcon icon={faLock} /> </label>
                            <input className='regis-input' type="password" onChange={cpass1} placeholder='confirmpassword' />
                        </div>
                        <div className='btn-submit'>
                            <button type='submit' onClick={handleregister}>submit</button>
                        </div>

                    </div>
                </div>
                <div className='register-bg'> </div>
            </div>

        </div>
    )
}

export default Regiser