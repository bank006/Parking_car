import React from 'react'
import axios from 'axios'
import { useState , useEffect  } from 'react'
// import { useParams  } from 'react-router-dom'

function Dasgbord_ad() {
    const [data , setdata] = useState([]);

    const fectdata = () =>{
        axios.get('http://localhost:4001/users')
        .then((result)=>{
            setdata(result.data)
        })
    }

    useEffect(()=>{
        fectdata();
    },[]);

  return (
    <div className='container'>
        <div className='boxuser'>
            {data.map((data)=>(
                <div key={data._id}>
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