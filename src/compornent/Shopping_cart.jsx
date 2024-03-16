import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import '../css/shopingcard.css'
import Select from './patment/Selectpayment';
import Dashbord from './Dashbord';



function Shopping_cart(props) {

    const navigate = useNavigate();

    const { IDuser } = props.IDuser

    const IDusers = IDuser
    const [shoppingshow, set_shoppingshow] = useState(false)
    const [itemcard, set_itemcard] = useState([]);

    const openshowshopping = () => {
        set_shoppingshow(!shoppingshow);
    }

    const closeshopping = () => {
        set_shoppingshow(!shoppingshow)
    }

    useEffect(() => {
        axios.get(`http://localhost:4001/shoppingcart/getcard/${IDuser}`)
            .then((res) => {
                // console.log(res.data)
                set_itemcard(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }, [])


    // เพิ่มข้อมูลใน bookinghistory
    // ลบข้อมูลจาก card
    // อัพเดต stock
    const [startbookingregis, set_startbookingtime] = useState([]);
    const [timeregis, set_timebookingcon] = useState([]);

    const handle_startbookingregis = (e) => {
        set_startbookingtime(e.target.value)
    }

    const handle_timesregis = (e) => {
        set_timebookingcon(e.target.value)
    }

    const [selectpayment, setselectpayment] = useState(false)
    const [datapayment, set_datapayment] = useState([])
    const booking = (_id, IDproductregis, IDuser, storeregis) => {

        if (startbookingregis.length === 0) {
            alert('กรุณาเลือกเวลา')
        } else if (timeregis.length === 0) {
            alert('กรุณาเลือกเวลา')
        } else {
            setselectpayment(true)
            set_datapayment({ IDproductregis, IDuser, storeregis, startbookingregis, timeregis })
            deletecard(_id);
        }
    }

    const confirmdelete = (_id) => {
        Swal.fire({
            icon: 'question',
            title: 'ต้องการลบใช่หรือไม่',
            confirmButtonText: 'ยืนยัน',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก'
        }).then((res) => {
            if (res.isConfirmed === true) {
                deletecard(_id)
            }
        })
    }

    //  ลบออกจากรายการที่ชอบ
    const deletecard = (_id) => {
        axios.delete(`http://localhost:4001/shoppingcart/delete/${_id}`)
            .then((resdelete) => {
                console.log(resdelete.data)
            }).catch((err) => {
                console.log(err)
            })
    }


    const senddatas = (IDproduct, IDstore, nameStore) => {
        navigate('/Book_car', { state: { IDuser, IDproduct, IDstore, nameStore } })

    }

    return (
        <div className='container'>
            <div className='button'>
                <div className={`shopping-card ${shoppingshow ? 'visible' : ''}`}>
                    <div className='item-card'>
                        <div className="back-close">
                            <button type='button' onClick={closeshopping}><img src='/public/back.png' alt="" /></button>
                        </div>
                        <div className="itemcontentcart">
                            <div className="contentcart">
                                {itemcard.map((item, index) => {
                                    const _id = item._id
                                    const IDstore = item.store[0]._id
                                    const namestores = item.store[0].nameStore
                                    const IDproductregis = item.IDproductregis
                                    const IDuser = item.IDuser
                                    const storeregis = item.storeregis
                                    return (
                                        <div className='content' key={index}>
                                            <div className='content-favorite'>
                                                <div className='favorite'>
                                                    <div className="images-store">
                                                        <img src={`../imageproduct/${item.product[0].imageProduct}`} alt="" />
                                                    </div>
                                                    <p>{namestores}</p>
                                                    <Select item={{ selectpayment, datapayment }} />
                                                    {/* <label htmlFor="datetime">เลือกวันที่และเวลาที่เริ่มจอง:</label> */}
                                                    {/* <input type="datetime-local" id="datetime" name="datetime" onChange={handle_startbookingregis} required></input>
                                                    <label htmlFor="datetime">เลือกวันที่และเวลาสิ้นสุดการจอง:</label>
                                                    <input type="datetime-local" id="datetime" name="datetime" onChange={handle_timesregis} required></input>
                                                    <button type='button' onClick={() => booking(_id, IDproductregis, IDuser, storeregis)}>สั่งจอง</button> */}
                                                    <div className="btn-cart">
                                                        <div className="btn-cart-booking">
                                                            <button onClick={() => senddatas(IDproductregis, IDstore, namestores)}>จอง</button>
                                                        </div>
                                                        <div className="btn-cart-delete">
                                                            <button onClick={() => confirmdelete(_id)} >ลบ</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </div>

                </div>
                <div style={{ position: 'relative', zIndex: '10' }} className="btnshowregis">
                    <button className='card-open' type='button' onClick={openshowshopping}>รายการที่ชอบ</button>
                </div>

            </div>
        </div>
    )
}

export default Shopping_cart