import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../css/iconprofile.css'


function Iconprofile(props) {
    const { IDuser } = props.IDuser
    const navigate = useNavigate();

    const [namenotnever, setNameNotNaver] = useState([]);
    const [data, setData] = useState([])
    const [profile, setprofile] = useState([])

    // ดึงชื่อมาเซ็ทตั้งไว้กรณีที่ไม่มีชื่อในการใส่ภาพ
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:4001/users/datadetail/${IDuser}`);
                const data = response.data;
                setNameNotNaver(data)
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    // ดึงข้อมูลที่ได้รับมาจาก api ที่ทำการจอยมาโดยเทียบกับข้อมูล UserId
    useEffect(() => {
        axios.get(`http://localhost:4001/profile/getimage/${IDuser}`)
            .then((res) => {
                if (res.data.data && res.data.data.length > 0) {
                    const profileInfoss = res.data.data.map(result => {
                        return result;
                    });
                    setData(profileInfoss);

                } else {
                    console.log("No user profile data found.");
                }
            }).catch((err) => {
                console.log(err)
            })

    }, [])


    const [a, b] = useState([])

    // เก็บอาเรย์ของจำนวนรูปภาพ
    useEffect(() => {
        b([namenotnever.selectorsimg] || [profiledata.selectorsimg])
    }, [namenotnever])

    useEffect(() => {
        const images = data.map((res) => res.image)
        setprofile(images);
    }, [data])

    const [nameusers , set_nameuser] = useState([])

    useEffect(()=>{
        const nameuser = data.map((res) => res.users)
        const concatenatedNames = [].concat(...nameuser);
        const nameprofile = concatenatedNames.map((result)=>result.name)
        set_nameuser(nameprofile)

    },[data])

    const handletoprofile = ()=>{
        navigate('/Profile', { state: { IDuser } })
    }
    return (
        <div className='icon-profile'>
            <p>{nameusers[nameusers.length + a[0]]}</p>
            <img  onClick={handletoprofile} src={`../images/${profile[profile.length + a[0]] || profile[profile.length - 1]}`}/>
        </div>
    )
}

export default Iconprofile