import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './payment.css'


function Payment(props) {

    const { IDuser } = props.IDuser
    const navigate = useNavigate();


    const [popuppayment, set_popuppayment] = useState([])
    const [popupQR, set_popupQR] = useState(false)


    const [booking, set_booking] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:4001/booking/getbooking_product/${IDuser}`)
            .then((res) => {
                set_booking(res.data)
            }).catch((err) => {
                console.log(err);
            })
    }, []);


    useEffect(() => {
        set_showpopup();
    }, [booking])

    const closepayment = () => {
        set_popuppayment(false);
    }


    const set_showpopup = () => {
        if (booking.length === 0) {
            set_popuppayment(false)
        } else {
            set_popuppayment(true)
        }
    }



    

    const getQR = (IDbooking, IDproductregiscon, IDusercon, storeregiscon, timebookingcon, startbookingtime, bookingtimecon, amount, price , parkingbox) => {
        const timestartString = new Date(startbookingtime)
        const timeendString = new Date(timebookingcon)
        const deferrenttime  =  timeendString - timestartString 
        const pricesell = amount / 60
        const minuttime =  deferrenttime / (1000 * 60) 
        const amoutperminute = pricesell * minuttime
        const integerMinutes = Math.round(amoutperminute)

        // เพิ่มข้อมูลการจองเข้าไปในประวัติทั้งหมด
        const statuspayment = true
        axios.post('http://localhost:4001/bookingcon/postcon', { IDbooking, IDproductregiscon, IDusercon, storeregiscon, timebookingcon, startbookingtime, bookingtimecon, statuspayment,parkingbox })
            .then((bookingcon) => {
                console.log(bookingcon.data)
                putdatatohistory(IDbooking)
                set_popupQR(true)
                set_popuppayment(false)
            }).catch((err) => {
                console.log(err)
            })


        // เพิ่ม qr code
        const id = IDbooking
        axios.post('http://localhost:4001/payment/generateQR', { integerMinutes, id })
            .then((resqr) => {
                console.log("เพิ่ม qr เเล้ว", resqr.data)
                getimagepayment(id)
            }).catch((err) => {
                console.log(err)
            })


        const IDbookinghis = IDbooking;
        const IDproductregishis = IDproductregiscon;
        const IDuserhis = IDusercon;
        const storeregishis = storeregiscon;
        const timebookinghis = timebookingcon;
        const bookingtimehis = bookingtimecon;

        //บันทึกลงประวัติการจอง
        axios.post('http://localhost:4001/bookinghis/posthistory', { IDbookinghis, IDproductregishis, IDuserhis, storeregishis, timebookinghis, bookingtimehis, statuspayment ,parkingbox }).
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
        // axios.put(`http://localhost:4001/product/updatepostbooking/${IDproductregiscon}`)
        //     .then((update) => {
        //         console.log(update)
        //     }).catch((err) => {
        //         console.log(err)
        //     })

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
        axios.put(`http://localhost:4001/product/putview/${IDproductregishis}`).then((view) => {
            console.log(view)
        }).catch((err) => {
            console.log(err)
        })
    }


    const [imagepayment, set_imagepayment] = useState([])
    const getimagepayment = (id) => {
        axios.get(`http://localhost:4001/payment/getpayment/${id}`)
            .then((itempayment) => {
                set_imagepayment(itempayment.data)
            }).catch((err) => {
                console.log(err)
            })
    }

    // เพิ่ม stock เข้าไปเมื่อไม่ได้ทำการยืนยัน
    const updatestocks = (IDbooking, IDproductregiscon) => {
        axios.put(`http://localhost:4001/product/updatestock/${IDproductregiscon}`)
            .then((restock) => {
                console.log("เพิ่ม stock เเล้ว", restock)
            }).catch((err) => {
                console.log(err)
            });


        axios.delete(`http://localhost:4001/booking/deletebooking/${IDbooking}`)
            .then((resdelete) => {
                console.log("ลบเอกสารนี้แล้ว", resdelete.data);
                window.location.reload();

            })
            .catch((err) => {
                console.log(err);
            });
    }

    // ลบข้อมูลการจองที่ยังไม่ได้ยืนยันการจองเเล้วหมดเวลา
    const putdatatohistory = (_id) => {
        axios.delete(`http://localhost:4001/booking/deletebooking/${_id}`)
            .then((resdelete) => {
                console.log("ลบเอกสารนี้แล้ว", resdelete.data);
                // window.location.reload();

            })
            .catch((err) => {
                console.log(err);
            });
    }

    const reload = () => {
        window.location.reload();
    }

    return (
        <div>
            {/* // ส่วน popup การจ่ายเงิน */}
            <div className={`popuppayment ${popuppayment ? 'visible' : ''}`}>
                {/* <p>payment{IDuser}</p> */}
                <div className='item-payment'>
                    <button onClick={closepayment}>close</button>

                    {booking.map((item, index) => {
                        const IDbooking = item._id
                        const IDproductregiscon = item.IDproductregis
                        const IDusercon = item.IDuser
                        const storeregiscon = item.storeregis
                        const timebookingcon = item.timeregis
                        const startbookingtime = item.startbookingregis
                        const bookingtimecon = item.bookingtime
                        const parkingbox = item.parkingbox
                        const amount = item.product[0].priceProduct
                        const price = item.product[0].priceProduct
                        return (
                            <div className='' key={index}>
                                <h1>การชำระเงิน</h1>
                                <ul>รหัสการจอง : {item._id}</ul>
                                <ul>ชื่อสินค้า : {item.product[0].nameProduct}</ul>
                                <ul>ราคาสินค้า : {item.product[0].priceProduct}</ul>
                                <button type='submit' onClick={() => getQR(IDbooking, IDproductregiscon, IDusercon, storeregiscon, timebookingcon, startbookingtime, bookingtimecon, amount, price , parkingbox)} >ชำระเงิน</button>

                                <button type='submit' onClick={() => updatestocks(IDbooking, IDproductregiscon)}>cancle</button>
                            </div>
                        )
                    })}
                    <div className={`popupQR ${popupQR ? 'visible' : ''}`}>
                        <p>การชำระเงิน</p>
                        <div className='item-QR'>
                            {imagepayment.map((QRs, index) => {
                                const imageQR = QRs.imageQR
                                return (
                                    <div className='QR-content' key={index}>
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
                </div>

            </div>
        </div>
    )
}

export default Payment