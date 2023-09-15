import axios from 'axios';
import React from 'react'
import { useState , useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function Incurd_em() {
    
    const [locationInfo, setLocationInfo] = useState(null);


    // set value in database
    const {IDuser} = useParams();
    const IDusers = IDuser
    const [nameStore , setnameStore] = useState('')
    const [provin , setprovin] = useState('')
    const [description , setDestcription] = useState('')
    const [imageStores , setimagestore] = useState();
    const [latitude , set_latitude] = useState('')
    const [longitude , set_longitude] = useState('')


    const navigate = useNavigate();



    // สำหรับการส่งข้อมูลไปบันทึกใน APIs 
    // สำหรับการเก็บข้อมูลใน useState
    const handlenameStore =(e)=>{
        setnameStore(e.target.value)
    }
    console.log(nameStore)

    const handleprovin = (e)=>{
        setprovin(e.target.value)
    }

    const handledescription = (e) =>{
        setDestcription(e.target.value)
    }

    const handleimageStore = (e)=>{
        setimagestore(e.target.files[0])
  
    }

    
    
    

    const onsubmitStore = async()=>{
        if(imageStores){
            const formdatastore =  new FormData();
            formdatastore.append('IDuser' , IDuser);
            formdatastore.append('nameStore' , nameStore);
            formdatastore.append('provin' , provin);
            formdatastore.append('description' , description);
            formdatastore.append('imageStores' , imageStores)
            formdatastore.append('latitude' , latitude);
            formdatastore.append('longitude' , longitude);

            try{
                const res = await axios.post('http://localhost:4001/store/poststore', formdatastore , {
                    headers: {'Content-Type':'multipart/form-data'}
                });
                console.log('uploaded successfully:', res.data);
            }catch(error){
                console.log('Error upload data to store' , error)
            }
        }
    }


    useEffect(()=>{
        axios.get(`http://localhost:4001/store/getstore/${IDuser}`).then((res)=>{
            if(res.data == null){
                
                console.log("no have account")
                // navigate('/Store/' + userID)
            }
            else{
                console.log(res.data._id)
                navigate('/Store/' + res.data._id)
            }
        })
        
    },[])
    console.log(imageStores)




   
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



        // console.log(latitude)

  return (
    <div className='container'>
        <p>การสมัครสมาชิก</p>
        <p>{IDuser}</p>
        <form>
            <div className='fome-data'>
            {latitude && longitude ? (
                <div>
                <p>Latitude: {latitude}</p>
                <p>Longitude: {longitude}</p>
                </div>
            ) : (
                <p>Loading location...</p>
            )}
                <div className='Store'>
                    <p>ชื่อร้าน</p>
                    <input type="text" placeholder='store name' onChange={handlenameStore} />
                </div>
                <div className='Desc'>
                    <p>รายละเอียดพื้นที่ให้บริการ</p>
                    <input type="text" placeholder='Description' onChange={handledescription} />
                </div>
                <div className='Provin'>
                    <p>จังหวัดที่ให้บริการ</p>
                    <input type="text" placeholder='Provin' onChange={handleprovin} />
                </div>
                <div className='image'>
                    <p>ภาพพื้นที่ให้บริการ</p>
                    <input type="file" onChange={handleimageStore}/>
                </div>
                <button type='submit' onClick={onsubmitStore}>ok</button>
            </div>
        </form>
    </div>
  )
}

export default Incurd_em