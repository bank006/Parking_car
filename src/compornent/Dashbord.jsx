import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/desbord.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// เพิ่ม import ของ mongoose
import mongoose from 'mongoose';

import Navbars from './Navbar';

function Dashbord() {
    const navigate = useNavigate();
    const location = useLocation();

    // รับข้อมูลที่มากจากการเช็คในหน้าล๊อคอิน
    const IDuser = location.state?.user || ''; // หรือค่าเริ่มต้นที่ถูกต้อง


    function toObjectId(id) {
        if (id && mongoose.Types.ObjectId.isValid(id)) {
            return new mongoose.Types.ObjectId(id).toString();
        }
        return id;
    }

    if (IDuser) {
        const userID = toObjectId(IDuser);

    } else {
        navigate('/login');
        window.location.reload();
    }


    //  เก็บข้อมูลที่รับมาจาก APIs
    const [data_user, setdata_user] = useState([])

    // เช็คการสร้าง store
    const [rescheck, set_rescheck] = useState([]);
    const [IDstore, set_IDstore] = useState('')

    const [IDuser_data] = useState(IDuser)
    //  รับค่าการส่งข้อมูลรูปภาพ profile

    // ดูสินค้าที่ join กับ store
    const [productall, set_productall] = useState([]);
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
    const [productrecall, set_productrecall] = useState(null)
    const [storerecall, set_storecall] = useState(null)


    //เก็บข้อมูลการจอง 
    const [timeregis, set_timeregis] = useState([])
    const [IDproductregis, set_IDproductregis] = useState([])
    const [storeregis, set_storeregis] = useState([]);
    const [startbookingregis, set_startbookingregis] = useState([])

    const togglePopup = async (IDproduct, IDstore) => {
        set_showpopup(!showpopup)
        set_IDproductregis(IDproduct)
        set_storeregis(IDstore)
        console.log(IDproduct)
        console.log(IDstore)

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

    // console.log(distances)

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


    // check your store
    useEffect(() => {
        axios.get(`http://localhost:4001/store/getstore/${IDuser}`)
            .then((resvheck) => {
                if (resvheck) {
                    // console.log(resvheck);
                    set_rescheck(resvheck)
                    set_IDstore(resvheck.data)
                }
                else {
                    console.log('not data')
                }
            })
    }, []);


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
    // console.log(pointsToCompare)

    // โชส์สินค้าที่ในระยะทาง
    const setshow = () => {
        set_showloca(true)
        set_showloca2(false)
    }
    const setshow2 = () => {
        set_showloca2(true)
        set_showloca(false)
    }

    const todetail = (IDstore, IDuser) => {
        // console.log(IDstore , IDuser)
        navigate('/Detail_store', { state: { IDstore, IDuser } })
    }
    const clicktoprofile = (IDstores) => {
        console.log(IDstores)
        navigate('/Store', { state: { IDstores } })
    }

    //เพิ่มข้อมูลการจอง
    const handle_timesregis = (e) => {
        set_timeregis(e.target.value)
    }
    //เพิ่มวันเวลาเริ่มการจอง
    const handle_startbookingregis = (e) => {
        set_startbookingregis(e.target.value)
    }

    // จองสินค้่าเเละอัพเดตจำนวนสินค้าที่เหลือ
    const regisproduct = (IDproductregis, storeregis) => {
        if (startbookingregis.length === 0) {
            alert('กรุณาเลือกเวลา')
        } else if (timeregis.length === 0) {
            alert('กรุณาเลือกเวลา')
        } else {
            axios.post('http://localhost:4001/booking/postbooking', { IDproductregis, IDuser, storeregis, startbookingregis, timeregis })
                .then((res) => {
                    console.log(res)
                    window.location.reload();
                }).catch((err) => {
                    console.log(err)
                })

            // ลบ stock เข้าไปเมื่อกดจอง
            axios.put(`http://localhost:4001/product/updatepostbooking/${IDproductregis}`)
                .then((update) => {
                    console.log(update)
                }).catch((err) => {
                    console.log(err)
                })
        }


    }

    // เพิ่มสินค้าลงตระกร้าสินค้า
    const addshoppingcard = (IDproductregis, storeregis) => {
        console.log(IDproductregis, IDuser, storeregis)
        axios.post('http://localhost:4001/shoppingcart/postshoppingcard', { IDproductregis, IDuser, storeregis })
            .then((card) => {
                console.log(card.data)
                // window.location.reload();
            }).catch((err) => {
                console.log(err)
            })
    }



    return (
        <div className='container'>
            <Navbars totalID={{ IDuser: IDuser }} />
            {/* <h1>{IDuser}</h1> */}
            <p>{latitude}</p>
            <p>{longitude}</p>
            {/* popup เลือกเวลาในการใช้สั่งของ */}
            <div className={`popup ${showpopup ? 'visible' : ''}`}>
                <div className='box-regis'>
                    <div className='regis'>
                        <p>เลือกพื้นที่การจอดรถ</p>
                        {productrecall && (
                            <div>
                                <p>ชื่อสินค้า: {productrecall.nameProduct}</p>
                                <p>รายละเอียดสินค้า: {productrecall.descriptionProduct}</p>
                            </div>
                        )}

                        <label htmlFor="datetime">เลือกวันที่และเวลาที่เริ่มจอง:</label>
                        <input type="datetime-local" id="datetime" name="datetime" onChange={handle_startbookingregis} required></input>
                        <label htmlFor="datetime">เลือกวันที่และเวลาสิ้นสุดการจอง:</label>
                        <input type="datetime-local" id="datetime" name="datetime" onChange={handle_timesregis} required></input>
                        <button onClick={() => regisproduct(IDproductregis, storeregis)} >addproduct</button>
                        <button onClick={closepopup}>close</button>
                    </div>
                </div>
            </div>
            <button onClick={setshow}>จุดให้บริการใกล้ฉัน</button>
            <button onClick={setshow2}>จุดให้บริการทั้งหมด</button>

            <div className='title'>
                <div className='boxuser'>
                    <div className='profile'>
                        <Link to={'/Profile/' + data_user._id}>profile</Link>
                        <p onMouseEnter={hadlepopup}>{data_user.name}</p>
                        <p>{data_user.email}</p>
                        <Link to={'/Book_car'} >link</Link>
                    </div>
                </div>

                {/* สำหรับการเช็คหน้าร้านค้า */}
                {rescheck.data == null ? (
                    <Link to={'/Incrud/' + data_user._id}>สร้างร้านค้า</Link>
                ) : (
                    // <Link to={'/Store/' + IDstore._id }>ดูร้านค้า</Link>
                    <button type='button' onClick={() => clicktoprofile(IDstore._id)}>ดูร้านค้า</button>
                )}


                {/* สำหรับการดูที่บริการที่ใกล้ที่สุด */}
                <div className='box-all'>
                    <div className='content-product1'>

                        {showloca === true ? (

                            productall.map(item => {
                                return (
                                    <div key={item._id}>
                                        {distances.map((distance, index) => {
                                            const matchingDistance = distance.lat === item.location.coordinates[1] && distance.lon === item.location.coordinates[0];
                                            const numericDistance = parseFloat(distance.distance);
                                            const IDstore = item.store[0]._id
                                            const IDproduct = item._id

                                            // เช็คการจำนวนสินค้าในการจอง
                                            let qproduct;
                                            let qproducts;
                                            if (item.quantityInStock <= 0) {
                                                qproduct = 'สินค้าหมด'
                                                if (item.quantityInStock <= 0) {
                                                    qproduct = 'สินค้าหมด'
                                                }
                                            } else if (item.quantityInStock >= 0) {
                                                qproduct = item.quantityInStock
                                                if (item.quantityInStock >= 0) {
                                                    qproducts = <button onClick={() => togglePopup(IDproduct, IDstore)} >Register</button>
                                                }
                                            }

                                            if (matchingDistance && numericDistance < 1) {
                                                return (
                                                    <div className='boxitem1' key={index}>
                                                        <p>ชื่อร้านค้า : {item.store[0]._id}</p>
                                                        <p>ชื่อสินค้า : {item.nameProduct}</p>
                                                        <p>รหัสสินค้า : {item._id}</p>
                                                        <p>Distance from main point: {distance.distance} km</p>
                                                        <p>จำนวนสินค้า : {qproduct}</p>
                                                        <p>{qproducts}</p>
                                                        <button type='button' onClick={() => todetail(IDstore, IDuser)}>seemore</button>
                                                        <button type=' submit' onClick={() => addshoppingcard(IDproduct, IDstore, IDstore)}>addcard</button>
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div>
                                );
                            })
                        ) : (
                            <p></p>
                        )}
                    </div>

                    {/* //แสดงสินค้าที่ใกล้มากที่สุด */}
                    <div className='content-product2'>

                        {showloca2 == true && latitude != null && longitude != null ? (
                            productall.map(item => (

                                <div key={item._id}>

                                    {distances.map((distance, index) => {
                                        const matchingDistance = distance.lat === item.location.coordinates[1] && distance.lon === item.location.coordinates[0];//กำหนดค่าเเสดงเเค่ค่่าสถานที่ใกล้เคียง 
                                        const IDstore = item.store[0]._id
                                        const IDproduct = item._id

                                        // เช็คการจำนวนสินค้าในการจอง
                                        let qproduct;
                                        let qproducts;
                                        if (item.quantityInStock <= 0) {
                                            qproduct = 'สินค้าหมด'
                                            if (item.quantityInStock <= 0) {
                                                qproduct = 'สินค้าหมด'
                                            }
                                        } else if (item.quantityInStock >= 0) {
                                            qproduct = item.quantityInStock
                                            if (item.quantityInStock >= 0) {
                                                qproducts = <button onClick={() => togglePopup(IDproduct, IDstore)} >Register</button>
                                            }
                                        }
                                        return (
                                            matchingDistance && (
                                                <div className='boxitem2' key={index}>
                                                    <p>ชื่อร้านค้าs : {item.store[0].nameStore}</p>
                                                    <p>ชื่อสินค้าs : {item.nameProduct}</p>
                                                    <p>รหัสสินค้า : {item._id}</p>
                                                    <p>Distance from main point: {distance.distance} km</p>
                                                    <p>จำนวนสินค้า : {qproduct}</p>
                                                    <p>{qproducts}</p>
                                                    <button type='button' onClick={() => todetail(IDstore, IDuser)}>seemore</button>
                                                    <button type=' submit' onClick={() => addshoppingcard(IDproduct, IDstore, IDstore)}>addcard</button>
                                                </div>
                                            )
                                        );
                                    })}

                                </div>
                            ))

                        ) : (
                            <>
                                <p>aa</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashbord