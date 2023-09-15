import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'

function Push_product() {

    // const [dataproduct , set_dataproduct] = useState([]);


    // useEffect(()=>{
    //     axios.get('http://localhost:4001/product')
    //     .then((res)=>{   
    //         if(!res.data){
    //             console.log("not have product")
    //         }else{
    //             set_dataproduct(res.data)
    //         }
    //     }).catch((error)=>{
    //         console.log(error)
    //     })
    // },[]);
   

    
  return (
    <div>
        <p>รายการสินค้าของฉัน</p>
        {/* {dataproduct.map((resproduct)=>(
            <div key={resproduct._id}>
                <p>{resproduct._id}</p>
                <p>{resproduct.imageProduct}</p>
                <p>{resproduct.nameProduct}</p>
            </div>
        ))} */}
    </div>
  )
}

export default Push_product