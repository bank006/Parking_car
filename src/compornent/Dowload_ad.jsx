import React, { useEffect, useState } from 'react'
import { useParams , Link , useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import axios from 'axios'

function Dowload_ad() {

    const [adminpass , setadminpass] = useState([]);
    //รับข้อมูลจากค่า params 
    const {email_admin} = useParams();

    const navigate = useNavigate();
    const location = useLocation();

    // เช้คอีเมลที่ส่งมาจากล้อคอิน
    // หลังจากนั้นดึงข้อมูลออกมา
    const fectdataadmin = async()=>{
        const response_admin = axios.get(`http://localhost:4001/admin/dataAdmin/${email_admin}`)
        setadminpass((await response_admin).data)
    }

    useEffect(()=>{
        fectdataadmin();
    }, []);
   
    // ทำการส่งข้อมูลในค่า ID ของ admin เพื่อส่งค่าไปหน้า dashbord admin
    console.log(adminpass._id)
    const IDadmin = adminpass._id
    useEffect(()=>{
        if(IDadmin){
            navigate('/Dashbord_ad/' + IDadmin )
        }
    })

  return (
    <div>
        <h1>{email_admin}</h1>
    </div>
  )
}

export default Dowload_ad