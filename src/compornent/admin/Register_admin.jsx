import { useEffect, useState } from 'react'
import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


function Register_admin() {
    const [admin_name , setadmin_name] = useState('')
    const [admin_email , setadmin_email] = useState('')
    const [admin_password, setadmin_password] = useState('')
    const [admin_passwordnh , setadmin_passwordnh] = useState('')
    const [admin_cpassword , setadmin_cpassword] = useState('')
    const [admin_emailcheck , setadmin_emailcheck] = useState([])
    const [emaildata , setemaildata] = useState([])

    // สำหรับการการเช็ค email ซำ้ใน user
    const [datas , setdata] = useState([]);
    // สำหรับการเอาตัวเเปลการลูปใน User
    const [emails, setEmails] = useState([]);
    // การส่งค่าไปหน้าใหม่
    const  navigate = useNavigate();

    const Registeradmin = (e) =>{
        e.preventDefault();
        try{
            if(admin_name == ''){
                alert("somting went wrong")
                navigate('/Register_ad')
                end();
            }
            else if (emaildata.includes(admin_email)|| emails.includes(admin_email) || admin_email == ''){
                alert("somting went wrong")
                navigate('/Register_ad')
                end();
            }
            else if (admin_password == ''){
                alert("somting went wrong")
                navigate('/Register_ad')
                end();
            }else if (admin_password != admin_cpassword){
                alert('passwor not match')
                navigate('/Register_ad')
                end();
            }
            else{
                navigate('/Logins')
            }
            axios.post('http://localhost:4001/admin/postadmin' , {admin_name ,admin_email, admin_password , admin_passwordnh})
            
        }catch(error){
            console.log(`Error: ${error}`)
        }
    }
    
    const adminname =(e)=> {
        setadmin_name(e.target.value)
    }
    const adminemail =(e)=> {
        setadmin_email(e.target.value)
    }
    const adminpassword =(e)=> {
        setadmin_password(e.target.value)
        setadmin_passwordnh(e.target.value)
    }
    const admincpassword =(e)=>{
        setadmin_cpassword(e.target.value)
    }

    // การดึง APIs สำหรับการเช็คอีเมลของ admin
    useEffect(()=>{
        axios.get('http://localhost:4001/admin/email_admin')
        .then((response)=>{
            setadmin_emailcheck(response.data)
        })
    },[])
    // console.log(email_admin)

    // การลูปเอาข้อมูลใน Array
    useEffect(()=>{
        const email_admin = admin_emailcheck.map((item)=> item.adminmail);
        setemaildata(email_admin)
    },[admin_emailcheck])

    // console.log(emaildata)
    // console.log(admin_emailcheck)

    // การดึง APIs สำหรับการเช็คอีเมลของ users
    useEffect(()=>{
        axios.get('http://localhost:4001/users/getemail')
        .then((datas)=>{
            setdata(datas.data)
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
          });
    }, []);

     // การลูปเอาข้อมูลใน Array
    useEffect(() => {
        const emailList = datas.map((item)=> item.email);
        setEmails(emailList);
        
    }, [datas]);
    // console.log(emails)

    

  return (
    <div className='container_admin'>
        <form>
            <div className='box-center'>
                <h3 className='admin-title'>Admin center</h3>
                <div className='input-text'>
                    <p>Name</p>
                    <input type="text" placeholder='name' onChange={adminname} />
                </div>
                <div className='input-text'>
                    <p>Email</p>
                    <input type="email" placeholder='email' onChange={adminemail} />
                </div>
                <div className='input-text'>
                    <p>password</p>
                    <input type="password" placeholder='password' onChange={adminpassword} />
                </div>
                <div className='input-text'>
                    <p>password</p>
                    <input type="password" placeholder='confirmpassword' onChange={admincpassword} />
                </div>
                <div className='submit'>
                    <button type='submit' onClick={Registeradmin}>submit</button>
                </div>
            </div>
        </form>
    </div>
  )
}

export default Register_admin