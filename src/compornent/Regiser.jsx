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
    const [datas , setdata] = useState([]);
    // const [dataemail , setdataemail] = useState([]);
    const [emails, setEmails] = useState([]);
    const [cpass , setcpass] = useState('')
    const navigate = useNavigate();


    const handleregister =(e) =>{
        e.preventDefault();
        setname('');
        setemail('');
        setpassword('');
        try{
            axios.post('http://localhost:4001/users/register',{name , email , password , passwordnh})  
            
            if(name == ''){
                alert("something went worng" )
                navigate("/Register")
            }else if (password == ''){
                alert("something went wrong")
                navigate("/Register")
            }else if (emails.includes(email) || email ==''){
                alert("Email went wrong")
                navigate("/Register")
            }else if (password != cpass){
                alert("password not match")
                navigate("/Register")
            }else{
                navigate("/Logins")
            }
                
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
    console.log(password)
    console.log(cpass)

    useEffect(()=>{
        axios.get('http://localhost:4001/users/getemail')
        .then((datas)=>{
            setdata(datas.data)
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
          });
    }, []);

    useEffect(() => {

        const emailList = datas.map((item)=> item.email);
        setEmails(emailList);
        
      }, [datas]);
      
    // useEffect(()=>{
    //     if()
    // })

   
  

  return (
    <div className='container'>
        <p>register</p>
        <Link to={"/Logins"}>to login</Link>
         <form >
            <p>name</p>
            <input type="text" value={name}  onChange={name1} />
            <p>email</p>
            <input type="email" value={email} onChange={email1} />
            <p>password</p>
            <input type="password" value={password} onChange={password1} />
            <p>confrimepassword</p>
            <input type="password"  onChange={cpass1} />
            <button type='submit' onClick={handleregister}>submit</button>
        </form>
    </div>
  )
}

export default Regiser