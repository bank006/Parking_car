import React, { useEffect } from 'react'
import { useState  } from 'react'
import axios from 'axios';
import '../css/logins.css'
import { useNavigate , redirect, Link  } from 'react-router-dom';

function Logins() {
   
    const [email , setemail] = useState('');
    const [password , setpassword] = useState();
    const [usersdata , setuserdata] = useState([]);
    const [passworddata , setpassworddata] = useState([]);
    const [emaildata , setemaildata ] = useState([]);
    const [IDdata ,setIDdata] = useState([]);
    const [res , setres] =useState([])
    const [shouldRedirect, setShouldRedirect] = useState(false);

    const navigate = useNavigate();
    
    const handleLogin =() =>{
        if(!emaildata.includes(email)){
            alert('Loginerror')
            navigate('/Logins')
        }
        else if(!passworddata.includes(password)){
            alert('somtingwentwrong')
            navigate('/Logins')
        }
        else {
            alert("success")
            const users = email
            // navigate("/Dashbord/" + users )
            navigate('/Dowload/'+ users)
             
        }
        
        axios.post('http://localhost:4001/users/login',{ email ,password})
        .then((response)=>{
            console.log(response)
            
        })
            
    }       
    
    useEffect(()=>{
        axios.get('http://localhost:4001/users/getUsers').then((users)=>{
            setuserdata(users.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    },[]);
    
    useEffect(()=>{
        const userdata = usersdata.map((item)=> item.passNhash)
        setpassworddata(userdata)

    },[usersdata]);

    useEffect(()=>{
        const Emailuserdata = usersdata.map((itememail)=> itememail.useremail)
        setemaildata(Emailuserdata)
        setShouldRedirect(true)
    },[usersdata])

    useEffect(()=>{
        const IDuserdata = usersdata.map((itememail)=> itememail._id)
        setIDdata(IDuserdata)
    },[usersdata])


    useEffect(()=>{
        axios.get('http://localhost:4001/users').then((usersdata)=>{
            setres(usersdata.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    },[]);
    
  return (
    <div className='login'>
        <form >
            <p>email</p>
            <input type="email" onChange={(e) => setemail(e.target.value)} />
            <p>password</p>
            <input type="password" onChange={(e) => setpassword(e.target.value)} />
            <button type='submit' onClick={handleLogin}>submit</button>
            <p>สมัครสมาชิก <Link to={'/Register'}>Regiser</Link></p>
        </form>
        <Link to={'/Dashbord_ad'}>admin</Link>
    </div>
  )
}

export default Logins