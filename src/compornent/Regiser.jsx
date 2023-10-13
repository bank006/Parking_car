import React, { useEffect } from 'react'
import { useState  } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';




function Regiser() {
    const [name , setname] = useState('');
    const [email , setemail] = useState('');
    const [password , setpassword] = useState('');
    const [passwordnh , setpasswordnh] = useState('');
     // สำหรับการเช็คค่า email ซำ้ใน users เเละการส่งเข้าลูปเพื่อดึงข้อมูล
    const [datas , setdata] = useState([]); 
    const [emails, setEmails] = useState([]);

    const [cpass , setcpass] = useState('')

    // สำหรับการเช็คค่า email ซำ้ใน admin เเละการส่งเข้าลูปเพื่อดึงข้อมูล
    const [admin_emailcheck , setadmin_emailcheck] = useState([])
    const [emaildata , setemaildata] = useState([])

    const navigate = useNavigate();


    const handleregister =(e) =>{
        e.preventDefault();
       
        try{
            if(name == ''){
                alert("something went worng" )
                navigate("/Register")
                end();
            }else if (password == ''){
                alert("something went wrong")
                navigate("/Register")
                end();
            }else if (emails.includes(email)|| emaildata.includes(email) || email ==''){
                alert("Email went wrong")
                navigate("/Register")
                end();
            }else if (password != cpass){
                alert("password not match")
                navigate("/Register")
                end();
            }else{
                navigate("/logins")
            }
            axios.post('http://localhost:4001/users/register',{name , email , password , passwordnh})  
                
        }
        catch(error){
            console.log(error)
        }
    }
    
    const name1 =(e)=>{
        setname(e.target.value)
    }
    const email1 =(e)=>{
        setemail(e.target.value)
    }
    const password1 =(e)=>{
        setpassword(e.target.value)
        setpasswordnh(e.target.value)

    }
    const cpass1 =(e)=>{
        setcpass(e.target.value)
    }
    // console.log(password)
    // console.log(cpass)

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

      // การดึง APIs สำหรับการเช็คอีเมลของ admin
    useEffect(()=>{
        axios.get('http://localhost:4001/admin/email_admin')
        .then((response)=>{
            setadmin_emailcheck(response.data)
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
          });
    },[])
    // console.log(email_admin)

    // การลูปเอาข้อมูลใน Array
    useEffect(()=>{
        const email_admin = admin_emailcheck.map((item)=> item.adminmail);
        setemaildata(email_admin)
    },[admin_emailcheck])



      
  return (
    <div className='container'>
        <p>register</p>
        <Link to={"/Logins"}>to login</Link>
         <form >
            <p>name</p>
            <input type="text" onChange={name1} />
            <p>email</p>
            <input type="email" onChange={email1} />
            <p>password</p>
            <input type="password"  onChange={password1} />
            <p>confrimepassword</p>
            <input type="password"  onChange={cpass1} />
            <button type='submit' onClick={handleregister}>submit</button>
        </form>
    </div>
  )
}

export default Regiser