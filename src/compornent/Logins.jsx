import React, { useEffect } from 'react'
import { useState  } from 'react'
import axios from 'axios';
import { useNavigate , redirect, Link  } from 'react-router-dom';


function Logins() {
    const [email , set_emails] = useState([]);
    const [password , set_passwords] = useState([]);
    const [userdata , set_userdata] = useState([]);
    const [useremails , set_useremail] = useState([])
    const [admin_emailcheck , setadmin_emailcheck] = useState([])
    const [adminemail , set_adminemail] = useState([]);
    const navigate = useNavigate();

    const username = (e)=>{
        set_emails(e.target.value)
    }
    const passwords =(e)=>{
        set_passwords(e.target.value)
    };

    // ดึงข้อมูลข้อมูลอีเมลมาเช็ค
    useEffect(()=>{
        axios.get('http://localhost:4001/users/getUsers').then((users)=>{
            set_userdata(users.data)
        })
        .catch((error)=>{
            console.log(error)
        })

        axios.get('http://localhost:4001/admin/email_admin')
        .then((response)=>{
            setadmin_emailcheck(response.data)
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            });

    },[]);

    useEffect(()=>{
        const email = userdata.map((item)=> item.useremail)
        const setadminemail = admin_emailcheck.map((items)=> items.adminmail)
        set_adminemail(setadminemail)
        set_useremail(email)
    },[userdata , admin_emailcheck]);

    const login =()=>{
        if(useremails.includes(email)) {
            axios.post('http://localhost:4001/users/logins',{ email ,password}) 
            .then((res)=>{
                if(res.data.data && res.data.data._id){
                    console.log(res.data)
                    const user = res.data.data._id.toString();

                    navigate('/Dashbord', {state:{user}})
                    // fecttopage(data);
                }else{
                    console.log(res.data.message)
                }
            }).catch((err)=>{
                console.log(err)
            })
        }else if (adminemail.includes(email)){
            axios.post('http://localhost:4001/admin/loginsadmin' , {email , password})
            .then((admin)=>{
                if(admin.data.success && admin.data.data._id){
                    console.log(admin.data)
                    const idadmin = admin.data.data._id.toString();
                    // navigate('/Dowload_ad/' + adminemail)
                    navigate('/Dashbord_ad' , {state:{idadmin}})
                    // admintopage(emailadmin);
                }else{
                    console.log(admin.data.message)
                }
                
            }).catch((error)=>{
                console.log(error)
            })  
        }
    }

    const fecttopage =(data)=>{
        console.log(data)
        // navigate('/Dowload/' + data)
    }
    const admintopage =(emailadmin)=>{
        console.log(emailadmin)
        // navigate('/Download_ad/' + emailadmin)
    }



  return (
    <div className='login-container'>
        <div className='item-login'>
            <div className=''>
                <input type="email" onChange={username} placeholder='email'/>
            </div>
            <div className=''>
                <input type="password" onChange={passwords} placeholder='password'/>
            </div>
            <button type='button' onClick={login}>login</button>
        </div>
    </div>
  )
}

export default Logins