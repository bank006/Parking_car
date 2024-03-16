import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { useLocation } from 'react-router-dom'

function Userboxstore() {
    const storeListRef = useRef(null);
    const location = useLocation();
    const IDstores = location.state?.IDstores

    const [iconchat, seticonchat] = useState([])
    const [IDstorechat, set_IDstorechat] = useState([])
    const [IDuserchat, set_IDuserchat] = useState([])
    const [messagecall, set_messagecall] = useState([])
    const [showinputmessage, setshowinputmessage] = useState(false)

    useEffect(() => {
        axios.get(`http://localhost:4001/historychat/getchatuser/${IDstores}`)
            .then((historychat) => {
                seticonchat(historychat.data)
            }).catch((err) => {
                console.log(err)
            })
    }, [IDstores])



    const setclasschat = (storeregis, IDstorechat, IDuserchat) => {
        // console.log(storeregis, IDstorechat, IDuserchat)
        set_IDstorechat(IDstorechat)
        set_IDuserchat(IDuserchat)
        setshowinputmessage(true)
        axios.get(`http://localhost:4001/chatmessage/getmessage/${IDstorechat}/${IDuserchat}`)
            .then((messagecall) => {
                set_messagecall(messagecall.data)
            }).catch((err) => {
                console.log("Error", err)
            })
    }

    // console.log(IDstorechat, IDuserchat)


    const [Message, set_Message] = useState([])
    const [Mesaageupdate, set_Messageupdate] = useState([])
    const [IDchat , setIDchat] = useState([])


    const setvaluemessage = (e) => {
        set_Message(e.target.value)
    }

    const setvaluemessageupdate =(e)=>{
        set_Messageupdate(e.target.value)
    }

    const sendmessage = () => {
        const status = 0
        const message = Message
        axios.post('http://localhost:4001/chatmessage/postmessage', { IDstorechat, IDuserchat, message, status })
            .then((res) => {
                set_Message([]);
            }).catch((err) => {
                console.log(err)
            })
    }


    const setMessageupdate = (message , IDchat) => {
        set_Messageupdate(message)
        setIDchat(IDchat)
    }

    const sendmessageupdate = ()=>{
        axios.put(`http://localhost:4001/chatmessage/updatemessage/${IDchat}`,{Mesaageupdate})
        .then((updateres)=>{
            const storeregis = IDstores
            setclasschat(storeregis, IDstorechat, IDuserchat)
            setMessageupdate([]);
            setshowbtnmessage(!showbtnmessage)
        }).catch((err)=>{
            console.log(err)
        })
    }

    const [notrealtimemessage, setnotrealtimemessage] = useState([])

    useEffect(() => {
        const filteredMessages = messagecall.filter(mes => mes.status === '0');
        const checkupdatemessage = filteredMessages.map(mes => ({
            status: mes.status,
            message: mes.message
        }));
        const messagenot = checkupdatemessage.map(item => item.message)
        setnotrealtimemessage(messagenot)
    }, [messagecall]);

    useEffect(() => {
        const interval = setInterval(() => {
            // ตรวจสอบข้อความใหม่ทุกๆ 5 วินาที
            if (IDstorechat.length !== 0 && IDuserchat.length !== 0) {
                axios.get(`http://localhost:4001/chatmessage/countMessages/${IDstorechat}/${IDuserchat}`)
                    .then(response => {
                        // เปรียบเทียบความยาวของ messages เดิมกับ messages ใหม่
                        // console.log(response.data > messagecall.length)
                        if (response.data.count > messagecall.length) {
                            // ถ้ามีข้อความใหม่เข้ามา ให้รีเฟรชหน้า
                            const storeregis = IDstores
                            console.log(response.data.count, messagecall.length)
                            setclasschat(storeregis, IDstorechat, IDuserchat)
                            // window.location.reload();
                        } else if (response.data.count < messagecall.length) {
                            const storeregis = IDstores
                            setclasschat(storeregis, IDstorechat, IDuserchat)
                        }
                    })
                    .catch(error => {
                        console.error('Error checking for new messages:', error);
                    });
            }
            if(IDstorechat.length !== 0 && IDuserchat.length !== 0){
                axios.get(`http://localhost:4001/chatmessage/getstatueMessagesuser/${IDstorechat}/${IDuserchat}`)
                .then((res)=>{
                    
                    const storeregis = IDstores
                    const realtime =  res.data
                    const setrealtime =  realtime.map(item => item.message)
                    if(JSON.stringify(notrealtimemessage) !==  JSON.stringify(setrealtime)){
                        console.log(notrealtimemessage , realtime)
                        setclasschat(storeregis, IDstorechat, IDuserchat)
                    }else{
                        console.log('ตรงกัน')
                    }
                }).catch((err)=>{
                    console.log(err)
                })
            }
        }, 1000); // ตรวจสอบทุกๆ 5 วินาที

        return () => clearInterval(interval); // ลบ interval เมื่อ unmount
    }, [IDstorechat, IDuserchat, IDstores, messagecall])


    // ดึงหน้าเเชทลงมาล่างสุด
    useEffect(() => {
        scrollToBottom();
    }, [messagecall]);

    const scrollToBottom = () => {
        if (storeListRef.current) {
            storeListRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const [showbtnmessage, setshowbtnmessage] = useState(false)
    const [idchatupdate, setidchatupdate] = useState([])
    const [idupdatemessage, setidupdatemessage] = useState([])

    const showeupdate = (IDchat) => {
        setshowbtnmessage(!showbtnmessage)
        setidchatupdate(IDchat)
    }

    const deletmessage = (IDchat) => {
        console.log(IDchat)
        axios.delete(`http://localhost:4001/chatmessage/deletemessage/${IDchat}`)
            .then((res) => {
                console.log('ลบข้อความนี้เเล้ว', res)
            }).catch((err) => {
                console.log(err)
            })
    }





    return (
        <div className='container-userbox'>
            <div className="allitem-userbox">
                <div className="all-box-chat">
                    <div className="title-chatbox">
                        <img src="./public/ChatMessage.png" alt="" />
                        <p>inbox</p>
                    </div>
                    <div className="box-chat">
                        <div className="allchatleft">
                            <div className="item-store">
                                {iconchat.map((datas, index) => {
                                    const storeregis = datas.store[0]._id
                                    const IDstorechat = datas.IDstorechat
                                    const IDuserchat = datas.IDuserchat
                                    return (
                                        <div className='item-content-chathis' key={index}>
                                            {/* <img src={`./public/imagestore/${datas.store[0].imageStores}`} alt="" /> */}
                                            <button onClick={() => setclasschat(storeregis, IDstorechat, IDuserchat)}>
                                                <p>{datas.user[0].name}</p>
                                            </button>
                                        </div>
                                    )
                                })}

                            </div>
                        </div>
                        <div className="allcahtright">
                            <div className="value-chat">
                                <div className="item-chat">
                                    {messagecall.map((messagedata, index) => {
                                        const IDchat = messagedata._id
                                        const message = messagedata.message
                                        const timestamp = messagedata.timestamp; // ตัวอย่าง timestamp ที่ให้มา
                                        const date = new Date(timestamp); // สร้างวัตถุ Date จาก timestamp

                                        const hours = date.getHours(); // รับค่าชั่วโมง (24 ชั่วโมง)
                                        const minutes = date.getMinutes(); // รับค่านาที

                                        let formattedHours = hours % 12; // แปลงเวลาให้อยู่ในรูปแบบ 12 ชั่วโมง
                                        formattedHours = formattedHours === 0 ? 12 : formattedHours; // 12:00 PM ไม่ใช่ 0:00 PM

                                        const ampm = hours >= 12 ? 'PM' : 'AM'; // กำหนด AM หรือ PM

                                        const formattedTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`; // รวมเวลาที่แปลงแล้ว
                                        return (
                                            <div className='message-chat' key={index}>
                                                {messagedata.status === '0' ? (
                                                    <div className='user-chat'>
                                                        <div className="all-user-chat">
                                                            <div className="time-user-chat">
                                                                <p>{formattedTime}</p>
                                                            </div>
                                                            <div className=''>
                                                                <div className="message-user-chat">
                                                                    <p>{messagedata.message}</p>
                                                                </div>
                                                                {showbtnmessage === true && idchatupdate === IDchat ? (
                                                                    <div style={
                                                                        {
                                                                            textAlign: 'end',
                                                                            border: '1px solid black'
                                                                        }
                                                                    }
                                                                    >
                                                                        <div>
                                                                            <button onClick={() => deletmessage(IDchat)} style={{ cursor: 'pointer', margin: '2px', border: 'none', background: 'none' }}>ลบ</button>
                                                                        </div>
                                                                        <div>
                                                                            <button onClick={() => setMessageupdate(message ,IDchat)} style={{ cursor: 'pointer', margin: '2px', border: 'none', background: 'none' }}>แก้ไข</button>
                                                                        </div>
                                                                    </div>
                                                                ) :
                                                                    <div style={{ textAlign: 'end', fontSize: '9' }}>
                                                                        <button onClick={() => showeupdate(IDchat)} style={{ cursor: 'pointer', margin: '2px', border: 'none', background: 'none' }}>...</button>
                                                                    </div>

                                                                }

                                                            </div>
                                                        </div>
                                                    </div>
                                                ) :
                                                    <div className='store-chat'>
                                                        <div className="all-store-chat">
                                                            <div className="message-store-chat">
                                                                <p>{messagedata.message}</p>
                                                            </div>
                                                            <div className="time-store-chat">
                                                                <p>{formattedTime}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        )
                                    })}
                                    <div ref={storeListRef}></div>
                                </div>
                            </div>
                            {Mesaageupdate.length > 0 ? (
                                <div className={`input-message-chatbox ${showinputmessage ? 'visible' : ''}`}>
                                    <input value={Mesaageupdate} onChange={setvaluemessageupdate} type="text" placeholder='Type to add your message' />
                                    <button onClick={()=>sendmessageupdate(IDchat)}><img src="/public/Sent.png" alt="" /></button>
                                </div>
                            ) :
                                <div className={`input-message-chatbox ${showinputmessage ? 'visible' : ''}`}>
                                    <input value={Message} onChange={setvaluemessage} type="text" placeholder='Type to add your message' />
                                    <button onClick={sendmessage}><img src="/public/Sent.png" alt="" /></button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Userboxstore