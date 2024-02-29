import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import '../css/profile.css'

function Profile() {
    const location = useLocation();
    const navigate = useNavigate();

    const UserId = location.state?.IDuser
    // const { UserId } = useParams();
    const [image, setimage] = useState();
    const [data, setdata] = useState([])
    const [valuea, setvaluea] = useState([])

    const [userprs, set_userpr] = useState([]);
    const [profiledata, setprofiledata] = useState([]);

    const [namenotnever, setNameNotNaver] = useState([]);

    const [timedata, set_timedata] = useState([]);

    // const [description , set_description] = useState('');
    const IDuser = UserId
    const id = UserId

    const [profile, setProfile] = useState([]);
    const [selectedsImage, setSelectedImage] = useState(null);

    // เลือกรูปภาพที่ต้องการเเสดง
    const [a, b] = useState([])
    const [count, set_count] = useState([0])

    //  รับค่าจาก input ที่เป็นรุปภาพเเล้วเเสดงร๔ปภาพที่เลือก
    const handleimage = (e) => {
        const selectedImage = e.target.files[0];

        if (selectedImage) {
            const render = new FileReader();
            render.onload = function (event) {
                setSelectedImage(event.target.result)
            }
            render.readAsDataURL(selectedImage);
        }
        setimage(selectedImage);
    }

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

    // ส่งข้อมูลทั้งหมดไปใน shema
    const onsubmit = async () => {
        if (image) {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('IDuser', IDuser)
            try {
                const response = await axios.post('http://localhost:4001/profile/Profile_post', formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                resetprofile();
                update(formData);
                console.log('Image uploaded successfully:', response.data);

            } catch (error) {
                console.error('Error uploading image:', error);
            }
        } else {
            console.log("Not image")
        }
    }

    const update = async (formData) => {
        try {
            const responses = await axios.put('http://localhost:4001/users/userProfile_post', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            console.log('Image uploaded successfully:', responses.data);
        } catch (err) {
            console.log(err)
        }
    }

    //reset new profile
    const resetprofile = () => {
        axios.put('http://localhost:4001/users/resetprofile', { IDuser })
            .then((res) => {
                console.log(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }

    // ดึงข้อมูลที่ได้รับมาจาก api ที่ทำการจอยมาโดยเทียบกับข้อมูล UserId
    useEffect(() => {
        axios.get(`http://localhost:4001/profile/getimage/${UserId}`)
            .then((res) => {
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
            }).catch((err) => {
                console.log(err)
            })

    }, [])

    // การลูปเอา data มาเเสดงผลโดยเก็บไว้ใน data
    useEffect(() => {
        const imagejoin = profile.map((result) => result.image)
        const timebooking = profile.map((time) => time.time)


        setdata(imagejoin)
        set_timedata(timebooking)
    }, [profile]);

    //console.log(timedata)
    useEffect(() => {
        if (profile && profile.length > 0) {
            const userpf = profile.map((userProfile) => userProfile.users)
            set_userpr(userpf)
            if (userprs && userprs.length > 0) {
                const userProfileData = userpf.map((userProfile) => userProfile[0]);
                // console.log(userProfileData[userProfileData.length - 1]);
                setprofiledata(userProfileData[userProfileData.length - 1])
            }
        }
    }, [profile]);


    //ดึงข้อมูลชื่อมาเก็บ
    const names = namenotnever.name || profiledata.name
    const emails = namenotnever.email || profiledata.email

    // ระบบการเปลี่ยนชื่อเเละอีเมลล์
    const editprofile = (id, names, emails) => {
        Swal.fire({
            title: 'ระบุข้อมูลที่ต้องการแก้ไข',
            html:
                `<input id="swal-input1" value="${names}" class="swal2-input" placeholder="Username">` +
                `<input id="swal-input2" value="${emails}" class="swal2-input" placeholder="Email">`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            preConfirm: () => {
                const validatename = Swal.getPopup().querySelector('#swal-input1').value;
                const validateemail = Swal.getPopup().querySelector('#swal-input2').value;
                updatedata(id, validatename, validateemail);
            },
        }).then((res) => {
            if (res.isConfirmed === true) {
                Swal.fire({
                    timer: '30000',
                    icon: 'success',
                    text: "แก้ไขข้อมูลเรียบร้อย",
                    confirmButtonText: 'OK'
                }).then((success) => {
                    if (success.isConfirmed === true) {
                        window.location.reload();
                    }
                })
            }
        })
    };

    // อัพเดตชื่อหรืออีเมลล​์
    const updatedata = (id, validatename, validateemail) => {
        console.log({ id, validatename, validateemail });
        axios.put('http://localhost:4001/users/updatedata', { id, validatename, validateemail })
            .then((updateres) => {
                console.log(updateres)
            }).catch((err) => {
                console.log(err)
            })
    };

    const incount = () => {
        if (count[0] > -1) {
            alert("ไม่มีข้อมูลรูปภาพ")
        } else {
            set_count([count[0] + 1])
        }
    }
    const outcount = () => {
        set_count([count[0] - 1])
    }

    // เลือกรูปภาพด้วยการส่งข้อมูลรูปภาพที่ต้องการเลือกไปเลือก
    const addimg = () => {
        const numberValue = parseInt(count[0], 10);
        axios.put('http://localhost:4001/users/changprofile', { IDuser, numberValue }).
            then((response) => {
                console.log(response)
            }).catch((error) => {
                console.log(error)
            })
    }

    // เก็บอาเรย์ของจำนวนรูปภาพ
    useEffect(() => {
        set_count([namenotnever.selectorsimg] || [profiledata.selectorsimg])
        b([namenotnever.selectorsimg] || [profiledata.selectorsimg])
    }, [namenotnever])



    const [popuprofile, set_popupprofile] = useState(false)

    const [checkstore, set_chekstore] = useState('')

    // ระบบดึงหน้าร้านค้า
    useEffect(() => {
        axios.get(`http://localhost:4001/store/getstore/${IDuser}`)
            .then((res) => {
                set_chekstore(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }, []);

    const tomystore = (IDstores) => {
        navigate('/Store', { state: { IDstores } })
    }

    const createstore =()=>{
        navigate('/Pdpa', {state:{IDuser}});
    }

    return (
        <div className=''>
            <div className={`profilepopup ${popuprofile ? 'visible' : ''}`}>
                <div className="itemprofile">
                    <button onClick={() => set_popupprofile(false)}>close</button>
                    <div className='content-popup'>
                        <img src={selectedsImage || `../images/${data[data.length + count[0]]}`} width={150} height={150} />
                        <div className="buttonprofile">
                            <button type="button" onClick={outcount} >ลบ</button>
                            <button type="button" onClick={incount}>เพิ่ม</button>
                            <button type="button" onClick={addimg}>add</button>
                            <input type="file" name="" id="" onChange={handleimage} />
                            <button type='submit' onClick={onsubmit} >upload profile</button>
                        </div>
                    </div>
                </div>

            </div>
            <div className='profile'>

                {data.length == 0 ? (
                    <img src="../public/images/1.png" width={150} height={150} />
                ) : (
                    <>
                        <img src={`../images/${data[data.length + a[0]] || data[data.length - 1]}`} width={150} height={150} />
                    </>
                )}
                {/* // เซ็ทชื่อให้เข้ากับ ภาพ */}
                <div className=''>
                    <div className=''>
                        <p>name:{names}</p>
                    </div>
                    <div>
                        <p>email:{emails}</p>
                    </div>
                </div>
                <button onClick={() => set_popupprofile(true)} >แก้ไขโปรไฟล์</button>

            </div>
            <p>edit profile</p>
            <div className=''>
                <button onClick={() => editprofile(id, names, emails)}>แก้ไข</button>
            </div>
            <div className=''>
                {checkstore == null ? (
                    <div className=''>
                        {/* <Link to={'/Incrud/' + IDuser}>สร้างร้านค้า</Link> */}
                        <button onClick={createstore}>create-store</button>
                    </div>
                ) : (
                    <div className=''>
                        <button onClick={() => tomystore(checkstore._id)} >ร้านค้าของคุณ</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile