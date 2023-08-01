import React ,{useEffect , useState} from 'react'
import { useParams ,Link } from 'react-router-dom';
import axios from 'axios';


function Dashbord() {
    const [data_user , setdata_user] = useState([])
    const {IDuser} = useParams();
  

    const fechdata = async()=>{
        const ressponse =  axios.get(`http://localhost:4001/users/datadetail/${IDuser}`);
        setdata_user((await ressponse).data)
    }
    useEffect (()=>{
        fechdata();
    }, []);
    console.log(data_user)

    const hadlepopup = () =>{
        console.log(data_user._id)
    }

    
    

  return (
    <div className='container'>
        <h1>Dashbord</h1>
        <h1>{IDuser}</h1>
        <div className='title'>
            <div className='boxuser'>
                <div className='profile'>
                   <p onMouseEnter={hadlepopup}>{data_user.name}</p>
                   <p>{data_user.email}</p>
                   <Link to={'/Book_car'} >link</Link>
                </div>
            </div>
        </div>

    </div>
  )
}

export default Dashbord