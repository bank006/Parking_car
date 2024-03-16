import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
function Incurd_em() {

    const [locationInfo, setLocationInfo] = useState(null);


    // set value in database
    const location = useLocation();
    const IDuser = location.state?.IDuser

    const [nameStore, setnameStore] = useState('')
    const [provin, setprovin] = useState('')
    const [description, setDestcription] = useState('')
    const [imageStores, setimagestore] = useState();
    const [latitude, set_latitude] = useState('')
    const [longitude, set_longitude] = useState('')


    const navigate = useNavigate();



    // สำหรับการส่งข้อมูลไปบันทึกใน APIs 
    // สำหรับการเก็บข้อมูลใน useState
    const handlenameStore = (e) => {
        setnameStore(e.target.value)
    }

    const handleprovin = (e) => {
        setprovin(e.target.value)
    }

    const handledescription = (e) => {
        setDestcription(e.target.value)
    }

    const handleimageStore = (e) => {
        setimagestore(e.target.files[0])

    }


    const onsubmitStore = async () => {
        if (imageStores) {
            const formdatastore = new FormData();
            formdatastore.append('IDuser', IDuser);
            formdatastore.append('nameStore', nameStore);
            formdatastore.append('provin', provin);
            formdatastore.append('description', description);
            formdatastore.append('imageStores', imageStores)
            formdatastore.append('latitude', latitude);
            formdatastore.append('longitude', longitude);

            try {
                axios.post('http://localhost:4001/store/poststore', formdatastore, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }).then((res) => {
                    navigate('/Profile', { state: { IDuser } })
                    console.log('uploaded successfully:', res.data);
                }).catch((err) => {
                    console.log(err)
                })

            } catch (error) {
                console.log('Error upload data to store', error)
            }
        }
    }


    useEffect(() => {

        console.log(IDuser)
        axios.get(`http://localhost:4001/store/getstore/${IDuser}`).then((res) => {
            if (res.data === null) {
                console.log(res.data)
                console.log("no have account")
                // navigate('/Profile', { state: { IDuser } })
                // navigate('/Store/' + userID)
            }
            else {
                console.log(res.data._id)
                const IDstores = res.data._id
                navigate('/Store', { state: { IDstores } })
            }
        })


    }, [])





    //สำหรับการหา latitude longitude ไว้าำหรับการปักหมุดบนแผนที่
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
    }, []);


    return (
        <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }} className='container'>


            <form>
                <div style={{ border: '1px solid black', borderRadius: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '300px', height: '300px' }} className='fome-data'>
                    <div style={{ width: '80%', height: '80%' }}>
                        <p style={{ textAlign: 'center' }}>การสมัครสมาชิก</p>
                        <div style={{marginTop:'5px'}}>
                            <div style={{marginBottom:'5px' ,border: '1px solid black', borderRadius: '13px', height: '30px', display: 'flex', alignItems: 'center' }}  className='Store'>
                                <input style={{ marginLeft: '5px', border: 'none', background: 'none', outline: 'none' }} type="text" placeholder='ชื่อร้าน' onChange={handlenameStore} />
                            </div>
                            <div style={{marginBottom:'5px' , border: '1px solid black', borderRadius: '13px', height: '30px', display: 'flex', alignItems: 'center' }}  className='Desc'>
                                <input  style={{ marginLeft: '5px', border: 'none', background: 'none', outline: 'none' }} type="text"  placeholder='รายละเอียดพื้นที่ให้บริการ' onChange={handledescription} />
                            </div>
                            <div style={{marginBottom:'5px' , border: '1px solid black', borderRadius: '13px', height: '30px', display: 'flex', alignItems: 'center' }}  className='Provin'>
                                <input  style={{ marginLeft: '5px', border: 'none', background: 'none', outline: 'none' }} type="text" placeholder='จังหวัดที่ให้บริการ' onChange={handleprovin} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px', marginTop: '14px' }} className='image'>
                                <label style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#DD9304', height: '100%', padding: '3px', borderRadius: '13px' }} htmlFor="img-area">ภาพพื้นที่ให้บริการ</label>
                                <input style={{ display: 'none' }} id='img-area' type="file" onChange={handleimageStore} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }} className="div">
                                <button style={{border:'none',backgroundColor:'#DD9304',width:'100px',height:'30px',borderRadius:'13px', background:'none'}} type='submit' onClick={onsubmitStore}>ok</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Incurd_em