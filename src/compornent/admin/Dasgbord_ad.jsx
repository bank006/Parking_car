import React from 'react'
import axios from 'axios'
import { useState , useEffect  } from 'react'
import { useParams  } from 'react-router-dom'

function Dasgbord_ad() {

    const {IDadmin} = useParams();



    const [UserId , setUsetId] = useState([])

    const [data , setdata] = useState([]);
    const [data_admin , setdata_admin] = useState([]);
    const [imageUser , set_imageUser] = useState([])

    const fectdata = () =>{
        axios.get('http://localhost:4001/users/')
        .then((result)=>{
            setdata(result.data)
        })
    }
    useEffect(()=>{
        fectdata();
    },[]);

    // console.log(data)
    



  return (
    <div className='container'>
        {/* <h1>{IDadmin}</h1> */}
        <div className='boxuser'>
            {data.map((data)=>(
                <div key={data._id}>
                    <h1>{UserId}</h1>
                    {!data.image ? (
                        <img src="../public/images/1.png" width={150} height={150} />
                    ):
                    (
                        <img src={`../image/${data.image}`} width={150} height={150} />
                    )}
                    <h1 >{data.name}</h1> 
                    <button type='submit'>edit</button>    
                    <button type='submit'>detail</button>    
                </div>
            ))}

           
        </div>
    </div>
  )
}

export default Dasgbord_ad