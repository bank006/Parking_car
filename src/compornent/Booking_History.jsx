import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Booking_confirm from './Booking_confirm';
import '../css/bookinghis.css'

import Payment from '../compornent/patment/Payment';
import History from './History';
import Cancle from './Cancle';


function Booking_History(props) {
    // หน้าสินค้าก่อนกดยืนยันหลังจากนั้นส่งไปที่ booking_confirm

    // state show popup
    const [showpopup, set_showpopup] = useState(false)
    const [popupQR, set_popupQR] = useState(false)

    const [booking, set_booking] = useState([]);

    const { IDuser } = props.totalID;
    const [times, set_time] = useState([]);
    const [res, set_res] = useState([]);
    const [bookingid, set_bookingid] = useState([]);
    const navigate = useNavigate();


    const close = () => [
        set_showpopup(false)
    ]

    useEffect(() => {
        axios.get(`http://localhost:4001/booking/getbooking_product/${IDuser}`)
            .then((res) => {
                set_booking(res.data)
            }).catch((err) => {
                console.log(err);
            })
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:4001/booking/getdate/${IDuser}`)
            .then((time) => {
                set_time(time.data)
            }).catch((err) => {
                console.log(err)
            })
    }, [])

    useEffect(() => {
        const datatime = times.map((datatimes) => datatimes.bookingtime)
        set_res(datatime)
    }, [times])
    // console.log(res)

    // // ระบบการจอง เเละยกเลิกอัติโนมัติ
    const HALF_HOUR_MS = 30 * 60 * 1000;
    const [remainingTime, setRemainingTime] = useState({});

    useEffect(() => {
        const timeoutIds = {};

        times.forEach((doctime) => {
            const { IDproductregis, bookingtime, _id } = doctime;

            const updateRemainingTime = () => {
                const currentTime = new Date();
                const bookingTime = new Date(bookingtime);

                if (!isNaN(bookingTime)) {
                    const result = currentTime - bookingTime;

                    if (result < HALF_HOUR_MS) {
                        const timeLeft = HALF_HOUR_MS - result;
                        const hours = Math.floor(timeLeft / (60 * 60 * 1000));
                        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
                        const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);

                        const formattedTime = `${minutes} นาที ${seconds} วินาที`;

                        setRemainingTime((prevState) => ({
                            ...prevState,
                            [_id]: formattedTime,
                        }));
                        set_bookingid(doctime._id);

                        timeoutIds[_id] = setTimeout(updateRemainingTime, 1000);
                    } else if (result >= HALF_HOUR_MS) {
                        setRemainingTime((prevState) => ({
                            ...prevState,
                            [_id]: "หมดเวลาแล้ว!",
                        }));
                        preupdate(_id, IDproductregis)

                        // ... (ส่วนอื่น ๆ ที่ต้องการ)

                        clearTimeout(timeoutIds[_id]); // ยกเลิก setTimeout เมื่อหมดเวลา
                    }
                } else {
                    console.log("not data");
                }
            };

            updateRemainingTime();
        });

        return () => {
            Object.values(timeoutIds).forEach((timeoutId) => clearTimeout(timeoutId));
        };
    }, [times]);

    const preupdate = (_id, IDproductregis) => {
        putdatatohistorys(_id, IDproductregis)
    }

    // ลบข้อมูลการจองที่ยังไม่ได้ยืนยันการจองเเล้วหมดเวลาอัติโนมัติ
    const putdatatohistorys = (_id, IDproductregis) => {
        axios.delete(`http://localhost:4001/booking/deletebooking/${_id}`)
            .then((resdelete) => {
                console.log("ลบเอกสารนี้แล้ว", resdelete.data);
                // set_showpopup(true)
                // updatestock(IDproductregis); // อัพเดตสต็อกที่นี่
                window.location.reload();

            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        updatedata();
    }, [booking])


    // เเสดงสินค้าที่ยังไม่ได้ชำระเงิน
    const [notibtn, set_notibtn] = useState(null)
    const updatedata = () => {
        // let lgbtn 
        if (booking.length === 0) {
            set_showpopup(false)
            set_notibtn(null)
        } else {
            // set_showpopup(true)
            set_notibtn("มีสินค้าท่ียังไม่ได้รับการยืนยัน")
        }
    }



    // ลบข้อมูลด้วยปุ่ม
    // ลบข้อมูลการจองที่ยังไม่ได้ยืนยันการจองเเล้วหมดเวลาบบกดมือ
    const canclebooking = (IDbooking, IDproductregiscon) => {
        const _id = IDbooking
        const IDproductregis = IDproductregiscon
        const IDproduct = IDproductregiscon
        axios.delete(`http://localhost:4001/booking/deletebooking/${_id}`)
            .then((resdelete) => {
                console.log("ลบเอกสารนี้แล้ว", resdelete.data);
                // set_showpopup(true)
            })
            .catch((err) => {
                console.log(err);
            });

        //เพ่ิมสินค้าใน stock เมื่อกดยกเลิก
        axios.put(`http://localhost:4001/product/updatestock/${IDproductregis}`)
            .then((restock) => {
                console.log("เพิ่ม stock เเล้ว", restock)
                window.location.reload();
            }).catch((err) => {
                console.log(err)
            })

        axios.post('http://localhost:4001/cancel/postcancel', { IDproduct, IDuser })
            .then((res) => {
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })
    }

    // การเพิ่มข้อมูลการยืนยันเมื่อทำการจอง
    const clicktobooking = (IDbooking, IDproductregiscon, IDusercon, storeregiscon, timebookingcon, startbookingtime, bookingtimecon, amount, price, parkingbox) => {
        const timestartString = new Date(startbookingtime)
        const timeendString = new Date(timebookingcon)
        const deferrenttime = timeendString - timestartString
        const pricesell = amount / 60
        const minuttime = deferrenttime / (1000 * 60)
        const amoutperminute = pricesell * minuttime
        const integerMinutes = Math.round(amoutperminute)
        const statuspayment = true
        // เพิ่มข้อมูลการจองลงในตัวนับเวลา
        axios.post('http://localhost:4001/bookingcon/postcon', { IDbooking, IDproductregiscon, IDusercon, storeregiscon, timebookingcon, startbookingtime, bookingtimecon, statuspayment, parkingbox })
            .then((bookingcon) => {
                console.log(bookingcon.data)
                putdatatohistory(bookingid)
            }).catch((err) => {
                console.log(err)
            })

        //ลบข้อมูลออกจากการยืนยันการจอง
        const putdatatohistory = (_id) => {
            axios.delete(`http://localhost:4001/booking/deletebooking/${_id}`)
                .then((resdelete) => {
                    console.log("ลบเอกสารนี้แล้ว", resdelete.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        // confirm booking and save to schema bookinhis name

        const IDbookinghis = IDbooking;
        const IDproductregishis = IDproductregiscon;
        const IDuserhis = IDusercon;
        const storeregishis = storeregiscon;
        const timebookinghis = timebookingcon;
        const bookingtimehis = startbookingtime;
        const timeregister = bookingtimecon;
        //บันทึกลงประวัติการจอง
        axios.post('http://localhost:4001/bookinghis/posthistory', { IDbookinghis, IDproductregishis, IDuserhis, storeregishis, timebookinghis, bookingtimehis, timeregister, statuspayment, parkingbox }).
            then((resconf) => {
                if (!resconf) {
                    console.log('somthing error')
                } else {
                    post_to_income(IDbookinghis, IDproductregishis, IDuserhis, storeregishis, timebookinghis, bookingtimehis, statuspayment, price);
                    console.log(resconf.data)
                }
            }).catch((err) => {
                console.log(err)
            })

        //จ่ายเงินด้วย qr
        const id = IDbooking
        axios.post('http://localhost:4001/payment/generateQR', { integerMinutes, id })
            .then((resqr) => {
                console.log("เพิ่ม qr เเล้ว", resqr.data)
                getimagepayment(id)//ส่งข้อมูลไปขอ qr code
                set_popupQR(true)
            }).catch((err) => {
                console.log(err)
            })
    }

    //ลงข้อมูลในรายได้
    const post_to_income = (IDbookinghis, IDproductregishis, IDuserhis, storeregishis, timebookinghis, bookingtimehis, statuspayment, price) => {
        axios.post('http://localhost:4001/income/postincome', { IDbookinghis, IDproductregishis, IDuserhis, storeregishis, timebookinghis, bookingtimehis, statuspayment, price })
            .then((res) => {
                console.log(res.data)
                putview(IDproductregishis)
            }).catch((err) => {
                console.log(err)
            })
    }

    //ลงยอดการซื้อสินค้า
    const putview = (IDproductregishis) => {
        console.log(IDproductregishis)
        axios.put(`http://localhost:4001/product/putview/${IDproductregishis}`).then((view) => {
            console.log(view)
        }).catch((err) => {
            console.log(err)
        })
    }

    // เอารูป qr การจ่ายเงินมาเเสดง
    const [imagepayment, set_imagepayment] = useState([])
    const getimagepayment = (id) => {
        axios.get(`http://localhost:4001/payment/getpayment/${id}`)
            .then((itempayment) => {
                set_imagepayment(itempayment.data)
            }).catch((err) => {
                console.log(err)
            })
    }

    const reload = () => {
        window.location.reload();
    }

    const [showpayment, set_showpayment] = useState(true)
    const [showactive, set_showactive] = useState(false)
    const [showactive3, setshowactive3] = useState(false)
    const [showactive4, setshowactive4] = useState(false)
    const [showactive5, setshowactive5] = useState(false)

    // popup show hinstory
    const showhistory = () => {
        set_showpopup(!showpopup);
    }

    const showpayments = () => {
        const id = 1
        set_showactive(false)
        handlebtncolor(id)
        setshowactive3(false)
        setshowactive4(false)

    }

    const setactive = () => {
        const id = 2
        set_showactive(true)
        handlebtncolor(id)
        setshowactive3(false)
        setshowactive4(false)

    }

    const active3 = () => {
        const id = 3
        setshowactive3(true)
        handlebtncolor(id)
        set_showactive(false)
        setshowactive4(false)

    }

    const active4 = () => {
        const id = 4
        setshowactive4(true)
        handlebtncolor(id)
        set_showactive(false)
        setshowactive3(false)
    }

    useEffect(() => {
        if (booking.length !== 0) {
            set_showpayment(true)
        } else {
            set_showpayment(false)
        }
    }, [booking])


    const [btncolor, setbtncolor] = useState({ ID: 1, color: '#FFBA35' })

    const handlebtncolor = (id) => {
        setbtncolor({ ID: id, color: '#FFBA35' })
    }

    return (
        <div className='containers'>
            <div className='button-click'>
                <div className={`popup ${showpopup ? 'visible' : ''}`}>
                    <div style={{ marginTop: '167px' }} className='booking'>
                        <div className="openbooking">
                            <div className="itemopenbooking">
                                <button style={{ backgroundColor: btncolor.ID === 1 ? `${btncolor.color}` : '' }} onClick={showpayments}>payment</button>
                                <button style={{ backgroundColor: btncolor.ID === 2 ? `${btncolor.color}` : '' }} onClickCapture={setactive}>booking</button>
                                <button style={{ backgroundColor: btncolor.ID === 3 ? `${btncolor.color}` : '' }} onClick={active3} >ประวัติการจอง</button>
                                {/* <button style={{ backgroundColor: btncolor.ID === 4 ? `${btncolor.color}` : '' }} onClick={active4} >ยกเลิก</button>
                                <button>การคืนเงิน</button> */}
                            </div>
                        </div>

                        <div className="container-item">
                            <div className='item'>
                                {showpayment === true ? (
                                    <>
                                        {booking.map((booking, index) => {
                                            const DateString = booking.bookingtime
                                            const dateObject = new Date(DateString)
                                            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
                                            const formattedDateTime = dateObject.toLocaleDateString('en-US', options);

                                            const IDbooking = booking._id
                                            const IDproductregiscon = booking.IDproductregis
                                            const IDusercon = booking.IDuser
                                            const storeregiscon = booking.storeregis
                                            const timebookingcon = booking.timeregis
                                            const startbookingtime = booking.startbookingregis
                                            const bookingtimecon = booking.bookingtime
                                            const parkingbox = booking.parkingbox
                                            const amount = booking.product[0].priceProduct
                                            // นำรหัสสินค้า (product ID) มาตรวจสอบว่ามีใน remainingTime หรือไม่
                                            const productId = booking.product[0]._id;
                                            const price = booking.product[0].priceProduct

                                            const timestartString = new Date(startbookingtime)
                                            const timeendString = new Date(timebookingcon)

                                            const deferrenttime = timeendString - timestartString
                                            const pricesell = amount / 60
                                            const minuttime = deferrenttime / (1000 * 60)
                                            const hours = Math.floor(minuttime / 60);
                                            const totalPrice = pricesell * minuttime
                                            const amoutperminute = Math.round(totalPrice)

                                            const remainingTimeForProduct = remainingTime ? remainingTime[IDbooking] || "เวลาหมด" : "เวลาหมด";
                                            return (
                                                <div className='container-box-pay' key={index}>
                                                    <div className="all-box">
                                                        <div className="item-all-box">
                                                            <div className="boxpay-namestore">
                                                                <p>{booking.store[0].nameStore}</p>

                                                                <div style={{ marginRight: '20px' }}>
                                                                    <p>{remainingTimeForProduct}</p>
                                                                </div>
                                                            </div>
                                                            <div className="item-box-pay">
                                                                <div className="itemabouestore">
                                                                    <div className="img-payment">
                                                                        <img src={`../imageproduct/${booking.product[0].imageProduct}`} alt="" />
                                                                    </div>
                                                                    <div className='point-payment'>
                                                                        <div className='pay'>
                                                                            <p> ชื่อร้านที่จอง</p>
                                                                        </div>
                                                                        {/* <div className='pay'>
                                                                            <p>วันที่จอง</p>
                                                                        </div> */}
                                                                        <div className='pay'>
                                                                            <p>ราคา/ต่อชั่วโมง</p>
                                                                        </div>
                                                                        <div className='pay'>
                                                                            <p>เวลาที่ใช้</p>
                                                                        </div>
                                                                        <div className='pay'>
                                                                            <p>ราคารวม</p>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div className="itemaboutpayment">
                                                                    <div className='pay'>
                                                                        <p>{booking.store[0].nameStore}</p>
                                                                    </div>
                                                                    <div className='pay'>
                                                                        <p>{booking.product[0].priceProduct}</p>
                                                                    </div>
                                                                    <div className='pay'>
                                                                        <p>{hours}</p>
                                                                    </div>
                                                                    <div className='pay'>
                                                                        <p>{amoutperminute} บาท</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='btn-payment'>
                                                                <div className='cancel-btn-payment'>
                                                                    <button type='button' onClick={() => canclebooking(IDbooking, IDproductregiscon)}>cancle</button>
                                                                </div>
                                                                <div className='submit-btn-payment'>
                                                                    <button type='button' onClick={() => clicktobooking(IDbooking, IDproductregiscon, IDusercon, storeregiscon, timebookingcon, startbookingtime, bookingtimecon, amount, price, parkingbox)}>จ่ายเงิน</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </>
                                ) :
                                    <div className='ordernot-payment'>
                                        <p>ไม่มีสินค้าที่ต้องชำระ</p>
                                    </div>
                                }

                                {showactive3 === true ? (
                                    <div>
                                        <History IDuser={{ IDuser }} />
                                    </div>
                                ) : null}

                                {showactive4 === true ? (
                                    <div>
                                        <Cancle  IDuser={{ IDuser }}/>
                                    </div>
                                ) : null}

                                {showactive === true ? (
                                    <div>
                                        <Booking_confirm IDuser={{ IDuser }} />
                                    </div>
                                ) : null}




                            </div>
                        </div>
                    </div>
                </div>

                <div  className={`popupQR ${popupQR ? 'visible' : ''}`}>
                    <div style={{display:'flex',justifyContent:'center',borderRadius:'13px' , alignItems:'center'}} className='item-QR'>
                        {imagepayment.map((QRs, index) => {
                            const imageQR = QRs.imageQR
                            return (
                                <div className='QR-content' key={index}>
                                    <div>
                                        <p style={{textAlign:'center'}}>ชำระเงิน</p>
                                    </div>
                                    <img src={`http://localhost:4001/images/${imageQR}`} alt="QR Code"></img>
                                    <p style={{textAlign:'center'}}>ราคา : {QRs.amount}</p>
                                    <div style={{display:'flex', justifyContent:'center'}} className=''>
                                        <button style={{background:'none' , border:'none' , backgroundColor:'#DD9304' , width:'100px' , marginTop:'15px' , height:'30px' , borderRadius:'13px'}} onClick={reload}>เสร็จสิน</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <Payment IDuser={{ IDuser }} />
                <div style={{ position: 'relative', zIndex: '5' }} className="btnshowregis">
                    <button className='open-register' onClick={showhistory} >การจอง</button>
                </div>
            </div>

        </div>
    )
}

export default Booking_History