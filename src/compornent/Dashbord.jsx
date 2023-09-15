import React ,{useEffect , useState} from 'react'
import { useParams ,Link } from 'react-router-dom';
import axios from 'axios';
import geolib from 'geolib';
import '../css/desbord.css';

import Detail_store from './store/Detail_store';


function Dashbord() {

    //  เก็บข้อมูลที่รับมาจาก APIs
    const [data_user , setdata_user] =useState([])
    // รับข้อมูลที่มากจากการเช็คในหน้าล๊อคอิน
    const {IDuser} = useParams();

    // เช็คการสร้าง store
    const [rescheck , set_rescheck] = useState([]);
    const [IDstore , set_IDstore] = useState('')

    const [IDuser_data] =useState(IDuser)
    //  รับค่าการส่งข้อมูลรูปภาพ profile

    // ดูสินค้าที่ join กับ store
    const [productall , set_productall] = useState([]);
    // เก็บข้อมูล location
    const [pointsToCompare , set_locas] = useState([]);
    // ข้อมูลระยะทาง
    const [distances, setDistances] = useState([]);
    const [distance1 , set_distance1] = useState([]);


    // check store account
    const [latitude , set_latitude] = useState(null)
    const [longitude , set_longitude] = useState(null)

    // รับค่าโชว์สินค้า
    const [showloca , set_showloca ] = useState(false)
    const [showloca2 , set_showloca2]= useState(true)

    const [showpopup , set_showpopup] = useState(false)


    const togglePopup = () =>{
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

            const interval = setInterval(getLocation, 6000);
    
            return () => {
                clearInterval(interval); // Clear interval when component is unmounted
            };
        }, []);
  

    // ดึงข้อมูลมาจาก apis โดยดึงจากข้อมูลที่ตรงกัน
    const fechdata = async()=>{
        const ressponse =  axios.get(`http://localhost:4001/users/datadetail/${IDuser}`);
        setdata_user((await ressponse).data)
    }
    useEffect (()=>{
        fechdata();
    }, []);
    // console.log(data_user)

    const hadlepopup = () =>{
        console.log(data_user._id)
    }

    // useEffect(()=>{
        
    //     const max = 8
    //     const input1 = 24
    //     const value = input1 - max

    //     for(let i = 1; i<=input1; i++){
    //         const value = i 
    //         // console.log('b',value )
    //     }

    //     if(input1 >= 8){
    //         for(let i = 1 ; i <= max ; i++){
    //             const total = i
    //             console.log("a" ,total)  
    //         }
    //     }
    //     if(input1 >= 16){
    //         for(let i = 1 ; i <= max ; i++){
    //             const total = i
    //             console.log("b" ,total)  
    //         }
    //     }
    //     if(input1 >= 24){
    //         for(let i = 1 ; i <= max ; i++){
    //             const total = i
    //             console.log("c" ,total)  
    //         }
    //     }
    // })


    // check your store
    useEffect(()=>{
        axios.get(`http://localhost:4001/store/getstore/${IDuser}`)
        .then((resvheck)=>{
            if(resvheck){
                // console.log(resvheck);
                set_rescheck(resvheck)
                set_IDstore(resvheck.data)
            }
            else{
                console.log('not data')
            }
        })
    },[]);
   
    // console.log(IDuser_data)
    // console.log(image)

    // ดูสินค้าที่ join กับ store
    useEffect(()=>{
        axios.get('http://localhost:4001/product/joinproduct')
        .then((result)=>{
            // console.log(result);
            set_productall(result.data)
        }).catch((error)=>{
            console.log(error)
        })
    },[])
    // console.log(productall)
    // console.log(all_product2)
    
    //เข้่าถึงข้อมูล location 
    useEffect(()=>{
            const store_productall = productall.map((loca)=> loca.location.coordinates)
            set_locas( store_productall)  
    },[productall])
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

    // console.log(latitude)

    // useEffect(()=>{
    //     const distance2 = distances.map((distances)=> distances.distance)
    //     // console.log(distance2)
    //     set_distance1(distance2)
    // },[distances]);

    // console.log(distance1)
    // console.log("show loca" , showloca)
    // console.log("show loca2" , showloca2)

  return (
    <div className='container'>
        <h1>Dashbord</h1>
        <h1>{IDuser}</h1>
        <p>{latitude}</p>
        <p>{longitude}</p>
        <div className={`popup ${showpopup ? 'visible' : ''}`}>
            <div className='regis'>
                <p>register</p>
                <button onClick={togglePopup}>close</button>
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
                ):(
                    <Link to={'/Store/' + IDstore._id }>ดูร้านค้า</Link>
                )}    


                    {/* สำหรับการดูที่บริการที่ใกล้ที่สุด */}
                <div className='box-all'>
                <div className='content-product1'>
                
                            {showloca === true  ? (
                                
                                productall.map(item => {
                                    return (
                                        <div  key={item._id}>
                                           
                                            {distances.map((distance, index) => {
                                                const matchingDistance = distance.lat === item.location.coordinates[1] && distance.lon === item.location.coordinates[0];
                                                const numericDistance = parseFloat(distance.distance);
                                                const IDstore = item.store[0]._id
                                                if (matchingDistance && numericDistance < 1) {
                                                    return (
                                                        
                                                        <div className='boxitem1' key={index}>
                                                            <p>ชื่อร้านค้า : {item.store[0]._id}</p> 
                                                            <p>ชื่อสินค้า : {item.nameProduct}</p>
                                                            <p>Distance from main point: {distance.distance} km</p>
                                                            <Link to={`/Detail_store/${IDstore}/${IDuser}`}>see more</Link>
                                                            <button onClick={togglePopup} >Register</button>
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
                <div  className='content-product2'>
                
                {showloca2 == true  && latitude != null &&  longitude != null ?  (
                     productall.map(item => (

                        <div  key={item._id}>
                             
                            {distances.map((distance, index) => {
                                const matchingDistance = distance.lat === item.location.coordinates[1] && distance.lon === item.location.coordinates[0] ;//กำหนดค่าเเสดงเเค่ค่่าสถานที่ใกล้เคียง 
                                return (
                                    matchingDistance &&  (
                                        <div className='boxitem2' key={index}>
                                            <p>ชื่อร้านค้าs : {item.store[0].nameStore}</p> 
                                            <p>ชื่อสินค้าs : {item.nameProduct}</p>
                                            {/* <p>Latitude: {distance.lat}, Longitude: {distance.lon}</p> */}
                                            <p>Distance from main point: {distance.distance} km</p>
                                            <Link to={`/Detail_store/${item.store[0]._id}/${IDuser}`}>see more</Link>
                                            <button onClick={togglePopup} >Register</button>
                                        </div>
                                    )
                                );
                            })}
                             
                        </div>
                    ))

                ):(
                    <>
                        <p>กำลังโหลดรายการ...</p>
                    </>
                )}
                </div>
                </div>
                
            
        </div>
    </div>
  )
}

export default Dashbord