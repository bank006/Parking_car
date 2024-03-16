import React from 'react'
import { useNavigate, useParams, useLocation, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import './css/store.css'
import Income from './income';
import Incomeperday from './incomeperday';

function Store() {

    //รับค่า props
    const location = useLocation();
    const navigate = useNavigate();
    const IDstore = location.state?.IDstores

    const [loginstore, set_loginstore] = useState([]);

    //push data
    const [imageProduct, set_imageproduct] = useState();
    const [nameProduct, set_nameproduct] = useState('');
    const [priceProduct, set_priceProduct] = useState('')
    const [descriptionProduct, set_descriptionProduct] = useState('')
    const [quantityInStock, set_quantityInStock] = useState('')
    const [quantityInStockrel, set_quantityInStockrel] = useState('')

    const [latitude, set_latitude] = useState('')
    const [longitude, set_longitude] = useState('')

    const [myproduct, set_myproduct] = useState(true)
    const [mybookingproduct, set_mybookingproduct] = useState(false)

    const [dataproduct, set_dataproduct] = useState([]);

    const [showpopup, set_showpopup] = useState(false)

    const [selectedImage, setSelectedImage] = useState(null);

    const handleimagesproduct = (e) => {
        set_imageproduct(e.target.files[0])

        const image = e.target.files[0];
        setSelectedImage(URL.createObjectURL(image));
    }

    const handlenameproduct = (e) => {
        set_nameproduct(e.target.value)
    }

    const handleprice = (e) => {
        set_priceProduct(e.target.value)
    }

    const handledescrip = (e) => {
        set_descriptionProduct(e.target.value)
    }

    const handlequantity = (e) => {
        set_quantityInStock(e.target.value)
        set_quantityInStockrel(e.target.value)
    }

    const numberOfRounds = quantityInStock; // จำนวนรอบที่ต้องการบันทึก
    const nameToSave = 'A'; // ชื่อที่ต้องการบันทึก

    const [save, set_save] = useState({})
    const saves = async () => {
        let newData = {};

        for (let i = 0; i < numberOfRounds; i++) {
            const dataToSave = {
                IDstore: IDstore,
                imageProduct: imageProduct,
                nameProduct: nameProduct,
                priceProduct: priceProduct,
                descriptionProduct: descriptionProduct,
                quantityInStock: quantityInStock,
                quantityInStockrel: quantityInStockrel,
                latitude: latitude,
                longitude: longitude,
                round: i + 1 + "-A",
            };
            newData = { ...newData, [i]: dataToSave }; // เก็บข้อมูลในตัวแปรใหม่เพื่อเก็บข้อมูลของทุกรอบ
        }

        axios.post('http://localhost:4001/product/postproduct', { newData })
            .then((tests) => {
                console.log("Successfully Save Data");
            }).catch((err) => {
                alert("Error : " + err);
            })

        // const formdata = new FormData();
        // Object.values(newData).forEach((dataToSave) => {
        //     Object.entries(dataToSave).forEach(([key, value]) => {
        //         formdata.append(key, value);
        //     });
        // });

        // console.log([...formdata.entries()])

        // try {
        //     const resproduct = await axios.post('http://localhost:4001/product/postproduct', formdata, {
        //         headers: { 'Content-Type': 'multipart/form-data' }
        //     });
        //     console.log('uploaded successfully:', resproduct.data);
        //     // หลังจากอัปโหลดเสร็จแล้วทำอย่างไรต่อ หรือโหลดหน้าใหม่ เปิดหน้าใหม่ หรือใช้การนำทางไปหน้าอื่น
        // } catch (error) {
        //     console.log('Error upload data to store', error);
        // }
    };

    // push data to schema
    const onsubmitproduct = async () => {
        if (imageProduct) {
            const formdataproduct = new FormData();
            formdataproduct.append('IDstore', IDstore);
            formdataproduct.append('imageProduct', imageProduct);
            formdataproduct.append('nameProduct', nameProduct);
            formdataproduct.append('priceProduct', priceProduct);
            formdataproduct.append('descriptionProduct', descriptionProduct);
            formdataproduct.append('quantityInStock', quantityInStock);
            formdataproduct.append('quantityInStockrel', quantityInStockrel)
            formdataproduct.append('latitude', latitude);
            formdataproduct.append('longitude', longitude);
            try {
                const resproduct = await axios.post('http://localhost:4001/product/postproduct', formdataproduct, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                console.log('uploaded successfully:', resproduct.data)
                //    window.location.href = '/Store/' + IDstore;
                //    navigate('Dashbord' {state:{}})
                window.location.reload();
            } catch (error) {
                console.log('Error upload data to store', error)
            }
        }
    }


    //สำหรับการหา latitude longitude ไว้าำหรับการปักหมุดบนแผนที่
    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                setLocationInfo("Geolocation is not supported by this browser.");
            }
        };
        const showPosition = (position) => {
            set_latitude(position.coords.latitude)
            set_longitude(position.coords.longitude)

        };

        getLocation();
    }, []);

    //เช็คการสมัคร
    const [user, setuser] = useState([])
    useEffect(() => {
        axios.get(`http://localhost:4001/store/loginstore/${IDstore}`)
            .then((res) => {
                setuser(res.data.IDuser)
                set_loginstore(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }, []);

    const [allincome, setallincome] = useState([]);
    // รายได้ทั้งหมดของร้าน
    useEffect(() => {
        axios.get(`http://localhost:4001/income/allincome/${IDstore}`)
            .then((res) => {
                setallincome(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }, [])

    // สินค้าของร้าน
    useEffect(() => {
        axios.get(`http://localhost:4001/product/getproduct/${IDstore}`)
            .then((respro) => {
                if (!respro) {
                    console.log('error')
                }
                else {
                    // console.log(respro.data)
                    set_dataproduct(respro.data)
                }
            }).catch((error) => {
                console.log(error)
            })

    }, [])

    // console.log(dataproduct)

    const handlemyproduct = () => {
        if (myproduct) {
            set_myproduct(false)
        }
        else {
            set_myproduct(true)
            set_mybookingproduct(false)
        }
    }

    const handlemybookingproduct = () => {
        if (mybookingproduct) {
            set_mybookingproduct(false)
        }
        else {
            set_mybookingproduct(true)
            set_myproduct(false)
        }
    }

    // หน้าแก้ไข้สินค้า
    const calledit = (IDproduct, nameproduc, imgproduct, quantityInStockrel) => {
        Swal.fire({
            title: 'แก้ไขสินค้า',
            html: `
                <img id="product-image" src="../imageproduct/${imgproduct}" class="swal2-image" style="width: 100%;" alt="Product Image">
                <p>แก้ไขรูปสินค้า : </p><input type="file" id="swal-input1" class="swal2-input">
                <p>ชื่อสินค้า : </p><input id="swal-input2" value="${nameproduc}" class="swal2-input">
                <p>จำนวนสินค้า : </p><input id="swal-input3" value="${quantityInStockrel !== null ? quantityInStockrel : ''}" class="swal2-input">
            `,
            confirmButtonText: 'ยืนยัน',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
            preConfirm: () => {
                const imgInput = document.getElementById('swal-input1');
                const newImage = imgInput.files[0];
                const validateproductname = Swal.getPopup().querySelector('#swal-input2').value;
                const validatequantity = Swal.getPopup().querySelector('#swal-input3').value;


                if (newImage) {
                    if (validatequantity.length !== 0) {
                        updateproduct(IDproduct, newImage, validateproductname, validatequantity, nameproduc, imgproduct, quantityInStockrel);
                    } else {
                        Swal.fire({
                            title: 'กรุณากรอกจำนวนสินค้า',
                            icon: 'warning',
                            // showCancelButton: true,
                            cancelButtonText: 'ok',
                        })
                    }

                } else {
                    if (validatequantity.length !== 0) {
                        //กรณีไม่อัพรูป
                        Swal.fire({
                            timer: '30000',
                            html: `
                        <img id="product-images" src="../imageproduct/${imgproduct}" class="swal2-image" style="width: 100%;" alt="Product Image">
                        <p>ชื่อสินค้า : </p><input id="swal-input2" value="${validateproductname || nameproduc}" class="swal2-input">
                        <p>จำนวนสินค้า : </p><input id="swal-input3" value="${validatequantity || quantityInStockrel}" class="swal2-input">
                        `,
                            icon: 'question',
                            text: "ต้องการยืนยันข้อมูลการอัพเดตไหม",
                            confirmButtonText: 'OK'
                        }).then((success) => {
                            const namepr = validateproductname || nameproduc
                            const qtypr = validatequantity || quantityInStockrel
                            if (success.isConfirmed === true) {
                                updateprnonimg(IDproduct, namepr, qtypr)
                            }
                        });

                    } else {
                        Swal.fire({
                            title: 'กรุณากรอกจำนวนสินค้า',
                            icon: 'warning',
                            // showCancelButton: true,
                            cancelButtonText: 'ok',
                        })
                    }

                }
            }
        })
    };

    // ทำให้รุปอยุ่ในรูปแบบไฟล์
    const updateproduct = (IDproduct, newImage, validateproductname, validatequantity, nameproduc, imgproduct, quantityInStockrel) => {
        if (newImage) {
            const render = new FileReader();
            render.onload = function (event) {
                shownewdata(IDproduct, newImage, event.target.result, validateproductname, validatequantity, nameproduc, imgproduct, quantityInStockrel)
            }
            render.readAsDataURL(newImage)
        }
    }

    // อัพเดตข้อมูลในกรณีไม่เปลี่ยนภาพ
    const updateprnonimg = (IDproduct, namepr, qtypr) => {
        console.log({ IDproduct, namepr, qtypr })
        axios.put('http://localhost:4001/product/nonimg', { IDproduct, namepr, qtypr })
            .then((res) => {
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })
    }

    // อัพเดตกรณีมีรูป
    const shownewdata = (IDproduct, newImage, newimg, validateproductname, validatequantity, nameproduc, imgproduct, quantityInStockrel) => {
        const namepr = validateproductname || nameproduc
        const qtypr = validatequantity || quantityInStockrel
        Swal.fire({
            timer: '30000',
            html: `
            <img id="product-images" src="${newimg} " class="swal2-image" style="width: 100%;" alt="Product Image">
            <p class="">ชื่อสินค้า : </p><input id="swal-input2" value="${namepr}" class="swal2-input">
            <p>จำนวนสินค้า : </p><input id="swal-input3" value="${qtypr}" class="swal2-input">
            `,
            icon: 'question',
            title: "ต้องการยืนยันการแก้ไขข้อมูลไหม",
            confirmButtonText: 'OK'
        }).then(async (success) => {
            if (success.isConfirmed === true) {
                const formData = new FormData();
                formData.append('IDproduct', IDproduct);
                formData.append('newImage', newImage); // ให้ newImage เป็นค่าที่ถูกส่งมาจาก client
                formData.append('namepr', namepr);
                formData.append('qtypr', qtypr);
                try {
                    const response = await axios.put('http://localhost:4001/product/updateproduct', formData, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });

                    console.log(response.data);
                    // window.location.reload();
                } catch (error) {
                    console.log(error);
                }
            }

        });
    }

    // หน้ายืนยันการลบ
    const calldelete = (IDproduct) => {
        Swal.fire({
            title: 'คุณต้องการลบสินค้าชิ้นนี้ใช้ไหม',
            showDenyButton: true,
            icon: 'question',
            // showCancelButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            customClass: {
                actions: 'my-actions',
                // cancelButton: 'order-1 right-gap',
                confirmButton: 'order-2',
                denyButton: 'order-3',
            },
        }).then((res) => {
            if (res.isConfirmed) {

                Swal.fire({
                    title: 'ดำเนินการเสร็จสมบูรณ์',
                    text: 'ข้อมูลได้รับการบันทึกเรียบร้อย',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then((success) => {
                    if (success.isConfirmed) {
                        checkactive(IDproduct);
                    }
                }).catch((err) => {
                    console.log(err)
                })

            } else {
                console.log('err')
            }
        }).catch((errs) => {
            console.log(errs)
        })
    }

    //  เช็คว่าสินค้ามีการใช้งานอยุ่ไหม
    const checkactive = (IDproduct) => {
        axios.get(`http://localhost:4001/bookingcon/findbooking/${IDproduct}`)
            .then((restime) => {
                if (restime.data.length === 0) {
                    deleteproduct(IDproduct);
                } else {
                    errordete();
                    // console.log("ยังมีการใช้งานไม่สามารถลบได้ในขณะนี้")
                }
            }).catch((err) => {
                console.log(err)
            })
    }

    // เรียกใช้ เมื่อมีการใช้งานอยุ่เเล้วต้องการลบ
    const errordete = () => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...product is active',
            text: 'You can try the next time',
            confirmButtonText: 'OK'
        })
    }

    // ลบสินค้าได้หากไม่มีการใช้งาน
    const deleteproduct = (IDproduct) => {
        // console.log(IDproduct)
        axios.delete(`http://localhost:4001/product/deleteproduct/${IDproduct}`)
            .then((res) => {
                console.log("ลบข้อมูล", res)
            }).catch((err) => {
                console.log(err)
            })

        axios.delete(`http://localhost:4001/bookinghis/deletebookinghis/${IDproduct}`)
            .then((res) => {
                console.log("ลบข้อมูล", res)
            }).catch((err) => {
                console.log(err)
            })
    }

    // ประวัติการจองทั้งหมด

    const [historybooking, set_historybooking] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:4001/bookinghis/history/${IDstore}`)
            .then((res) => {
                set_historybooking(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }, []);

    const openchatsystem = () => {
        axios.post('http://localhost:4001/storechat/storechatpost', { IDstore })
            .then((chatstore) => {
                window.location.reload();
            }).catch((err) => {
                console.log(err)
            })
    }

    const [IDstorechat, set_IDstorechat] = useState([])
    useEffect(() => {
        const storeregis = IDstore
        axios.get(`http://localhost:4001/storechat/getstorebyid/${storeregis}`)
            .then((result) => {
                // set_IDstorechat(result.data)
                const data = result.data
                const getIDchat = data.map((Id) => Id._id)
                set_IDstorechat(getIDchat)
            }).catch((err) => {
                console.log(err)
            })

    }, [IDstore])

    const navigatetochat = (IDstores) => {
        navigate('/Userboxstore', { state: { IDstores } })
    }

    const [showupload, setshowupload] = useState('none')
    const [showgrap, set_showgrap] = useState('')

    const handlesetshow = () => {
        setshowupload('');
        set_showgrap('none');
        if (showgrap === 'none') {
            setshowupload('none');
            set_showgrap('');
        }
    }

    const openabouthistory = (nameuser, nameproduct, priceproduct, hour, amoutperminute) => {
        const a = 'สวัสดี'
        Swal.fire({
            title: "ข้อมูลเพิ่มเติม",
            html: `<div>
                    <p>ชื่อผู้ซื้อ ${nameuser}</p>
                    <p>ชื่อสินค้า ${nameproduct}</p>
                    <p>ราคาสินค้า ${priceproduct}</p>
                    <p>เวลาที่ใช้บริการ ${hour} ชั่วโมง</p>
                    <p>${amoutperminute}บาท</p>
                </div>`,
            confirmButtonText: 'ปิด'
        })
    }
    return (
        <div className='store'>
            <div className="title-store">
                <div className="title-admin-store">
                    <p>การจัดการสินค้า</p>
                </div>
                <div className="titlename-store">
                    <p>{loginstore.nameStore}</p>
                    {IDstorechat.length === 0 ? (
                        <div className=''>
                            <button style={{ background: 'none', backgroundColor: "#E89A05", border: 'none', margin: '10px', padding: '10px', cursor: 'pointer' }} onClick={openchatsystem} >เปิดใช้บริการ chat</button>
                        </div>
                    ) :
                        <div className=''>
                            <button style={{ background: 'none', backgroundColor: "#E89A05", border: 'none', margin: '10px', padding: '10px', cursor: 'pointer' }} onClick={() => navigatetochat(IDstore)}>พูดคุย</button>
                        </div>
                    }
                    {showupload === '' ? (
                        <button style={{ background: 'none', backgroundColor: "#E89A05", border: 'none', margin: '10px', padding: '10px', cursor: 'pointer' }} onClick={handlesetshow}>ปิด</button>
                    ) :
                        <>
                            <button style={{ background: 'none', backgroundColor: "#E89A05", border: 'none', margin: '10px', padding: '10px', cursor: 'pointer' }} onClick={handlesetshow}>เพิ่มสินค้า</button>
                        </>
                    }
                </div>
            </div>
            {/* <button onClick={() => navigate('/Dashbord', { state: { user } })}>back</button> */}
            <div style={{ display: showgrap }} className='container-static'>
                <div className='income-of-month'>
                    <Income IDstore={{ IDstore: IDstore }} />
                </div>
                <div className='income-of-day'>
                    <Incomeperday IDstore={{ IDstore: IDstore }} />
                </div>
                <div className='container-view'>
                    <div className='item-view'>
                        <div className='view'>
                            <p>จำนวนการเข้าชม</p>
                            <h1>{loginstore.numofview}</h1>
                            <p>ครั้ง</p>
                        </div>
                        {allincome.map((item, index) => (
                            <div className='' key={index}>
                                <p>รายทั้งหมด : {item.totalAmount}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>


            <div className='content-store'>
                {!loginstore ? (
                    <p>ท่านยังไม่ได้สมัคร account สำหรับการให้บริการ</p>
                ) : (
                    <div className=''>


                        <div style={{ display: showupload }} className="popupuploadproduct">
                            {/* <button onClick={saves}>sff</button> */}
                            <div className='item-upload-product'>
                                <div className='box-input-uploadproduct'>
                                    <div className="content-uploadproduct">
                                        <div className="img-product">
                                            <div className='content-img-product'>
                                                <div className="showimg-product">
                                                    <div className="itemshow">
                                                        <img src={selectedImage} alt="" />
                                                    </div>
                                                </div>
                                                <div className="input-img-product">
                                                    <label htmlFor="imgproduct">เลือกรูปสินค้า</label>
                                                    <input id='imgproduct' type="file" placeholder='ภาพร้านค้า' onChange={handleimagesproduct} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="item-product-upload">
                                            <div className="content-product-product">
                                                <div className="item-content-uploadproduct">
                                                    <div className="item-end-upload">
                                                        <div className='box-upload-'>
                                                            {/* <label htmlFor="nameproduct">ชื่อสินค้า</label> */}
                                                            <input id='nameproduct' type="text" placeholder='ชื่อสินค้า' onChange={handlenameproduct} />
                                                        </div>
                                                        <div className='box-upload-'>
                                                            <input type="number" placeholder='ราคาสินค้า' onChange={handleprice} />
                                                        </div>
                                                        <div className='box-upload-'>
                                                            <input type="text" placeholder='รายละเอียดสินค้า' onChange={handledescrip} />
                                                        </div>
                                                        <div className='box-upload-'>
                                                            <input type="number" placeholder='จำนวนสินค้า' onChange={handlequantity} />
                                                        </div>
                                                        <div className="btn-upload-image">
                                                            <button type='sunmit' onClick={onsubmitproduct} >submit</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <Link to={'/Dashbord/' + loginstore.IDuser}>back</Link> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{marginTop:'50px'}} className='container-allproductabput'>
                            <div className='boxvalue'>
                                <div className="all-boxvalue">
                                    <div className="title-value">
                                        <h1>รายการของฉัน</h1>
                                    </div>
                                    <div className="item-value">
                                        <div className='value'>
                                            <button onClick={handlemyproduct}>สินค้าของฉัน</button>
                                        </div>
                                        <div className='value'>
                                            <button onClick={handlemybookingproduct} >ประวัติการสั่งซื้อ</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='velue_menu'>
                                <div className='myproduct-item' >
                                    {myproduct == true ? (
                                        <div className='box_volum' >
                                            {dataproduct.map((resproduct) => (
                                                <div className='item-box-product' key={resproduct._id} >
                                                    <div className="content-myproduct">
                                                        <div className="img-myproduct">
                                                            <div className="item-img-product">
                                                                <img width={50} height={50} src={`../imageproduct/${resproduct.imageProduct}`} />
                                                            </div>
                                                        </div>
                                                        {/* <p>ชื่อผู้จอง : {resproduct.users[0].name}</p> */}
                                                        <div className="content-myproduct-about">
                                                            <div className="item-myproduct-about">
                                                                <p>ชื่อสินค้า : {resproduct.nameProduct}</p>
                                                                <p>จำนวนที่จอด : {resproduct.quantityInStockrel} ที่</p>
                                                                <p>จำนวนการซื้อ : {resproduct.viewstore}  ครั้ง</p>
                                                            </div>
                                                        </div>
                                                        <div className="btn-myproduct-control">
                                                            <div className="item-myproduct-control">
                                                                <div className='content-myproduct-control'>
                                                                    <button style={{ backgroundColor: 'green', color: 'white' }} type="submit" onClick={() => calledit(resproduct._id, resproduct.nameProduct, resproduct.imageProduct, resproduct.quantityInStockrel)}>edit</button>
                                                                </div>
                                                                <div className='content-myproduct-control'>
                                                                    <button style={{ backgroundColor: 'red', color: 'white' }} onClick={() => calldelete(resproduct._id)} type="submit">delete</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    ) : (
                                        <>
                                            <p></p>
                                        </>
                                    )}
                                </div>
                                <div className='mybooking-history'>
                                    <div className='myproduct-item' >
                                        <div className='box_volum' >
                                            {mybookingproduct == true ? (
                                                <div className='itembookinghis'>
                                                    {historybooking.map((item) => {
                                                        const isoDateTime = item.bookingtimehis
                                                        const dateObject = new Date(isoDateTime);
                                                        const day = dateObject.getDate();
                                                        const month = dateObject.getMonth() + 1;
                                                        const year = dateObject.getFullYear();


                                                        const amount = item.product[0].priceProduct
                                                        const bookingstart = item.bookingtimehis
                                                        const endbooking = item.timebookinghis

                                                        const timestartString = new Date(bookingstart)
                                                        const timeendString = new Date(endbooking)
                                                        const deferrenttime = timeendString - timestartString
                                                        const pricesell = amount / 60
                                                        const minuttime = deferrenttime / (1000 * 60)
                                                        const hours = Math.round(minuttime / 60);

                                                        const number = pricesell * minuttime
                                                        const amoutperminute = Math.round(number);

                                                        const time = new Date(item.histime);
                                                        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
                                                        const formattedDateTime = time.toLocaleDateString('en-US', options);
                                                        return (
                                                            <div className='content-bookinghis' key={item._id}>
                                                                <div className="item-my-bookinghis">
                                                                    <div className="img-mybookinghis">
                                                                        <div className="conten-img-mybookinghis">
                                                                            <img width={50} height={50} src={`../imageproduct/${item.product[0].imageProduct}`} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="item-about-mybookinghis">
                                                                        <div className="content-aboutmybookinghis">
                                                                            <p>ชื่อผู้จอง: {item.users[0].name}</p>
                                                                            <p>ชื่อสินค้า: {item.product[0].nameProduct}</p>
                                                                            <p>ราคาสินค้า: {item.product[0].priceProduct}</p>
                                                                            <div style={{ display: 'flex' }} className="end-myhistory">
                                                                                <p>จองเมื่อวันที่: {day}/{month}/{year}</p>
                                                                                <button onClick={() => openabouthistory(item.users[0].name, item.product[0].nameProduct, item.product[0].priceProduct, hours, amoutperminute)}>เพิ่มเติม..</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ) : (
                                                <div>
                                                    <p></p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Store