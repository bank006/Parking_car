import React, { useEffect, useState , useRef} from 'react'
import { useParams, Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../css/bookinghis.css'


function Booking_confirm(props) {

    const storeListRef = useRef(null);

    // หน้าสินค้าที่ได้ทำการยืนยันการจอง
    const { IDuser } = props.IDuser
    const [showconfirme, set_showconfirme] = useState(false)

    const navigate = useNavigate();
    const location = useLocation();
    // const { IDuser } = location.state
    const [bookingcon, set_bookingcon] = useState([]);
    const [times, set_times] = useState([])




    const showcon = () => {
        set_showconfirme(!showconfirme)
    }
    const closecon = () => {
        set_showconfirme(!showconfirme)
    }

    useEffect(() => {
        axios.get(`http://localhost:4001/bookingcon/getcon/${IDuser}`)
            .then((res) => {
                set_bookingcon(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }, [])


    useEffect(() => {
        axios.get(`http://localhost:4001/bookingcon/getdate/${IDuser}`)
            .then((restime) => {
                set_times(restime.data)
            }).catch((err) => {
                console.log(err)
            })
    }, [])

    // จับเวลาการเข้าใช้งาน

    const [timebookings, set_timebookings] = useState({})
    const [IDproducts, set_IDproducts] = useState([]);
    const [showcancel, setshowcancel] = useState(false)

    useEffect(() => {
        const databookin = times.map((items) => {
            const { IDbooking, _id, timebookingcon, startbookingtime, IDproductregiscon, statuspayment } = items
            const dateObject = new Date(timebookingcon); // เวลาปัจจุบัน
            const startbooking = new Date(startbookingtime);// เวลาที่เริ่มการจอง
            const currentTime = new Date();   // เวลาปัจจุบัน
            set_IDproducts(IDproductregiscon) // รับค่า ID ของสินค้าเพื่อใช้เพื่อเทียบ Iในการใช้งาน
            if (currentTime <= startbooking) {
                setshowcancel((prevStates) => ({
                    ...prevStates,
                    [_id]: true
                }));
                set_timebookings((prevStates) => ({
                    ...prevStates,
                    [_id]: "ยังไม่ถึงเวลาที่กำหนด"
                }));
                return null
            } else {
                return setInterval(() => {
                    const dateObject = new Date(timebookingcon); // เวลาปัจจุบัน
                    // เวลาปัจจุบัน
                    const objecttime = new Date();
                    const totalMinutes = dateObject.getHours() * 60 + dateObject.getMinutes();

                    const result = objecttime - dateObject

                    if (!isNaN(dateObject)) {
                        if (result < totalMinutes) {

                            const timeLeft = totalMinutes - result
                            const hours = Math.floor(timeLeft / (60 * 60 * 1000));
                            const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
                            const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);


                            const formattedTimes = `${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`;

                            // console.log(statuspayment)

                            set_timebookings((prevStates) => ({
                                ...prevStates,
                                [_id]: formattedTimes,
                            }));

                            // console.log(newDate)

                        }
                        else if (result >= totalMinutes) {

                            const additionalTime = 10 * 60 * 1000;
                            const timeLefts = new Date(timebookingcon).getTime() + additionalTime;
                            const nowtiming = new Date().getTime();
                            const back = timeLefts - nowtiming
                            const minutess = Math.floor((back % (60 * 60 * 1000)) / (60 * 1000));
                            const secondss = Math.floor((back % (60 * 1000)) / 1000);


                            const newDate = new Date(dateObject.getTime() + 10 * 60000);
                            clearInterval(databookin[bookingcon.indexOf(items)])
                            set_timebookings((prevStates) => ({
                                ...prevStates,
                                [_id]: `หมดเวลาเเล้วเเละคุณยังเวลาอีก ${minutess}:${secondss} นาทีเพื่อกดออก `
                            }));

                            // deletebookingcon(_id, IDproductregiscon);
                            updatelatetime(_id, newDate)
                        }

                    } else {
                        console.log(data)
                    }

                }, 1000)

            }
        })
        return () => {
            databookin.forEach((databookin) => clearInterval(databookin))
        }
    }, [times]);

    // ลบข้อมูลที่กำลังใช้งานอยู่เมื่อหมดเวลาหรือกด check out
    const deletebookingcon = (id, IDproducregiscon) => {
        // ลบข้อมูลจากการจับเวลา
        axios.delete(`http://localhost:4001/bookingcon/delete/${id}`)
            .then((deletebookings) => {
                console.log(deletebookings.data)
                window.location.reload();
            }).catch((err) => {
                console.log(err)
            })


        // axios.put(`http://localhost:4001/product/updatestock/${IDproducregiscon}`)
        //     .then((restock) => {
        //         console.log("เพิ่ม stock เเล้ว", restock)
        //     }).catch((err) => {
        //         console.log(err)
        //     })
    }

    // การรับค่าเกินเวลามาใช้ในการอัพเดตราคา
    const [testtiming, set_testtiming] = useState([])


    const updatelatetime = (id, newdate) => {
        const intervalId = setInterval(() => {
            const nowdate = new Date();
            if (nowdate >= newdate) {

                // console.log({newdate ,  nowdate})
                const timeLeft = nowdate.getTime() - newdate.getTime()
                const hours = Math.floor(timeLeft / (60 * 60 * 1000));
                const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
                const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);


                const formattedTimes = `${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`;
                set_testtiming((prevStates) => ({
                    ...prevStates,
                    [id]: formattedTimes
                }));

            }
        }, 1000);

    }
    // console.log(testtiming)


    //ลบข้อมูลออกจากการจองที่ยังไม่ได้นับเวลา
    const deletetimebooking = (id, idbooking, IDproducregiscon) => {
        axios.delete(`http://localhost:4001/bookingcon/cancelbookingcon/${id}`)
            .then((res) => {
                console.log(res.data)
            }).catch((err) => {
                console.log(err)
            })

        axios.put(`http://localhost:4001/bookinghis/updatestatus/${idbooking}`)
            .then((resupdatestatus) => {
                console.log(resupdatestatus)
            }).catch((err) => {
                console.log(err)
            })

        // axios.put(`http://localhost:4001/product/updatestock/${IDproducregiscon}`)
        //     .then((restock) => {
        //         console.log("เพิ่ม stock เเล้ว", restock)
        //     }).catch((err) => {
        //         console.log(err)
        //     })
    }

    //คิดเงินเมื่อใช้งานเกินเวลา
    const checkRatetime = (id, starttimebboking, endtimebooking, amout, IDproducregiscon, ids) => {
        console.log(starttimebboking, endtimebooking, amout)

        const timeRateString = new Date();
        // const timeendStrings = new Date(endtimebooking);
        // const timeendString = new Date(timeendStrings.getTime() - 10 * 60 * 1000)

        const timeendStrings = new Date(endtimebooking); // เวลาที่ต้องการลบ 10 นาที
        const timeendString = new Date(timeendStrings.getTime() + 10 * 60 * 1000); // ลดเวลา 10 นาที

        const deftime = timeRateString - timeendString
        // const deftimeplus = deftime + additionalTime 
        const pricesell = amout / 60
        const minutetime = deftime / (1000 * 60)
        const amoutperminute = pricesell * minutetime
        const integerMinutes = Math.round(amoutperminute)

        console.log(amoutperminute)

        axios.post('http://localhost:4001/payment/generateQRRatetime', { integerMinutes, id })
            .then((resqr) => {
                console.log("เพิ่ม qr เเล้ว", resqr.data)
                getimagepayment(id)
                set_popupQR(true)
            }).catch((err) => {
                console.log(err)
            })

        axios.delete(`http://localhost:4001/bookingcon/cancelbookingcon/${ids}`)
            .then((res) => {
                console.log(res.data)
            }).catch((err) => {
                console.log(err)
            })

        // axios.put(`http://localhost:4001/product/updatestock/${IDproducregiscon}`)
        //     .then((restock) => {
        //         console.log("เพิ่ม stock เเล้ว", restock)
        //     }).catch((err) => {
        //         console.log(err)
        //     })
        // console.log(deftime)
    }

    // เอารูป qr การจ่ายเงินมาเเสดง
    const [popupQR, set_popupQR] = useState(false)
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

    useEffect(() => {
        scrollToBottom();
    }, [bookingcon]);

    const scrollToBottom = () => {
        storeListRef.current.scrollIntoView({ behavior: 'smooth' });
    };


    return (
        <div style={{ backgroundColor: 'blue' }}>
            {/* <div style={{ marginTop: '50px' }} className={`popupconfirme ${showconfirme ? 'visible' : ''}`}> */}
            <div style={{ marginTop: '148px' }} className='popupconfirme'>
                <div className='item-confirme'>
                    {/* <Navbarbooking IDuser={{IDuser:IDuser}}/> */}
                    {/* <p>รายการยืนยันการจองss</p> */}
                    {/* <button onClick={closecon}>close</button> */}
                    <div className='container-item'>
                        <div className="box-all-itemcon">
                            {bookingcon.map((bookingcon, index) => {
                                // เวลาที่เหลือ
                                const DateString = bookingcon.timebookingcon
                                const dateObject = new Date(DateString)
                                const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
                                const formattedDateTime = dateObject.toLocaleDateString('en-US', options);

                                // เวลาที่เริ่มต้นการจอง
                                const startbookingcon = bookingcon.startbookingtime
                                const startdateObject = new Date(startbookingcon)
                                const startoptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
                                const startformattedDateTime = startdateObject.toLocaleDateString('en-US', startoptions);

                                const id = bookingcon._id
                                const idbooking = bookingcon.IDbooking
                                const IDproducregiscon = bookingcon.IDproductregiscon
                                const remain = timebookings ? timebookings[id] || "ยังไม่ถึงเวลาที่กำหนด" : "หมดเวลาเเล้ว";
                                const Ratetime = testtiming ? testtiming[id] || "ยังไม่หมด" : '';
                                const canclebutton = showcancel ? showcancel[id] : false;

                                const startbookingtime = bookingcon.startbookingtime
                                const endtimebooking = bookingcon.timebookingcon
                                const amounts = bookingcon.product[0].priceProduct

                                const timestartString = new Date(startbookingtime)
                                const timeendString = new Date(endtimebooking)

                                const deferrenttime = timeendString - timestartString
                                const pricesell = amounts / 60
                                const minuttime = deferrenttime / (1000 * 60)
                                const hours = Math.floor(minuttime / 60);
                                const totalPrice = pricesell * minuttime;
                                const amoutperminute = Math.round(totalPrice)

                                return (
                                    <div className='itemcon' key={index}>
                                        <div className="content-itemcon">
                                            <div className="title-bookingcon">
                                                <p>{bookingcon.store[0].nameStore}</p>
                                                <div className="time-titlebookingcon">
                                                    {Ratetime !== "ยังไม่หมด" ? (
                                                        <div className=''>
                                                            <ul>เกินเวลาที่มาเเล้ว : {Ratetime}</ul>
                                                        </div>
                                                    ) : (
                                                        <div className=''>
                                                            <ul>เหลือเวลาใช้งาน : {remain}</ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="item-booking">
                                                <div className="booking-img">
                                                    <img src={`../imageproduct/${bookingcon.product[0].imageProduct}`} alt="" />
                                                </div>
                                                <div className="content-aboutebooking">
                                                    <table className='table-bookingcon'>
                                                        <tr>
                                                            <th>รายละเอียดสินค้า :</th>
                                                            <td>{bookingcon.store[0].description}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>ชื่อสินค้า : </th>
                                                            <td>{bookingcon.product[0].nameProduct}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>ราคาสินค้า : </th>
                                                            <td>{amoutperminute} บาท</td>
                                                        </tr>
                                                        <tr>
                                                            <th>วันที่เวลาที่เริ่มต้นใช้งาน : </th>
                                                            <td>{formattedDateTime}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>วันที่เวลาที่จอง :</th>
                                                            <td>{startformattedDateTime} </td>
                                                        </tr>
                                                    </table>

                                                </div>
                                            </div>
                                            <div className="btn-booking">
                                                {Ratetime !== "ยังไม่หมด" ? (
                                                    <div className='btn-ratetime'>
                                                        <button type='submit' onClick={() => checkRatetime(idbooking, bookingcon.startbookingtime, bookingcon.timebookingcon, bookingcon.product[0].priceProduct, IDproducregiscon, id)}>เกินเวลา</button>
                                                    </div>
                                                ) : (
                                                    <div className='btn-checktime'>
                                                        <button type='submit' onClick={() => deletebookingcon(id, IDproducregiscon)}>check out</button>
                                                    </div>

                                                )}
                                                {canclebutton === true ? (
                                                    <div className=''>
                                                        <button onClick={() => deletetimebooking(id, idbooking, IDproducregiscon)}>ยกเลิกการจอง</button>
                                                    </div>
                                                ) : (
                                                    null
                                                )}
                                                {/* <div className="btn-checkin">
                                                    <button>check in</button>
                                                    
                                                </div> */}

                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={storeListRef}></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`popupQR ${popupQR ? 'visible' : ''}`}>
                <div className='item-QR'>
                    {imagepayment.map((QRs, index) => {
                        const imageQR = QRs.imageQRratetime
                        return (
                            <div className='QR-content' key={index}>
                                <div>
                                    <p>ชำระเงิน</p>
                                </div>
                                <img src={`http://localhost:4001/images/${imageQR}`} alt="QR Code"></img>
                                <ul>ราคา : {QRs.amountratetime}</ul>
                                <div className=''>
                                    <button onClick={reload}>เสร็จสิน</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            {/* <button onClick={showcon}>confirmbooking</button> */}
        </div>
    )
}

export default Booking_confirm