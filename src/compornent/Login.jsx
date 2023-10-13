// import React, { useEffect } from 'react'
// import { useState  } from 'react'
// import axios from 'axios';
// import '../css/logins.css'
// import { useNavigate , redirect, Link  } from 'react-router-dom';

// function Logins() {
   
//     const [email , setemail] = useState('');
//     const [password , setpassword] = useState();
//     const [usersdata , setuserdata] = useState([]);
//     const [passworddata , setpassworddata] = useState([]);
//     const [emaildata , setemaildata ] = useState([]);
//     const [IDdata ,setIDdata] = useState([]);
//     const [shouldRedirect, setShouldRedirect] = useState(false);

//     // สำหรับการเช็คค่า email ซำ้ใน admin เเละการส่งเข้าลูปเพื่อดึงข้อมูล
//     const [admin_emailcheck , setadmin_emailcheck] = useState([])
//     const [email_data , setemail_data] = useState([])
//     const [password_data , setpassword_data] =useState([])

//     const navigate = useNavigate();
    
//     const handleLogin =() =>{
//         if(email_data.includes(email) && password_data.includes(password)){
//             alert('welcom admin')
//             const admin = email
//             navigate('/Download_ad/'+ admin)   
//         }
//         else if(!emaildata.includes(email) ){
//             alert('Loginerror')
//             navigate('/Logins')
         
//         }
//         else if(!passworddata.includes(password) ){
//             alert('somtingwentwrong')
//             navigate('/Logins')
         
//         }
//         else {
//             alert("success")
//             const users = email
//             // navigate("/Dashbord/" + users )
//             navigate('/Dowload/'+ users)
             
//         }
        
//         axios.post('http://localhost:4001/users/login',{ email ,password})
//         .then((response)=>{
//             console.log(response)
            
//         })
            
//     }       
    
//     useEffect(()=>{
//         axios.get('http://localhost:4001/users/getUsers').then((users)=>{
//             setuserdata(users.data)
//         })
//         .catch((error)=>{
//             console.log(error)
//         })
//     },[]);
    
//     useEffect(()=>{
//         const userdata = usersdata.map((item)=> item.passNhash)
//         setpassworddata(userdata)
//     },[usersdata]);

//     useEffect(()=>{
//         const Emailuserdata = usersdata.map((itememail)=> itememail.useremail)
//         setemaildata(Emailuserdata)
//         setShouldRedirect(true)
//     },[usersdata])

//     console.log(emaildata)

//     useEffect(()=>{
//         const IDuserdata = usersdata.map((itememail)=> itememail._id)
//         setIDdata(IDuserdata)
//     },[usersdata])
    
//     // การดึง APIs สำหรับการเช็คอีเมลของ admin
//     useEffect(()=>{
//         axios.get('http://localhost:4001/admin/email_admin')
//         .then((response)=>{
//             setadmin_emailcheck(response.data)
//         })
//         .catch((error) => {
//             console.error('Error fetching data:', error);
//             });
//     },[])
//     console.log(admin_emailcheck)
    
//     // การลูปเอาข้อมูลใน Array
//     useEffect(()=>{
//         const email_admin = admin_emailcheck.map((item)=> item.adminmail);
//         const password_admin = admin_emailcheck.map((itempassword)=> itempassword.password)
//         setemail_data(email_admin)
//         setpassword_data(password_admin)

//     },[admin_emailcheck])

//     // console.log(email_data)
//     // console.log(password_data)


//   return (
//     <div className='login'>
//         <form >
//             <p>email</p>
//             <input type="email" onChange={(e) => setemail(e.target.value)} />
//             <p>password</p>
//             <input type="password" onChange={(e) => setpassword(e.target.value)} />
//             <button type='submit' onClick={handleLogin}>submit</button>
//             <p>สมัครสมาชิก <Link to={'/Register'}>Regiser</Link></p>
//         </form>
//         <Link to={'/Register_ad'}>admin</Link>
//         {/* <Link to={'/Download_ad'}>add</Link> */}
//     </div>
//   )
// }

// export default Logins