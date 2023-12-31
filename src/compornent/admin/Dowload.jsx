import React ,{useEffect , useState} from 'react'
import { useParams ,Link , useNavigate ,} from 'react-router-dom';
import axios from 'axios';

function Dowload() {

    const [emailUsers , setUseremail] = useState([]);
    // รับค่าจากการ login
    const {usersemail} = useParams();

    const navigate = useNavigate();

    // เขียนรหัสผ่านลงใน session storage เมื่อผู้ใช้เข้าสู่ระบบ
    


    const fechdata = async()=>{   
        const ressponse =  axios.get(`http://localhost:4001/users/dataUsers/${usersemail}`);
        setUseremail((await ressponse).data)
    }

    console.log(emailUsers)
    console.log(usersemail)

    useEffect (()=>{
        fechdata();
    }, []);

    const user = emailUsers._id
    
    useEffect(()=>{
        if(user){
            // navigate('/Dashbord/' + user)
            // navigate(`/Deshbord?data=${sessionStorage.getItem(user)}`)
            navigate('/Dashbord', {state:{user}})    
        }
    },[user]);



  return (
    <div>
        <h1>{usersemail}</h1>
    </div>
  )
}

export default Dowload