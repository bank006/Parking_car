import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/desbord.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// เพิ่ม import ของ mongoose
import mongoose from 'mongoose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

import Navbars from './Navbar';
import Select from './patment/Selectpayment';
import Maps from './Maps';

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
        set_IDproductregis(IDproduct)
        set_storeregis(IDstore)
        setnamest(namestores)
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

    const [selectpayment, setselectpayment] = useState(false)
    const [datapayment, set_datapayment] = useState([])

    // จองสินค้่าเเละอัพเดตจำนวนสินค้าที่เหลือ
    const regisproduct = (IDproductregis, storeregis) => {
        if (startbookingregis.length === 0) {
            alert('กรุณาเลือกเวลา')
        } else if (timeregis.length === 0) {
            alert('กรุณาเลือกเวลา')
        } else {
            setselectpayment(true)
            set_datapayment({ IDproductregis, IDuser, storeregis, startbookingregis, timeregis })
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
    const activityparking = Array.from({ length: numberofparking }, (_, index) => index + 1)


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
                        {productrecall && (
                            <div className='container-box'>
                                <div className="all-boxs">
                                    <div className="area-parking">
                                        <div className={`box-parking ${quantityInStockrel >= 6 && quantityInStockrel <= 8 ? 'many-parking' : '' || quantityInStockrel > 8 && quantityInStockrel <= 10 ? 'somany-parking' : '' || quantityInStockrel <= 5 ? 'four-parking' : '' || quantityInStockrel > 10 && quantityInStockrel <= 15 ? 'verymore-parking' : '' || quantityInStockrel >= 16 && quantityInStockrel < 20 ? 'fivety-parking' : '' || quantityInStockrel >= 20 ? 'end-parking' : ''}`}>
                                            <div className="befparking">
                                                {activityparking.map((boxs, index) => (
                                                    <div className='aa' key={index}>
                                                        <div className='parking' ></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className={`boxs ${boxes.length >= 6 && boxes.length <= 8 ? 'many-boxes' : '' || boxes.length > 8 && boxes.length <= 10 ? 'manys-boxs' : '' || boxes.length <= 5 ? 'fourboxs' : '' || boxes.length > 10 && boxes.length <= 15 ? 'verymore-box' : '' || boxes.length >= 16 && boxes.length < 20 ? 'fivety-box' : '' || boxes.length >= 20 ? 'end-box' : ''}`}>
                                            {boxes.map((box, index) => {

                                                return (
                                                    <div key={index} className="box">
                                                        <p>{box + "-A"}</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="des-productrecall">
                                        <div className="btn-close">
                                            <button onClick={closepopup}><img src='/public/back.png' alt="" /></button>
                                        </div>
                                        <div className="box-productrecall">
                                            <div className="recallproduct-item">
                                                <p className='namest'>{namest}</p>
                                                <p>ช่องว่างที่เหลือ: {productrecall.quantityInStock} ช่อง</p>
                                            </div>
                                            <div className="input-item">
                                                <div className="start-item">
                                                    <div className="lebel-start">
                                                        <label htmlFor="datetime">เลือกวันที่และเวลาที่เริ่มจอง:</label>
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
            <div className='title'>
                {/* สำหรับการดูที่บริการที่ใกล้ที่สุด */}
                <div className='box-all'>
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
                                                            qproducts = <button className='btn-addbook' onClick={() => togglePopup(IDproduct, IDstore, namestores)} >Register</button>
                                                        } else {
                                                            qproducts = <button>สินค้าหมด</button>
                                                        }
                                                    }

                                                    let ab
                                                    if (!favoriteitem.includes(item._id)) {
                                                        ab = <div className='btn-alls'><button style={{ border: 'none', background: 'none' }} type=' submit' onClick={() => addshoppingcard(IDproduct, IDstore, IDstore)}><FontAwesomeIcon className='white' icon={faHeart} style={{ color: iconColors[item._id] || 'white' }} /></button></div>
                                                    } else {
                                                        ab = <div className='btn-alls'><button style={{ border: 'none', background: 'none' }} type=' submit' onClick={() => deletefromcard(IDproduct, IDstore, IDstore)}><FontAwesomeIcon className='red' icon={faHeart} style={{ color: iconwhite[item._id] || 'red' }} /></button></div>
                                                    }


                                                    if (matchingDistance && numericDistance < 1) {
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
                                                                        <p>จำนวนสินค้า : {qproduct} ชิ้น</p>

                                                                    </div>
                                                                    <div className='btn-all'>
                                                                        <button onClick={() => seemap(distance.lat, distance.lon)}>map </button>
                                                                        <button type='button' onClick={() => todetail(IDstore, IDuser)}>seemore</button>
                                                                    </div>
                                                                </div>
                                                                <div className="priceproduct">
                                                                    <div className="priceproducts">
                                                                        <p>{item.priceProduct}</p>
                                                                    </div>
                                                                    <div className="addbook">
                                                                        <div className='btn-addcard'>
                                                                            <p>{qproducts}</p>
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
                                                qproducts = <button className='btn-addbook' onClick={() => togglePopup(IDproduct, IDstore, namestores)} >Register</button>
                                            }
                                        }

                                        let ab
                                        if (!favoriteitem.includes(item._id)) {
                                            ab = <div className='btn-alls'><button style={{ border: 'none', background: 'none' }} type=' submit' onClick={() => addshoppingcard(IDproduct, IDstore, IDstore)}><FontAwesomeIcon className='white' icon={faHeart} style={{ color: iconColors[item._id] || 'white' }} /></button></div>
                                        } else {
                                            ab = <div className='btn-alls'><button style={{ border: 'none', background: 'none' }} type=' submit' onClick={() => deletefromcard(IDproduct, IDstore, IDstore)}><FontAwesomeIcon className='red' icon={faHeart} style={{ color: iconwhite[item._id] || 'red' }} /></button></div>
                                        }
                                        return (
                                            matchingDistance && (
                                                <div className='boxitem2' key={index}>
                                                    <div className='img-box'>
                                                        <img width={300} height={200} src={`../imageproduct/${item.imageProduct}`} alt="" />
                                                    </div>
                                                    <div className='item-des'>
                                                        <div className="namestore">
                                                            <p>{item.store[0].nameStore}</p>
                                                        </div>
                                                        <div className="desproduct">
                                                            <p>ชื่อสินค้า : {item.nameProduct}</p>
                                                            <p>จำนวนการใช้บริการ : {item.viewstore} ครั้ง</p>
                                                            <p>อยู่ห่างจากคุณ : {distance.distance} กม.</p>
                                                            <p>จำนวนสินค้า : {qproduct} ชิ้น</p>
                                                        </div>
                                                        <div className="btn-all">
                                                            <button onClick={() => seemap(distance.lat, distance.lon)}>map </button>
                                                            <button type='button' onClick={() => todetail(IDstore, IDuser)}>seemore</button>

                                                        </div>

                                                    </div>
                                                    <div className="priceproduct">
                                                        <div className="priceproducts">
                                                            <p>{item.priceProduct}</p>
                                                        </div>
                                                        <div className="addbook">
                                                            <div className='btn-addcard'>
                                                                <p>{qproducts}</p>
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