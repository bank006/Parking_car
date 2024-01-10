import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Booking_confirm from './Booking_confirm';
import '../css/bookinghis.css'

import Payment from '../compornent/patment/Payment';
import Notification from './notification/notification';

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

    // popup show hinstory
    const showhistory = () => {
        set_showpopup(true);
    }
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

                        const formattedTime = `${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`;

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
    }

    // การเพิ่มข้อมูลการยืนยันเมื่อทำการจอง
    const clicktobooking = (IDbooking, IDproductregiscon, IDusercon, storeregiscon, timebookingcon, startbookingtime, bookingtimecon, amount, price) => {
        const timestartString = new Date(startbookingtime)
        const timeendString = new Date(timebookingcon)
        const deferrenttime  =  timeendString - timestartString 
        const pricesell = amount / 60
        const minuttime =  deferrenttime / (1000 * 60) 
        const amoutperminute = pricesell * minuttime
        const integerMinutes = Math.round(amoutperminute)
        const statuspayment = true
        // เพิ่มข้อมูลการจองลงในตัวนับเวลา
        axios.post('http://localhost:4001/bookingcon/postcon', { IDbooking, IDproductregiscon, IDusercon, storeregiscon, timebookingcon, startbookingtime, bookingtimecon, statuspayment })
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
        const bookingtimehis = bookingtimecon;
        //บันทึกลงประวัติการจอง
        axios.post('http://localhost:4001/bookinghis/posthistory', { IDbookinghis, IDproductregishis, IDuserhis, storeregishis, timebookinghis, bookingtimehis, statuspayment }).
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

        // // ลบ stock เข้าไปเมื่อกดจอง
        axios.put(`http://localhost:4001/product/updatepostbooking/${IDproductregiscon}`)
          .then((update) => {
            console.log(update)
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
    return (
        <div className='containers'>
            <div className='button-click'>

                <div className={`popup ${showpopup ? 'visible' : ''}`}>
                    <div className='booking'>
                        <p>booking</p>
                        <Booking_confirm IDuser={{ IDuser: IDuser }} />
                        <button onClick={close} >close</button>
                        <div className='item'>

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
                                const amount = booking.product[0].priceProduct
                                // นำรหัสสินค้า (product ID) มาตรวจสอบว่ามีใน remainingTime หรือไม่
                                const productId = booking.product[0]._id;
                                const price = booking.product[0].priceProduct
                                const remainingTimeForProduct = remainingTime ? remainingTime[IDbooking] || "เวลาหมด" : "เวลาหมด";
                                return (
                                    <div className='itemname' key={index}>
                                        <p>{booking.product[0]._id}</p>
                                        {/* <p>ชื่อร้าน : {booking.store[0].nameStore}<button onClick={()=> navigate(`/Detail_store/${booking.store[0]._id}/${IDuser}`)}>go store</button></p> */}
                                        <p>ชื่อสินค้า : {booking.product[0].nameProduct}</p>
                                        <p>ราคา :{booking.product[0].priceProduct}</p>
                                        <p>วันที่จอง :{formattedDateTime}</p>
                                        <p>เวลาที่เหลือ: {remainingTimeForProduct}</p>

                                        <button type='button' onClick={() => clicktobooking(IDbooking, IDproductregiscon, IDusercon, storeregiscon, timebookingcon, startbookingtime, bookingtimecon, amount, price)}>จ่ายเงิน</button>
                                        <button type='button' onClick={() => canclebooking(IDbooking, IDproductregiscon)}>cancle</button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className={`popupQR ${popupQR ? 'visible' : ''}`}>
                    <div className='item-QR'>
                        {imagepayment.map((QRs, index) => {
                            const imageQR = QRs.imageQR
                            return (
                                <div className='QR-content' key={index}>
                                    <div>
                                        <p>ชำระเงิน</p>
                                    </div>
                                    <img src={`http://localhost:4001/images/${imageQR}`} alt="QR Code"></img>
                                    <ul>ราคา : {QRs.amount}</ul>
                                    <div className=''>
                                        <button onClick={reload}>เสร็จสิน</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <Payment IDuser={{ IDuser }} />
                <div className="btnshowregis">
                    <button className='open-register' onClick={showhistory} >การจอง</button>
                </div>
            </div>

        </div>
    )
}

export default Booking_History