import React ,{useEffect , useState} from 'react'
import { useParams ,Link } from 'react-router-dom';
import axios from 'axios';
import fs from 'fs';
import Book_car from './Book_car';

function Profile() {

    const {UserId} = useParams();
    const [image , setimage] = useState();
    const [data , setdata] = useState([])
    const [valuea , setvaluea] = useState([])

    const [userprs , set_userpr] = useState([]);
    const [profiledata , setprofiledata] = useState([]);

    const [namenotnever ,setNameNotNaver] = useState([]);

    const [timedata , set_timedata] = useState([]);
    
    // const [description , set_description] = useState('');
    const IDuser = UserId
    const getID = UserId

    const [profile, setProfile] = useState([]);

    //  รับค่าจาก input ที่เป็นรุปภาพ
    const handleimage = (e) => {
        const selectedImage = e.target.files[0];
        setimage(selectedImage);
        const imgedata = selectedImage.name
        // console.log(imgedata)
    }

    // ดึงชื่อมาเซ็ทตั้งไว้กรณีที่ไม่มีชื่อในการใส่ภาพ
    useEffect(()=>{
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
    },[]);
    // console.log(namenotnever)

    // console.log(image)
// ส่งข้อมูลทั้งหมดไปใน shema
    const onsubmit = async()=>{
        if (image) {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('IDuser', IDuser)
            try{
                const response = await axios.post('http://localhost:4001/profile/Profile_post',  formData,{
                    headers: {"Content-Type": "multipart/form-data"}
                });
                update(formData);
                console.log('Image uploaded successfully:', response.data);

            } catch (error) {
                console.error('Error uploading image:', error);
              }
        } else{
            console.log("Not image")
        }
    }

    const update = async(formData)=>{
        try{
            const responses = await axios.put('http://localhost:4001/users/userProfile_post',  formData,{
                headers: {"Content-Type": "multipart/form-data"}
            });
            console.log('Image uploaded successfully:', responses.data);
        } catch(err){
            console.log(err)
        }
    }


    // ดึงข้อมูลที่ได้รับมาจาก api ที่ทำการจอยมาโดยเทียบกับข้อมูล UserId
   useEffect(()=>{
        axios.get(`http://localhost:4001/profile/getimage/${UserId}`)
        .then((res)=>{
            // console.log(res.data.data)
            setvaluea(res.data.data)
           
            if (res.data.data && res.data.data.length > 0) {
                const profileInfoss = res.data.data.map(result => {
                    return result;
                });
                setProfile(profileInfoss);
                
            } else {
                console.log("No user profile data found.");
            }
        }).catch((err)=>{
            console.log(err)
        })
       
   },[])

//    console.log(profile)

// การลูปเอา data มาเเสดงผลโดยเก็บไว้ใน data
   useEffect(()=>{
        const imagejoin = profile.map((result)=> result.image)
        const timebooking = profile.map((time)=> time.time)
        console.log(timebooking)
        setdata(imagejoin)
        set_timedata(timebooking)


   },[profile]);

//console.log(timedata)
   useEffect(()=>{
        if(profile && profile.length > 0){
            const userpf = profile.map((userProfile)=> userProfile.users)
            console.log(userpf)
            set_userpr(userpf)
            if(userprs && userprs.length > 0){
                const userProfileData = userpf.map((userProfile) => userProfile[0]);
                console.log(userProfileData[userProfileData.length - 1]);
                setprofiledata(userProfileData[userProfileData.length - 1])
            }
        }
   },[profile]);

//  console.log(profiledata)  
//    console.log(data)
//    console.log(userprs)



  return (
    <div>
         <div className='profile'>
            
            {data.length == 0 ?(
                <img src="../public/images/1.png" width={150} height={150} />
            ):(
                <img src={`../images/${data[data.length - 1]}`} width={150} height={150} />
            )}

            {/* // เซ็ทชื่อให้เข้ากับ ภาพ */}
            {profiledata.length == 0 ?(
                <>    
                    <p>Name: {namenotnever.name}</p>
                    <p>Email: {namenotnever.email}</p>
                </>
            ):(
                <>
                    <p>Name: {profiledata.name}</p>
                    <p>Email: {profiledata.email}</p>
                    
                </>
                
            )}     
            <input type="file" name="" id="" onChange={handleimage} />
            <button type='submit' onClick={onsubmit} >upload profile</button>
        </div>
    </div>
  )
}

export default Profile