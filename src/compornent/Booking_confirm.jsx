import React ,{useEffect , useState} from 'react'
import { useParams ,Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/bookinghis.css'

function Booking_confirm(props) {

    // หน้าสินค้าที่ได้ทำการยืนยันการจอง
    const {IDuser} = props.IDuser
    const [showconfirme , set_showconfirme] = useState(false)
    const navigate=useNavigate();
    const [bookingcon , set_bookingcon] = useState([]);
    const [times , set_times] = useState([])

    const showcon =()=>{
        set_showconfirme(!showconfirme)
    }
    const closecon =()=>{
        set_showconfirme(!showconfirme)
    }

    useEffect(()=>{
        axios.get(`http://localhost:4001/bookingcon/getcon/${IDuser}`)
        .then((res)=>{
            set_bookingcon(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    },[])


    useEffect(()=>{
        axios.get(`http://localhost:4001/bookingcon/getdate/${IDuser}`)
        .then((restime)=>{
            set_times(restime.data)
        }).catch((err)=>{
            console.log(err)
        })
    },[])

    // จับเวลาการเข้าใช้งาน

    const [timebookings , set_timebookings] = useState({})
    const [IDproducts , set_IDproducts] = useState([]);

    useEffect(()=>{
        const databookin = times.map((items)=>{
            const {IDbooking ,_id , timebookingcon, startbookingtime ,IDproductregiscon  } = items   
            const dateObject= new Date(timebookingcon); // เวลาปัจจุบัน
            const startbooking = new Date(startbookingtime);// เวลาที่เริ่มการจอง
            const currentTime= new Date();   // เวลาปัจจุบัน
            set_IDproducts(IDproductregiscon) // รับค่า ID ของสินค้าเพื่อใช้เพื่อเทียบ Iในการใช้งาน
            if(currentTime <= startbooking){
                set_timebookings((prevStates)=>({
                    ...prevStates,
                    [_id] : "ยังไม่ถึงเวลาที่กำหนด"
                }));
                return null
            }else{
                return setInterval(()=>{
                    const dateObject= new Date(timebookingcon); // เวลาปัจจุบัน
                    // เวลาปัจจุบัน
                    const objecttime = new Date();
                    const totalMinutes = dateObject.getHours() * 60 + dateObject.getMinutes();
                    
                    const result = objecttime - dateObject
                    
                    if(!isNaN(dateObject)){
                        if(result < totalMinutes ){
    
                            const timeLeft = totalMinutes - result
                            const hours = Math.floor(timeLeft / (60 * 60 * 1000));
                            const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
                            const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
    
                            const formattedTimes = `${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`;
    
                            set_timebookings((prevStates)=>({
                                ...prevStates,
                                [_id] : formattedTimes,
                            }));
                        }
                        else if(result >= totalMinutes){
                            clearInterval(databookin[bookingcon.indexOf(items)])
                            set_timebookings((prevStates)=>({
                                ...prevStates,
                                [_id] : "หมดเวลาเเล้ว"
                            }));

                            deletebookingcon(_id ,IDproductregiscon);
                        }
    
                    }else{
                        console.log(data)
                    }
    
                },1000)

            }
        })
        return()=>{
            databookin.forEach((databookin)=>clearInterval(databookin))
        }
    },[times]);


    // ลบข้อมูลที่กำลังใช้งานอยู่เมื่อหมดเวลาหรือกด check out
    const deletebookingcon =(id , IDproducregiscon)=>{
        axios.delete(`http://localhost:4001/bookingcon/delete/${id}`)
        .then((deletebookings)=>{
            console.log(deletebookings.data)
            window.location.reload();
        }).catch((err)=>{
            console.log(err)
        })


        axios.put(`http://localhost:4001/product/updatestock/${IDproducregiscon}`)
        .then((restock) => {
            console.log("เพิ่ม stock เเล้ว" , restock)
        }).catch((err)=>{
            console.log(err)
        })
    }


    //จ่ายเงินด้วย qr
    const [amount , set_price] = useState([])
    const getqr =(idbooking)=>{
        const id = idbooking
        axios.post('http://localhost:4001/payment/generateQR' ,{amount , id})
        .then((resqr) => {
            console.log("เพิ่ม qr เเล้ว" , resqr.data)
        }).catch((err)=>{
            console.log(err)
        })
    }

    // console.log(bookingcon)

  return (
    <div>
          <div className={`popupconfirme ${showconfirme ? 'visible' : ''}`}>
                <div className='item-confirme'>
                    <p>รายการยืนยันการจองss</p>
                    <button onClick={closecon}>close</button>
                    <div className='item-contents'>
                        {bookingcon.map((bookingcon , index)=>{
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
                            return (
                                <div className='itemcon' key={index}>
                                    <ul>ชื่อร้าน : {bookingcon.store[0].nameStore}</ul>
                                    <ul>รายละเอียดสินค้า : {bookingcon.store[0].description}</ul>
                                    <ul>ชื่อสินค้า : {bookingcon.product[0].nameProduct}</ul>
                                    <ul>ราคาสินค้า : {bookingcon.product[0].priceProduct}</ul>
                                    <p>วันที่เวลาที่เริ่มต้นช้งาน : {startformattedDateTime}</p>
                                    <p>วันที่เวลาที่จอง : {formattedDateTime}</p>
                                    <p>เหลือเวลาใช้งาน : {remain}</p>
                                    
                                    <input type="number" onChange={(e)=>set_price(e.target.value)  } />
                                    <button onClick={()=>getqr(idbooking)}>addprice</button>
                                    <button type='submit' onClick={()=>deletebookingcon(id , IDproducregiscon)}>check out</button>
                                    <button>check in</button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <button type='buttin' onClick={showcon}>confrimebooking</button>
    </div>
  )
}

export default Booking_confirm