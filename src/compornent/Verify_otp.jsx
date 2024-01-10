import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

function Verify_otp() {

    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state
    // สร้างฟังก์ชัน renderInput เพื่อกำหนดรูปแบบของช่องใส่ OTP
    const renderInput = (input, i) => (
        <input
            {...input}
            key={i}
            style={{
                border: "1px solid",
                borderRadius: "8px",
                width: "54px",
                height: "54px",
                fontSize: "16px",
                color: "#000",
                fontWeight: "400",
                caretColor: "blue",
                textAlign: "center",
                margin: "5px"
                // background: "black"
            }}
        />
    );


    //เก็บรหัส OTP
    const [otp, set_otp] = useState("")
    const [validotp, set_validotp] = useState(null)
    const changotp = (otp) => set_otp(otp)

    //ส่งรหัส otp ไปตรวจสอบ
    const sendsOTP = (email) => {
        const userOTP = otp;
        axios.post('http://localhost:4001/otp/verify-otp', { email, userOTP })
            .then((resotp) => {
                if (resotp.data.success === true) {
                    console.log(resotp.data.success)
                    statusupdate(email);
                } else {
                    set_validotp("Somthing went wrong. Please try again")
                }
            }).catch((err) => {
                console.log(err)
            })
    }

    //update statusverift == true
    const statusupdate = (email) => {
        axios.put('http://localhost:4001/users/update_verify', { email })
            .then((response) => {
                console.log('update successfully')
                navigate('/login')
            }).catch((err) => {
                console.log("Error", err)
            })
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

    console.log(validotp)

    return (
        <div className='otp'>
            <div className='content-otp'>
                <div className='itemotp'>
                    <div className='verifyotp'>
                        <div className='titleotp'>
                            <p>OTP valification</p>
                        </div>
                        <div className='OTP'>
                            <p>เราจะส่งอีเมล์ไปยัง{email}</p>
                        </div>
                        <div className='inputotp'>
                            <OtpInput
                                value={otp}
                                onChange={changotp}
                                numInputs={4}
                                separator={<span style={{ width: "8px" }}></span>}
                                isInputNum={true}
                                shouldAutoFocus={true}
                                renderInput={renderInput} // นี่คือการส่งฟังก์ชัน renderInput
                            />
                        </div>
                        <div className={`errotp ${validotp ? 'visible ' : ''}`}>
                            <p>{validotp}</p>
                        </div>
                        <div className='resendotp'>
                            <div className='title-resend'>
                                <p>Disnot receive OTP ? </p>
                            </div>
                            <div className='button-resend '>
                                <button type='button' onClick={() => sendOTP(email)}>Resend</button>
                            </div>
                        </div>
                        <div className='send-verify'>
                            <button type='button' onClick={() => sendsOTP(email)}>submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Verify_otp