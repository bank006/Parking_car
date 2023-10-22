import React ,{useEffect , useState} from 'react'
import { useParams ,Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Booking_confirm from './Booking_confirm';
import '../css/bookinghis.css'

import Payment from './Payment';

function Booking_History(props) {
    // หน้าสินค้าก่อนกดยืนยันหลังจากนั้นส่งไปที่ booking_confirm

    // state show popup
    const [showpopup , set_showpopup] = useState(false)
    const [popupQR , set_popupQR] = useState(false)

    const [booking ,  set_booking] = useState([]);

    const { IDuser } = props.totalID;

    const [times , set_time] = useState([]);
    const [res , set_res] = useState([]);
    const [bookingid , set_bookingid] = useState([]);
    const navigate = useNavigate();

    // popup show hinstory
    const showhistory = ()=>{
        set_showpopup(true);
    }
    const close = ()=>[
        set_showpopup(false)
    ]

    useEffect(()=>{
        axios.get(`http://localhost:4001/booking/getbooking_product/${IDuser}`)
        .then((res)=>{
            set_booking(res.data)
        }).catch((err)=>{
            console.log( err );
        })
    },[]);

    useEffect(()=>{
        axios.get(`http://localhost:4001/booking/getdate/${IDuser}`)
        .then((time)=>{
            set_time(time.data)
        }).catch((err)=>{
            console.log(err)
        })
    },[])

    useEffect(()=>{
        const datatime = times.map((datatimes)=> datatimes.bookingtime)
        set_res(datatime)
    },[times])
    // console.log(res)

        // // ระบบการจอง เเละยกเลิกอัติโนมัติ
    const HALF_HOUR_MS = 1 * 60 * 1000;
    const [remainingTime, setRemainingTime ] = useState({});

    useEffect(()=>{
        const intervalIds = times.map((doctime)=>{
            const {IDproductregis , bookingtime ,_id } = doctime
            return setInterval(()=>{
                const currentTime = new Date();
                const bookingTime = new Date(bookingtime);
         
                if(!isNaN(bookingTime)){
                    const result = currentTime - bookingTime;

                    if (result < HALF_HOUR_MS) {
                        const timeLeft = HALF_HOUR_MS - result;
                        const hours = Math.floor(timeLeft / (60 * 60 * 1000));
                        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
                        const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);

                        const formattedTime = `${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`;

                         // อัปเดตเวลาคงเหลือสำหรับ ID นี้
                        setRemainingTime((prevState) => ({
                            ...prevState,
                            [_id]: formattedTime,
                            
                        }));
                        set_bookingid(doctime._id)
                        // console.log(`${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`);
                        // setRemainingTime(`${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`);
                        

                    }else if (result >= HALF_HOUR_MS){
                        clearInterval(intervalIds[times.indexOf(doctime)]);
            
                        // อัปเดตเวลาคงเหลือสำหรับ ID นี้
                        setRemainingTime((prevState) => ({
                        ...prevState,
                        [_id]: "หมดเวลาแล้ว!",
                        }));
                        
                        putdatatohistorys(doctime._id);
                        updatestock(IDproductregis);

                    }
                }else {
                    console.log("not data")
                }
            },1000)
        })
        return () => {
            // ทำความสะอาด interval ทุกครั้งเมื่อคอมโพเนนต์ถูกถอด
            intervalIds.forEach((intervalId) => clearInterval(intervalId));
        };
    },[times])

    // ลบข้อมูลการจองที่ยังไม่ได้ยืนยันการจองเเล้วหมดเวลาบบกดมือ
    const putdatatohistorys = (_id) => {
        axios.delete(`http://localhost:4001/booking/deletebooking/${_id}`)
            .then((resdelete) => {
                console.log("ลบเอกสารนี้แล้ว", resdelete.data);
                // set_showpopup(true)
                window.location.reload();
                
            })
            .catch((err) => {
                console.log(err);
            });   
    }
    // ลบข้อมูลการจองที่ยังไม่ได้ยืนยันการจองเเล้วหมดเวลาอัติโนมัติ
    const putdatatohistory = (_id) => {
        axios.delete(`http://localhost:4001/booking/deletebooking/${_id}`)
            .then((resdelete) => {
                console.log("ลบเอกสารนี้แล้ว", resdelete.data);
                // set_showpopup(true)
                // window.location.reload();
                
            })
            .catch((err) => {
                console.log(err);
            });   
    }

    useEffect(()=>{
        updatedata();
    },[booking])

    const [notibtn , set_notibtn] = useState(null)
    const updatedata=()=>{
        // let lgbtn 
        if(booking.length === 0){
            set_showpopup(false)
        }else{
            set_showpopup(true)
            set_notibtn("มีสินค้าท่ียังไม่ได้รับการยืนยัน")
        }
    }

    // เพิ่ม stock เข้าไปเมื่อไม่ได้ทำการยืนยัน
    const updatestock = (IDproductregis)=>{
        axios.put(`http://localhost:4001/product/updatestock/${IDproductregis}`)
        .then((restock) => {
            console.log("เพิ่ม stock เเล้ว" , restock)
        }).catch((err)=>{
            console.log(err)
        })
    }

    // ลบข้อมูลด้วยปุ่ม
    const canclebooking = (IDbooking ,IDproductregiscon)=>{
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

        axios.put(`http://localhost:4001/product/updatestock/${IDproductregis}`)
        .then((restock) => {
            console.log("เพิ่ม stock เเล้ว" , restock)
            window.location.reload();
        }).catch((err)=>{
            console.log(err)
        })
    }

    // การเพิ่มข้อมูลการยืนยันเมื่อทำการจอง
    const clicktobooking=(IDbooking, IDproductregiscon ,IDusercon , storeregiscon ,timebookingcon ,startbookingtime, bookingtimecon ,amount )=>{
        const statuspayment = false
        axios.post('http://localhost:4001/bookingcon/postcon' , { IDbooking, IDproductregiscon ,IDusercon , storeregiscon ,timebookingcon ,startbookingtime, bookingtimecon , statuspayment })
        .then((bookingcon)=>{
            console.log(bookingcon.data)
            putdatatohistory(bookingid)
        }).catch((err)=>{
            console.log(err)
        })
        // confirm booking and save to schema bookinhis name

        const IDbookinghis = IDbooking;
        const IDproductregishis = IDproductregiscon;
        const IDuserhis = IDusercon ;
        const storeregishis = storeregiscon;
        const timebookinghis = timebookingcon;
        const bookingtimehis = bookingtimecon;

        axios.post('http://localhost:4001/bookinghis/posthistory', { IDbookinghis,IDproductregishis,IDuserhis,storeregishis,timebookinghis,bookingtimehis ,statuspayment}).
        then((resconf)=>{
            if(!resconf){
                console.log('somthing error')
            }else{
                console.log(resconf.data)
            }
        }).catch((err)=>{
            console.log(err)
        })

         //จ่ายเงินด้วย qr
        const id = IDbooking
        axios.post('http://localhost:4001/payment/generateQR' ,{amount , id})
        .then((resqr) => {
            console.log("เพิ่ม qr เเล้ว" , resqr.data)
            getimagepayment(id)
            set_popupQR(true)
        }).catch((err)=>{
            console.log(err)
        })
    }

    // เอารูป qr การจ่ายเงินมาเเสดง
    const [imagepayment , set_imagepayment] = useState([])
    const getimagepayment =(id)=>{
        axios.get(`http://localhost:4001/payment/getpayment/${id}`)
        .then((itempayment)=>{
            set_imagepayment(itempayment.data)
        }).catch((err)=>{
            console.log(err)
        })
    }

    const reload =()=>{
        window.location.reload();
    }

  return (
    <div className='container'>
        <div className='button-click'>
            <div className={`popup ${showpopup ? 'visible' : ''}`}>
                <div className='booking'>
                    <p>booking</p>
                    <Booking_confirm IDuser={{IDuser : IDuser}}/>
                    <button onClick={close} >close</button>
                    <div className='item'>
                        <p>
                        {notibtn}
                        </p>
                        {booking.map((booking , index)=>{ 
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
                                const remainingTimeForProduct = remainingTime ? remainingTime[IDbooking] || "เวลาหมด" : "เวลาหมด";
                            return(
                                <div className='itemname' key={index}>
                                    <p>{booking.product[0]._id}</p>
                                    {/* <p>ชื่อร้าน : {booking.store[0].nameStore}<button onClick={()=> navigate(`/Detail_store/${booking.store[0]._id}/${IDuser}`)}>go store</button></p> */}
                                    <p>ชื่อสินค้า : {booking.product[0].nameProduct}</p>
                                    <p>ราคา :{booking.product[0].priceProduct}</p>
                                    <p>วันที่จอง :{formattedDateTime}</p>
                                    <p>เวลาที่เหลือ: {remainingTimeForProduct}</p>
                                    <button type='button' onClick={()=> clicktobooking(IDbooking, IDproductregiscon ,IDusercon , storeregiscon ,timebookingcon,startbookingtime , bookingtimecon ,amount)}>จ่ายเงิน</button>
                                    <button type='button' onClick={()=>canclebooking(IDbooking ,IDproductregiscon )}>cancle</button>
                                </div>   
                            )
                        })}
                    </div>     
                </div>    
            </div>

            <div className={`popupQR ${popupQR ? 'visible' : ''}`}>
                    <div className='item-QR'>
                    {imagepayment.map((QRs , index)=>{
                        const imageQR = QRs.imageQR
                        return(
                            <div className='QR-content' key={index}>
                                <div>
                                    <p>ชำระเงิน</p>
                                </div>
                                <img src={`http://localhost:4001/images/${imageQR}`} alt="QR Code"></img>
                                <ul>ราคา : {QRs.amount}</ul>
                                <div className=''>
                                    <button  onClick={reload}>เสร็จสิน</button>
                                </div>
                            </div>
                        )
                    })}
                    </div>
                </div>
            <Payment IDuser={{IDuser}}/>
            <button onClick={showhistory} >การจอง</button>
        </div>
    </div>
  )
}

export default Booking_History