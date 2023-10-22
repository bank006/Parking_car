import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/shopingcard.css'


function Shopping_cart(props) {

    const { IDuser } = props.IDuser
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
                console.log(res.data)
                set_itemcard(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }, [])

    // เพิ่มเข้า bookingcon
    // ลบข้อมูลใน booking
    // เพ่ิมเข้า QR
    // เพิ่มเข้า bookinghistory
    //  ดึงเอา qr
    // ลดสินค้าใน stock เมื่อทำการจอง




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

    const booking = (_id, IDproductregis, IDuser, storeregis) => {

        if (startbookingregis.length === 0) {
            alert('กรุณาเลือกเวลา')
        } else if (timeregis.length === 0) {
            alert('กรุณาเลือกเวลา')
        } else {
            // เพ่ิมข้อมูลวันเวลาการจอง->เพ่ิมข้อมูลใน booking
            axios.post('http://localhost:4001/booking/postbooking', { IDproductregis, IDuser, storeregis, startbookingregis, timeregis })
                .then((bookingcon) => {
                    console.log(bookingcon.data)
                    deletecard(_id);
                }).catch((err) => {
                    console.log(err)
                })
            axios.put(`http://localhost:4001/product/updatepostbooking/${IDproductregis}`)
                .then((update) => {
                    console.log(update)
                }).catch((err) => {
                    console.log(err)
                })
        }
    }

    const deletecard = (_id) => {
        axios.delete(`http://localhost:4001/shoppingcart/delete/${_id}`)
            .then((resdelete) => {
                console.log(resdelete.data)
            }).catch((err) => {
                console.log(err)
            })
    }
    console.log(itemcard)
    return (
        <div className='container'>
            <div className='button'>
                <div className={`shopping-card ${shoppingshow ? 'visible' : ''}`}>
                    <div className='item-card'>
                        <p>{IDuser}</p>
                        <button type='button' onClick={closeshopping}>close</button>
                        <b>สินค้า</b>
                        {itemcard.map((item, index) => {
                            const _id = item._id
                            const IDproductregis = item.IDproductregis
                            const IDuser = item.IDuser
                            const storeregis = item.storeregis
                            return (
                                <div className='itemcard' key={index}>
                                    <ul>{item.product[0].nameProduct}</ul>
                                    <ul>{item.product[0].priceProduct}</ul>
                                    <div className=''>
                                        <div className=''>
                                            <div className=''>
                                                <label htmlFor="datetime">เลือกวันที่และเวลาที่เริ่มจอง:</label>
                                                <input type="datetime-local" id="datetime" name="datetime" onChange={handle_startbookingregis} required></input>
                                                <label htmlFor="datetime">เลือกวันที่และเวลาสิ้นสุดการจอง:</label>
                                                <input type="datetime-local" id="datetime" name="datetime" onChange={handle_timesregis} required></input>
                                            </div>
                                        </div>
                                        <button type='button' onClick={() => booking(_id, IDproductregis, IDuser, storeregis)}>จ่ายเงิน</button>
                                        <button>ลบ</button>
                                    </div>
                                </div>
                            )
                        })}

                    </div>

                </div>
                <button type='button' onClick={openshowshopping}>ตระกร้าสินค้า</button>
            </div>
        </div>
    )
}

export default Shopping_cart