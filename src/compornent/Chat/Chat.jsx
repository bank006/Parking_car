import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom'

import './chat.css'

function Chat() {
    const storeListRef = useRef(null);
    const [message, set_message] = useState([])
    const [storelist, setstorelist] = useState([])
    const [IDstorechat, set_IDchat] = useState([])
    const [IDuserchat, set_IDuserchat] = useState()
    const [count, set_count] = useState()
    const [countmessage, setcountmessage] = useState()
    const location = useLocation();
    const { IDuser, storeregis } = location.state



    // เพิ่มการหา ID ของ storechat ด้วย IDstore
    useEffect(() => {
        axios.get(`http://localhost:4001/storechat/getstorebyid/${storeregis}`)
            .then((res) => {
                setstorelist(res.data)
            }).catch((err) => {
                console.log(err)
            })

        axios.get(`http://localhost:4001/userschat/getuserchat/${IDuser}`)
            .then((res) => {
                const userchatid = res.data
                const getuserchatid = userchatid.map((id) => id._id)
                set_IDuserchat(getuserchatid[0])
            }).catch((err) => {
                console.log(err)
            })
    }, [IDuserchat])

    useEffect(() => {//นำค่า ID ของ chat ออกมาเพื่อช่วยในการระบุช่องแชท
        const getIDchat = storelist.map((Id) => Id._id)
        set_IDchat(getIDchat[0])
    }, [storelist])

    // กดที่ช่อง message เพื่อสร้าง idช่องแชท idchatsore iduserchat
    // กดส่งข้อมูลด้วยการส่งค่า idช่องแชท idร้านค้า idผู้ใช้งาน ไปใช้งาน
    const sendmessage = () => {
        const status = 1
        axios.post('http://localhost:4001/chatmessage/postmessage', { IDstorechat, IDuserchat, message, status })
            .then((res) => {
                set_message([]);
                window.location.reload();
            }).catch((err) => {
                console.log(err)
            })
    }
    // เรียกแชทที่ตรงกันออกมาทั้งหมด
    const [messagecall, set_messagecall] = useState([])
    useEffect(() => {
        if (IDstorechat && IDuserchat) {
        
            axios.get(`http://localhost:4001/chatmessage/getmessage/${IDstorechat}/${IDuserchat}`)
                .then((messagecall) => {
                    set_messagecall(messagecall.data)
                }).catch((err) => {
                    console.log("Error", err)
                })

        }
    }, [IDuserchat, IDstorechat])

    // รีเฟรชข้อมูลที่มีผู้ส่งข้อความใหม่เข้ามา
    useEffect(() => {
        const interval = setInterval(() => {
            // ตรวจสอบข้อความใหม่ทุกๆ 5 วินาที
            if (IDstorechat && IDuserchat) {
                axios.get(`http://localhost:4001/chatmessage/countMessages/${IDstorechat}/${IDuserchat}`)
                    .then(response => {
                        // เปรียบเทียบความยาวของ messages เดิมกับ messages ใหม่
                        if (response.data.count > messagecall.length) {
                            // ถ้ามีข้อความใหม่เข้ามา ให้รีเฟรชหน้า
                            window.location.reload();
                        } else {
                            console.log('not new message')
                        }
                    })
                    .catch(error => {
                        console.error('Error checking for new messages:', error);
                    });
            }
        }, 1000); // ตรวจสอบทุกๆ 5 วินาที

        return () => clearInterval(interval); // ลบ interval เมื่อ unmount
    }, [messagecall, IDuserchat, IDstorechat]); // ใช้ useEffect เมื่อ messages เปลี่ยนแปลง


    // ดึงหน้าเเชทลงมาล่างสุด
    useEffect(() => {
        scrollToBottom();
    }, [messagecall]);

    const scrollToBottom = () => {
        if (storeListRef.current) {
            storeListRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // ตรวจสอบการสร้างประวัติการแชท
    // const [historychat, sethistorychat] = useState([])
    const [showinputvalue, setshowinputvalue] = useState(false)

    useEffect(() => {
        if (IDuserchat && IDstorechat) {
            const IDstore = storeregis
            axios.get(`http://localhost:4001/historychat/gethistorychat/${IDstorechat}/${IDuserchat}`)
                .then((historychat) => {
                    console.log(historychat.data.length)
                    if (historychat.data.length === 0) {
                        Swal.fire({
                            icon: 'info',
                            title: 'ยืนยันการใช้งาน chat',
                            showCancelButton: true,
                            cancelButtonText: 'ยกเลิก',
                            confirmButtonText: 'ตกลง',

                        }).then((res) => {
                            if (res.isConfirmed === true) {
                                setshowinputvalue(true)
                                pushhistorychat(IDstorechat, IDuserchat , IDuser , IDstore)
                            }
                        })
                    } else {
                        setshowinputvalue(true)
                    }

                }).catch((err) => {
                    console.log(err)
                })
        }

    }, [IDstorechat, IDuserchat])


    const pushhistorychat = (IDstorechat, IDuserchat , IDuser , IDstore) => {
        axios.post('http://localhost:4001/historychat/posthistorychat', { IDstorechat, IDuserchat , IDuser , IDstore})
        .then((success) => {
            console.log(success.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <div className='container-chat'>
            {showinputvalue === true ? (
                <div className="scoll-container-message">
                    {storelist.map((storedata, index) => {
                        return (
                            <div className='item-store-message' key={index}>
                                <div className="name-store-message">
                                    <p>{storedata.store[0].nameStore}</p>
                                </div>
                            </div>
                        )
                    })}
                    {storelist.length > 0 ? (
                        <div className='item-message'>

                            {messagecall.map((messagedata, index) => {
                                const timestamp = messagedata.timestamp; // ตัวอย่าง timestamp ที่ให้มา
                                const date = new Date(timestamp); // สร้างวัตถุ Date จาก timestamp

                                const hours = date.getHours(); // รับค่าชั่วโมง (24 ชั่วโมง)
                                const minutes = date.getMinutes(); // รับค่านาที

                                let formattedHours = hours % 12; // แปลงเวลาให้อยู่ในรูปแบบ 12 ชั่วโมง
                                formattedHours = formattedHours === 0 ? 12 : formattedHours; // 12:00 PM ไม่ใช่ 0:00 PM

                                const ampm = hours >= 12 ? 'PM' : 'AM'; // กำหนด AM หรือ PM

                                const formattedTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`; // รวมเวลาที่แปลงแล้ว
                                return (
                                    <div className='patitionmessage' key={index}>
                                        {messagedata.status === '1' ? (
                                            <div className='item-message-user'>
                                                <div className="time-message-user">
                                                    <p>{formattedTime}</p>
                                                </div>
                                                <div className="contentmessageuser">
                                                    <p>{messagedata.message}</p>
                                                </div>
                                            </div>
                                        ) :
                                            <div className='item-message-store'>
                                                <div className="contentmessagestore">
                                                    <p>{messagedata.message}</p>
                                                </div>
                                                <div className="time-message-store">
                                                    <p>{formattedTime}</p>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                )
                            })}
                            <div ref={storeListRef}></div>
                        </div>
                    ) : (
                        <div style={{ height: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <p>ผู้ให้บริการไม่ได้เปิดใช่บริการ chat</p>
                        </div>
                    )}

                    <div className="input-message">
                        <div className="input-message-value">
                            <input value={message} onChange={(e) => set_message(e.target.value)} type="text" placeholder='Type to add your message' />
                        </div>
                        <div className="btn-sunmit-message">
                            <button onClick={sendmessage}><img src="/public/Sent.png" alt="" /></button>
                        </div>
                    </div>
                </div>
            ) :
            <div>
                <p>ทางร้านไม่ได้เปิดบริการ chat</p>
            </div>
            }


        </div>
    )
}

export default Chat