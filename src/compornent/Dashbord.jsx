import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/desbord.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
// เพิ่ม import ของ mongoose
import mongoose from 'mongoose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

import Navbars from './Navbar';
import Select from './patment/Selectpayment';

function Dashbord(props) {
    const navigate = useNavigate();
    const location = useLocation();

    // รับข้อมูลที่มากจากการเช็คในหน้าล๊อคอิน
    const { user } = location.state // หรือค่าเริ่มต้นที่ถูกต้อง
    const IDuser = user

    function toObjectId(id) {
        if (id && mongoose.Types.ObjectId.isValid(id)) {
            return new mongoose.Types.ObjectId(id).toString();
        }
        return id;
    }

    if (IDuser) {
        const userID = toObjectId(IDuser);
        // setdatafromecart(IDusers, IDproduct ,IDstore ,nameStore)

    } else {
        navigate('/login')
    }


    //  เก็บข้อมูลที่รับมาจาก APIs
    const [data_user, setdata_user] = useState([])

    const [IDuser_data] = useState(IDuser)
    //  รับค่าการส่งข้อมูลรูปภาพ profile

    // ดูสินค้าที่ join กับ store ดูสินค้า
    const [productall, set_productall] = useState([]);
    const [productnear, set_productnear] = useState([]);
    // เก็บข้อมูล location
    const [pointsToCompare, set_locas] = useState([]);
    // ข้อมูลระยะทาง
    const [distances, setDistances] = useState([]);
    const [distance1, set_distance1] = useState([]);

    // check store account
    const [latitude, set_latitude] = useState(null)
    const [longitude, set_longitude] = useState(null)

    // รับค่าโชว์สินค้า
    const [showloca, set_showloca] = useState(false)
    const [showloca2, set_showloca2] = useState(true)


    // showpopup and setdata of idstore when click
    const [showpopup, set_showpopup] = useState(false)
    const [showpopupDate, set_showpopupDate] = useState(false)
    const [productrecall, set_productrecall] = useState(null)
    const [storerecall, set_storecall] = useState(null)


    //เก็บข้อมูลการจอง 
    const [timeregis, set_timeregis] = useState([])
    const [IDproductregis, set_IDproductregis] = useState([])
    const [storeregis, set_storeregis] = useState([]);
    const [startbookingregis, set_startbookingregis] = useState([])
    const [namest, setnamest] = useState('')

    const togglePopup = async (IDproduct, IDstore, namestores) => {
        set_showpopup(!showpopup)
        set_showpopupDate(!showpopupDate)
        set_IDproductregis(IDproduct)
        set_storeregis(IDstore)
        setnamest(namestores)
        handle_callAllproduct(IDproduct)
        // console.log(IDproduct)
        // console.log(IDstore)

        try {

            const resproduct = await axios.get(`http://localhost:4001/product/callproduct/${IDproduct}`)
            const resstore = await axios.get(`http://localhost:4001/store/loginstore/${IDstore}`)
            const recallproduct = resproduct.data
            const recallstore = resstore.data

            set_productrecall(recallproduct)
            set_storecall(recallstore)
            // console.log(productrecall)
            // console.log(storerecall)     

        } catch (err) {
            set_productrecall(null)
            set_storecall(null)
            console.log(err)
        }

    }

    const closepopup = () => {
        set_showpopup(!showpopup)
    }

    // ฟังก์ชันคำนวณระยะทางโดยใช้สูตร Haversine
    function haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // รัศมีของโลกในหน่วยกิโลเมตร
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // ระยะทางในหน่วยกิโลเมตร
        return distance;
    }

    // ฟังก์ชันแปลงองศาเป็นเรเดียน
    function toRadians(degrees) {
        return degrees * Math.PI / 180;
    }
    // จุดหลัก (จุดที่ต้องการหาพื้นที่ใกล้เคียง)
    const mainLat = latitude; // ละติจูดของจุดหลัก
    const mainLon = longitude; // ลองจิจูดของจุดหลัก

    // หาระยะทางจากจุดหลักไปยังจุดที่ต้องการอิงระยะทาง
    const calculateDistances = () => {

        const calculatedDistances = pointsToCompare.map(point => {
            const distance = haversineDistance(mainLat, mainLon, point[1], point[0]).toFixed(2);
            return {
                lon: point[0],
                lat: point[1],
                distance: distance
            };
        });
        setDistances(calculatedDistances);

    };

    useEffect(() => {
        calculateDistances();

    }, [latitude, longitude]);

    //สำหรับการดึงข้อมุล ละติจุด ลองจิจูด
    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                setLocationInfo("Geolocation is not supported by this browser.");
            }
        };
        const showPosition = (position) => {
            set_latitude(position.coords.latitude)
            set_longitude(position.coords.longitude)

        };

        getLocation();

        const interval = setInterval(getLocation, 1000);

        return () => {
            clearInterval(interval); // Clear interval when component is unmounted
        };
    }, []);

    // ดึงข้อมูลมาจาก apis โดยดึงจากข้อมูลที่ตรงกัน
    const fechdata = async () => {
        const ressponse = axios.get(`http://localhost:4001/users/datadetail/${IDuser}`);
        setdata_user((await ressponse).data)
    }
    useEffect(() => {
        fechdata();
    }, []);

    const hadlepopup = () => {
        console.log(data_user._id)
    }

    // ดูสินค้าที่ join กับ store
    useEffect(() => {
        axios.get('http://localhost:4001/product/joinproduct')
            .then((result) => {
                // console.log(result);
                set_productall(result.data)
            }).catch((error) => {
                console.log(error)
            })
    }, [])

    //เข้่าถึงข้อมูล location 
    useEffect(() => {
        const store_productall = productall.map((loca) => loca.location.coordinates)
        set_locas(store_productall)
    }, [productall])

    // โชส์สินค้าที่ในระยะทาง
    const setshow = () => {
        call_productnear();
        set_showloca(true)
        set_showloca2(false)
    }
    const setshow2 = () => {
        set_showloca2(true)
        set_showloca(false)
    }

    const todetail = (IDstore, IDuser) => {
        axios.put('http://localhost:4001/store/putview', { IDstore })
            .then((res) => {
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })

        navigate('/Detail_store', { state: { IDstore, IDuser } })
    }


    //เพิ่มข้อมูลการจอง
    const handle_timesregis = (e) => {
        set_timeregis(e.target.value)
    }

    //เพิ่มวันเวลาเริ่มการจอง
    const handle_startbookingregis = (e) => {
        set_startbookingregis(e.target.value)
    }

    const [checkbox, set_checkbox] = useState(getCurrentTime())

    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         setCurrentTime(getCurrentTime());
    //     }, 1000);

    //     return () => clearInterval(intervalId);
    // }, []);

    const handle_checkbbooking = (e) => {
        set_checkbox(e.target.value)
    }

    useEffect(() => {
        console.log(checkbox)
    }, [checkbox])

    const [selectpayment, setselectpayment] = useState(false)
    const [datapayment, set_datapayment] = useState([])

    const [parkingbox, set_parkingbox] = useState([])
    const [red, set_red] = useState({})
    // เซ้ตค่าส่งช่องจองรถ
    const handle_boxparking = (box) => {
        set_parkingbox(box)
        set_red((precolor) => {
            // ถ้ากล่องนี้มีสีอยู่แล้ว ก็ลบสีออก
            if (precolor[box]) {
                const { [box]: _, ...rest } = precolor;
                return rest;
            }
            // ถ้ากล่องนี้ยังไม่มีสี ก็เพิ่มสีเข้าไป (เราให้สีเป็น 'red' ในที่นี้)
            return { ...precolor, [box]: 'red' };
        });
    }



    // จองสินค้่าเเละอัพเดตจำนวนสินค้าที่เหลือ
    const regisproduct = (IDproductregis, storeregis) => {
        if (startbookingregis.length === 0) {
            alert('กรุณาเลือกเวลา')
        } else if (timeregis.length === 0) {
            alert('กรุณาเลือกเวลา')
        } else if (parkingbox.length === 0) {
            alert('กรุณาเลือกข่องที่ต้องกาาร')
        } else {
            setselectpayment(true)
            set_datapayment({ IDproductregis, IDuser, storeregis, startbookingregis, timeregis, parkingbox })
        }


    }

    // เพิ่มสินค้าลงตระกร้าสินค้า
    const [iconColors, setIconColors] = useState({});

    const addshoppingcard = (IDproductregis, storeregis) => {
        console.log(IDproductregis, IDuser, storeregis)
        axios.post('http://localhost:4001/shoppingcart/postshoppingcard', { IDproductregis, IDuser, storeregis })
            .then((card) => {
                console.log(card.data)
                // window.location.reload();
            }).catch((err) => {
                console.log(err)
            })

        const updatedColors = { ...iconColors };
        updatedColors[IDproductregis] = 'red';
        setIconColors(updatedColors);
    }


    //ลบออกจากรายที่ชอบ
    const [iconwhite, seticonwhite] = useState({})
    const deletefromcard = (IDproductregis) => {
        console.log(IDproductregis, IDuser)
        axios.delete(`http://localhost:4001/shoppingcart/deletecard/${IDproductregis}/${IDuser}`)
            .then((delcard) => {
                console.log(delcard)
            }).catch((err) => {
                console.log(err)
            })

        const updateiconwhite = { ...iconwhite };
        updateiconwhite[IDproductregis] = 'white';
        seticonwhite(updateiconwhite)
    }


    // ดูเเมพ
    const seemap = (lat, lon) => {
        navigate('/Maps', { state: { lat, lon } })
    }

    // เรียกถสถานที่ใกล้เคียง
    const call_productnear = () => {
        axios.get('http://localhost:4001/product/nearlocation', {
            params: {
                latitude: latitude,
                longitude: longitude
            }
        })
            .then((response) => {
                // console.log(response.data);
                set_productnear(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.nav-des');
        if (window.scrollY > 1000) { // 100 คือค่าที่กำหนดว่าเมื่อเลื่อนไปล่างไปไหนจะให้ Navbar หาย  
            navbar.classList.remove('active');
        } else {
            navbar.classList.add('active');
        }
    });


    // call product in card
    const [favoriteitem, set_favorite] = useState([])
    useEffect(() => {
        axios.get(`http://localhost:4001/shoppingcart/getcard/${IDuser}`)
            .then((res) => {
                getfavorite(res.data);
            }).catch((err) => {
                console.log(err)
            })
    }, [])

    const getfavorite = (itemcards) => {
        const item = itemcards.map((res) => res.IDproductregis)
        set_favorite(item)
    }


    // เพิ่มจำนวนรูปรถเมื่อมีการใช้งาน
    const { quantityInStock } = productrecall || ''
    const { quantityInStockrel } = productrecall || ''
    const boxes = Array.from({ length: quantityInStockrel }, (_, index) => index + 1);
    const numberofparking = (quantityInStockrel - quantityInStock)
    // const activityparking = Array.from({ length: numberofparking }, (_, index) => index + 1)

    const [activityparking, set_activityparking] = useState([])

    // เรียกรายการที่มีการจองของสินค้าเเต่ละชิ้น
    const handle_callAllproduct = (IDproduct) => {
        axios.get(`http://localhost:4001/bookingcon/findbooking/${IDproduct}`)
            .then((res) => {
                set_activityparking(res.data)
                console.log(IDproduct)
            }).catch((err) => {
                console.log(err)
            })
    }




    const [changprice, setchangprice] = useState('80')
    const handlePriceChange = (e) => {
        setchangprice(e.target.value)
    }

    // ปิดป๊อปอัพเลือกวัน
    const closepopupDate = () => {
        set_showpopupDate(!showpopupDate)
    }

    const [booking, set_bookings] = useState([])
    useEffect(() => {
        if (IDproductregis.length > 0) {
            axios.get(`http://localhost:4001/booking/getbookingproduct/${IDproductregis}`)
                .then((res) => {
                    // set_bookings(res.data)
                    console.log(res.data)
                    getdatafrombooking(res.data)
                }).catch((err) => {
                    console.log(err);
                })
        }
    }, [IDproductregis]);

    const getdatafrombooking = (itemcards) => {
        const item = itemcards.map(({ startbookingregis, timeregis, parkingbox }) => ({ startbookingregis, timeregis, parkingbox }));

        set_bookings(item)
    }

    useEffect(() => {

        for (let i = 0; i < booking.length; i++) {
            const searchDate = new Date(startbookingregis)
            const startDate = new Date(booking[i].startbookingregis)
            const endDate = new Date(booking[i].timeregis)
            if (parkingbox === booking[i].parkingbox && searchDate >= startDate && searchDate <= endDate) {
                set_parkingbox([])
                set_red((precolor) => {
                    // ถ้ากล่องนี้มีสีอยู่แล้ว ก็ลบสีออก
                    if (precolor[parkingbox]) {
                        const { [parkingbox]: _, ...rest } = precolor;
                        return rest;
                    }
                    // ถ้ากล่องนี้ยังไม่มีสี ก็เพิ่มสีเข้าไป (เราให้สีเป็น 'red' ในที่นี้)
                    return { ...precolor, [parkingbox]: 'red' };
                });
                Swal.fire({
                    title: 'ไม่สามารถเลือกช่องนี้ได้เนื่องมีผู้ใช้งานอื่นเลือกอยู่',
                    icon: 'warning',
                    confirmButtonText: 'ยืนยัน'
                })
            }
        }

    }, [parkingbox])

    // let timer; // ตัวแปรสำหรับเก็บตัวจับเวลา

    // // กำหนดระยะเวลา session timeout (ในมิลลิวินาที)
    // const SESSION_TIMEOUT = 1 * 60 * 1000; // เวลาเป็น 30 นาที

    // // เริ่มต้นตัวจับเวลา
    // function startSessionTimer() {
    //     timer = setTimeout(logoutUser, SESSION_TIMEOUT);
    // }

    // // รีเซ็ตตัวจับเวลา
    // function resetSessionTimer() {
    //     clearTimeout(timer);
    //     startSessionTimer();
    // }

    // // ออกจากระบบ
    // function logoutUser() {
    //     // ทำการลบ token หรือข้อมูลการรับรองตัวตนที่ใช้ในการเข้าสู่ระบบออก
    //     // เรียกใช้ฟังก์ชันหรือส่ง API เพื่อลบ token หรือข้อมูลอื่นๆ
    //     console.log("User has been logged out due to inactivity.");
    //     // นำผู้ใช้ไปยังหน้าล็อกอินหรือหน้าอื่นที่ต้องการ
    // }

    // // เมื่อมีกิจกรรมจากผู้ใช้งาน เรียกใช้ฟังก์ชัน resetSessionTimer() เพื่อรีเซ็ตตัวจับเวลา
    // document.addEventListener("mousemove", resetSessionTimer);
    // document.addEventListener("mousedown", resetSessionTimer);
    // document.addEventListener("keypress", resetSessionTimer);
    // document.addEventListener("touchmove", resetSessionTimer);
    // document.addEventListener("scroll", resetSessionTimer);

    // // เริ่มต้นตัวจับเวลาเมื่อเริ่มใช้งาน
    // startSessionTimer();

    const navigateto = ()=>{
        navigate('/Chat' ,{state:{IDuser}})
    }

    return (
        <div className='container-des'>
            <div className="nav-des">
                <Navbars totalID={{ IDuser: IDuser }} />
            </div>
            {/* popup เลือกเวลาในการใช้สั่งของ */}
            <div className={`popup ${showpopup ? 'visible' : ''}`}>
                <div className='box-regis'>
                    <div className='regis'>
                        <Navbars totalID={{ IDuser: IDuser }} />
                        <p>เลือกพื้นที่การจอดรถ</p>
                        {/* <div className={`popupDate ${showpopupDate ? 'visible' : ''}`}>
                            <div className="itempopup-Date">
                                <div className="Date">
                                    <p>เลือกเวลาต้องการจอง</p>
                                    <input type="datetime-local"id="datetime" name="datetime" onChange={handle_checkbbooking} required></input>
                                    <div className="btn-Date">
                                        <button className='btn-Date-ok'>OK</button>
                                        <button className='btn-Date-close' onClick={closepopupDate}>close</button>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {productrecall && (
                            <div className='container-box'>
                                <div className="all-boxs">
                                    <div className="btn-close">
                                        <button onClick={closepopup}><img src='/public/back.png' alt="" /></button>
                                    </div>
                                    <div className="area-parking">
                                        <div className={`boxs ${boxes.length >= 5 && boxes.length <= 10 ? 'boxs-five' : '' || boxes.length >= 10 ? 'boxs-ten' : ''}`}>

                                            {boxes !== null ? (
                                                boxes.map(box => {
                                                    const setred = red[box] || ''
                                                    return (
                                                        <>
                                                            <div className={`item-boxs ${boxes.length >= 5 && boxes.length <= 10 ? 'item-boxs-five' : '' || boxes.length >= 10 ? 'item-boxs-ten' : ''}`}>

                                                                <button onClick={() => handle_boxparking(box)} className='regiscar' style={{ backgroundColor: `${setred}` }}>

                                                                    {activityparking.map((te, index) => {
                                                                        let a = ''
                                                                        let b = ''
                                                                        // && te.startbookingtime >= '2024-01-12T00:00'

                                                                        const searchDate = new Date(startbookingregis)
                                                                        const currentDate = new Date();
                                                                        const currentTimeString = currentDate.toLocaleTimeString();
                                                                        const startDate = new Date(te.startbookingtime)
                                                                        const endDate = new Date(te.timebookingcon)
                                                                        if (te.parkingbox === box && searchDate >= startDate && searchDate <= endDate) {
                                                                            a = <button className='car' >ไม่ว่าง</button>
                                                                        }

                                                                        return (
                                                                            <div className='' key={index}  >
                                                                                {a}
                                                                            </div>

                                                                        )
                                                                    })}


                                                                </button>

                                                            </div>
                                                        </>
                                                    )
                                                })


                                            ) : (
                                                null
                                            )}

                                        </div>
                                    </div>
                                    <div className="des-productrecall">
                                        <div className="box-productrecall">
                                            <div className="recallproduct-item">
                                                <p className='namest'>{namest}</p>
                                                <p>ช่องว่างที่เหลือ: {productrecall.quantityInStock} ช่อง</p>
                                            </div>
                                            <div className="input-item">
                                                <div className="start-item">
                                                    <div className="lebel-start">
                                                        <label htmlFor="datetime">เลือกวันที่และเวลาที่เริ่มจองและตรวจสอบพื้นที่:</label>

                                                    </div>
                                                    <div className="input-start">
                                                        <input type="datetime-local" id="datetime" name="datetime" onChange={handle_startbookingregis} required></input>
                                                    </div>
                                                </div>
                                                <div className="end-item">
                                                    <div className='label-endtime'>
                                                        <label htmlFor="datetime">เลือกวันที่และเวลาสิ้นสุดการจอง:</label>
                                                    </div>
                                                    <div className='input-endtime'>
                                                        <input type="datetime-local" id="datetime" name="datetime" onChange={handle_timesregis} required></input>
                                                    </div>
                                                    <div className="button-addproduct">
                                                        <button onClick={navigateto} style={{width:'50px', marginRight:'10px'}}>message</button>
                                                        <button onClick={() => regisproduct(IDproductregis, storeregis)}>addproduct</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Select item={{ selectpayment, datapayment }} />
                    </div>
                </div>
            </div>


            <div className='title'>
                {/* สำหรับการดูที่บริการที่ใกล้ที่สุด */}
                <div className='box-all'>
                    <div className="filter-price">
                        <div className='container-service'>
                            <div className="item-container-service">
                                <div className='item-service'>
                                    <button onClick={setshow}>จุดให้บริการใกล้ฉัน</button>
                                </div>
                                <div className='item-service'>
                                    <button onClick={setshow2}>จุดให้บริการทั้งหมด</button>
                                </div>
                            </div>
                        </div>
                        <div className="item-filter-price">
                            <div className="item-price-title">
                                <p>ช่วงราคา(THB)</p>
                            </div>
                            <div className="item-rang-price">
                                <div className="range">
                                    <p>Price Range</p>
                                    <div className="range-input">
                                        <input
                                            type="range"
                                            id="priceRange"
                                            min="80"
                                            max="999"
                                            value={changprice}
                                            onChange={handlePriceChange}
                                            step="1"

                                        />
                                        <span id="priceValue">: {changprice}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='content-product'>

                        {showloca === true ? (
                            <div>
                                {productnear.length === 0 ? (
                                    <div>
                                        <p>ไม่มีสินค้า</p>
                                    </div>
                                ) :
                                    productall.map(item => {
                                        return (
                                            <div key={item._id}>

                                                {distances.map((distance, index) => {
                                                    const matchingDistance = distance.lat === item.location.coordinates[1] && distance.lon === item.location.coordinates[0];
                                                    const numericDistance = parseFloat(distance.distance);
                                                    const IDstore = item.store[0]._id
                                                    const IDproduct = item._id
                                                    const namestores = item.store[0].nameStore
                                                    // เช็คการจำนวนสินค้าในการจอง
                                                    // let qproduct;
                                                    // let qproducts;
                                                    // if (item.quantityInStock <= 0) {
                                                    //     qproduct = 'สินค้าหมด'
                                                    //     if (item.quantityInStock <= 0) {
                                                    //         qproduct = 'สินค้าหมด'
                                                    //     }
                                                    // } else if (item.quantityInStock >= 0) {
                                                    //     qproduct = item.quantityInStock
                                                    //     if (item.quantityInStock >= 0) {
                                                    //         qproducts = <button className='btn-addbook' onClick={() => togglePopup(IDproduct, IDstore, namestores)} >Register</button>
                                                    //     } else {
                                                    //         qproducts = <button>สินค้าหมด</button>
                                                    //     }
                                                    // }

                                                    let ab
                                                    if (!favoriteitem.includes(item._id)) {
                                                        ab = <div className='btn-alls'><button style={{ border: 'none', background: 'none' }} type=' submit' onClick={() => addshoppingcard(IDproduct, IDstore, IDstore)}><FontAwesomeIcon className='white' icon={faHeart} style={{ color: iconColors[item._id] || 'white' }} /></button></div>
                                                    } else {
                                                        ab = <div className='btn-alls'><button style={{ border: 'none', background: 'none' }} type=' submit' onClick={() => deletefromcard(IDproduct, IDstore, IDstore)}><FontAwesomeIcon className='red' icon={faHeart} style={{ color: iconwhite[item._id] || 'red' }} /></button></div>
                                                    }

                                                    const filterprice = item.priceProduct >= changprice

                                                    if (filterprice && matchingDistance && numericDistance < 1) {
                                                        // set_num(numericDistance)
                                                        return (
                                                            <div className='boxitem1' key={index}>
                                                                <div className='img-box'>
                                                                    <img width={320} height={200} src={`../imageproduct/${item.imageProduct}`} alt="" />
                                                                </div>
                                                                <div className=''>
                                                                    <div className='namestore'>
                                                                        <p>{item.store[0].nameStore}</p>
                                                                    </div>

                                                                    <div className="desproduct">
                                                                        <p>ชื่อสินค้า : {item.nameProduct}</p>
                                                                        <p>จำนวนการใช้บริการ : {item.viewstore} ครั้ง</p>
                                                                        <p>อยู่ห่างจากคุณ : {distance.distance} กม. </p>
                                                                        {/* <p>จำนวนสินค้า : {qproduct} ชิ้น</p> */}

                                                                    </div>
                                                                    <div className='btn-all'>
                                                                        <button onClick={() => seemap(distance.lat, distance.lon)}>map </button>
                                                                        <button type='button' onClick={() => todetail(IDstore, IDuser)}>seemore</button>
                                                                    </div>
                                                                </div>
                                                                <div className="priceproduct">
                                                                    <div className="priceproducts">
                                                                        <p>{item.priceProduct} / Hr</p>
                                                                    </div>
                                                                    <div className="addbook">
                                                                        <div className='btn-addcard'>
                                                                            <button className='btn-addbook' onClick={() => togglePopup(IDproduct, IDstore, namestores)} >Register</button>
                                                                        </div>
                                                                        <div className="faver">
                                                                            <h5>{ab}</h5>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    return null
                                                })}

                                            </div>
                                        );
                                    })
                                }
                            </div>


                        ) : null
                        }
                    </div>

                    {/* //แสดงสินค้าทั้งหมด */}
                    <div className='content-product'>
                        {showloca2 == true && latitude != null && longitude != null ? (
                            productall.map(item => (
                                <div key={item._id}>
                                    {distances.map((distance, index) => {
                                        const matchingDistance = distance.lat === item.location.coordinates[1] && distance.lon === item.location.coordinates[0];//กำหนดค่าเเสดงเเค่ค่่าสถานที่ใกล้เคียง 
                                        const IDstore = item.store[0]._id
                                        const IDproduct = item._id
                                        const namestores = item.store[0].nameStore
                                        // เช็คการจำนวนสินค้าในการจอง
                                        // let qproduct;
                                        // let qproducts;
                                        // if (item.quantityInStock <= 0) {
                                        //     qproduct = 'สินค้าหมด'

                                        // } else if (item.quantityInStock >= 0) {
                                        //     qproduct = item.quantityInStock
                                        //     if (item.quantityInStock !== null) {
                                        //         qproducts = 
                                        //     }
                                        // }


                                        let ab
                                        if (!favoriteitem.includes(item._id)) {
                                            ab = <div className='btn-alls'><button style={{ border: 'none', background: 'none' }} type=' submit' onClick={() => addshoppingcard(IDproduct, IDstore, IDstore)}><FontAwesomeIcon className='white' icon={faHeart} style={{ color: iconColors[item._id] || 'white' }} /></button></div>
                                        } else {
                                            ab = <div className='btn-alls'><button style={{ border: 'none', background: 'none' }} type=' submit' onClick={() => deletefromcard(IDproduct, IDstore, IDstore)}><FontAwesomeIcon className='red' icon={faHeart} style={{ color: iconwhite[item._id] || 'red' }} /></button></div>
                                        }
                                        const filterprice = item.priceProduct >= changprice
                                        return (
                                            matchingDistance && filterprice && (
                                                <div className='boxitem2' key={index}>
                                                    <div className='img-box'>
                                                        <img width={300} height={200} src={`../imageproduct/${item.imageProduct}`} alt="" />
                                                    </div>
                                                    <div className='item-des'>
                                                        <div className="namestore">
                                                            <p>{item.store[0].nameStore}</p>
                                                        </div>
                                                        <div className="desproduct">
                                                            <p>{name}</p>
                                                            <p>ชื่อสินค้า : {item.nameProduct}</p>
                                                            <p>จำนวนการใช้บริการ : {item.viewstore} ครั้ง</p>
                                                            <p>อยู่ห่างจากคุณ : {distance.distance} กม.</p>
                                                            {/* <p>จำนวนสินค้า : {qproduct} ชิ้น</p> */}
                                                        </div>
                                                        <div className="btn-all">
                                                            <button onClick={() => seemap(distance.lat, distance.lon)}>map </button>
                                                            <button type='button' onClick={() => todetail(IDstore, IDuser)}>seemore</button>

                                                        </div>

                                                    </div>
                                                    <div className="priceproduct">
                                                        <div className="priceproducts">
                                                            <p>{item.priceProduct} / Hr</p>
                                                        </div>
                                                        <div className="addbook">
                                                            <div className='btn-addcard'>
                                                                <button className='btn-addbook' onClick={() => togglePopup(IDproduct, IDstore, namestores)} >Register</button>
                                                            </div>
                                                            <div className="faver">
                                                                <h5>{ab}</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        );
                                    })}

                                </div>
                            ))

                        ) : (
                            <>

                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashbord