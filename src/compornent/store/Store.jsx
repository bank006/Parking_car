import React from 'react'
import { useNavigate,  useParams } from 'react-router-dom'
import { useState , useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './css/store.css'




function Store() {
    const navigate = useNavigate();
    const {IDstore} = useParams();
    const [loginstore , set_loginstore] = useState([]);

    //push data
    const [imageProduct , set_imageproduct] = useState();
    const [nameProduct , set_nameproduct] = useState('');
    const [priceProduct , set_priceProduct ] = useState('')
    const [descriptionProduct , set_descriptionProduct] =useState('')
    const [quantityInStock , set_quantityInStock] = useState('')

    const [latitude , set_latitude] = useState('')
    const [longitude , set_longitude] = useState('')

    const [myproduct , set_myproduct] = useState(true)
    const [mybookingproduct , set_mybookingproduct ] = useState(false)

    const [dataproduct , set_dataproduct] = useState([]);
    console.log(longitude + ',' + latitude);

    // const UserId = userID

    // const n1 = 1
    // const n2 = 2
    // console.log(n1 + n2)
    const handleimagesproduct =(e)=>{
        set_imageproduct(e.target.files[0])
    }

    const handlenameproduct =(e)=>{
        set_nameproduct(e.target.value)
    }

    const handleprice = (e)=>{
        set_priceProduct(e.target.value)
    }

    const handledescrip =(e)=>{
        set_descriptionProduct(e.target.value)
    }

    const handlequantity = (e)=>{
        set_quantityInStock(e.target.value)
    }

    // const handelstyle = {
    //     border : '1px solid black'
    // }


    // push data to schema
    const onsubmitproduct = async()=>{
        if(imageProduct){
            const formdataproduct = new FormData();
            formdataproduct.append('IDstore' , IDstore);
            formdataproduct.append('imageProduct' , imageProduct);
            formdataproduct.append('nameProduct' , nameProduct);
            formdataproduct.append('priceProduct' , priceProduct);
            formdataproduct.append('descriptionProduct', descriptionProduct);
            formdataproduct.append('quantityInStock', quantityInStock );
            formdataproduct.append('latitude' , latitude);
            formdataproduct.append('longitude' , longitude);
            try{
                const resproduct = await axios.post('http://localhost:4001/product/postproduct', formdataproduct , {
                    headers: {'Content-Type':'multipart/form-data'}
                })
               console.log('uploaded successfully:', resproduct.data)
               window.location.href = '/Store/' + IDstore;
            }catch(error){
                console.log('Error upload data to store' , error)
            }
           
        }
    }
    

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

    useEffect(()=>{
        axios.get(`http://localhost:4001/store/loginstore/${IDstore}`)
        .then((res)=>{
            set_loginstore(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    },[]);
    // console.log(loginstore)

    useEffect(()=>{
        axios.get(`http://localhost:4001/product/getproduct/${IDstore}`)
        .then((respro)=>{
            if(!respro){
                console.log('error')
            }
            else{
                // console.log(respro.data)
                set_dataproduct(respro.data)
            }
        }).catch((error)=>{
            console.log(error)
        })

    },[])

    // console.log(dataproduct)

    const handlemyproduct = ()=>{
        if(myproduct){
            set_myproduct(false)
        }
        else{
            set_myproduct(true)
            set_mybookingproduct(false)
        }
    }

    const handlemybookingproduct = ()=>{
        if(mybookingproduct){
            set_mybookingproduct(false)
        }
        else{
            set_mybookingproduct(true)
            set_myproduct(false)
        }
    }
    console.log(myproduct)





  return (
    <div>
        { !loginstore  ? (
            <p>ท่านยังไม่ได้สมัคร account สำหรับการให้บริการ</p>
        ):(
        <>
            <h1>{IDstore}</h1>
            <p>{latitude}</p>
            <p>{longitude}</p>
            <p>ร้านค้าของคุณ</p>
            <div className='calss-box'>
                <div className='box-input'>
                    <div className='box-upload-'>
                        <input type="file"  placeholder='ภาพร้านค้า' onChange={handleimagesproduct} />
                    </div>
                    <div className='box-upload-'>
                        <input type="text"  placeholder='ชื่อสินค้า' onChange={handlenameproduct} />
                    </div>
                    <div className='box-upload-'>
                        <input type="number" placeholder='ราคาสินค้า' onChange={handleprice} />
                    </div>
                    <div className='box-upload-'>
                        <input type="text"  placeholder='รายละเอียดสินค้า' onChange={handledescrip} />
                    </div>
                    {/* <div className='box-upload-'>
                        <input type="number" placeholder='จำนวนสินค้า' onChange={handlequantity} />
                    </div> */}
                    <button type='sunmit' onClick={onsubmitproduct} >submit</button>
                    <Link to={'/Dashbord/' + loginstore.IDuser }>back</Link>
                </div>
            </div> 
            <>
            
            <div className='boxvalue'>
            <h1>รายการของฉัน</h1>
                <div className='value'>
                    <button onClick={handlemyproduct}>สินค้าของฉัน</button>
                </div>
                <div className='value'>
                    <button onClick={handlemybookingproduct} >หน้าการสั่งซื้อ</button>
                </div>
            </div>
            <div className='velue_menu'>
            <div className='myproduct' >
                {myproduct == true ? (
                    <div className='box_volum' >
                        {dataproduct.map((resproduct)=>(
                        <div className='item-box-product' key={resproduct._id} >
                            <p>{resproduct.IDstore}</p>
                            <p>{}</p>
                            <img width={50} height={50} src={`../imageproduct/${resproduct.imageProduct}`}/>
                            <p>{resproduct.nameProduct}</p>
                        </div>
                        ))}
                    
                    </div>
                ):(
                <>
                <p></p>
                </> 
                )}

            </div>
            <div className='mybooking'>
                {mybookingproduct == true ? (
                    <div className='product'>
                        <p>this is your booking product</p>
                    </div>
                ):(
                    <div>
                        <p></p>
                    </div>
                )}
            </div>

            </div>
            </>
        </>
        )}
    </div>   
  )
}

export default Store