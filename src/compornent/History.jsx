import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


import '../css/history.css'
import Select from './patment/Selectpayment';
import Review from './review/Review';


function History(props) {

    const storeListRef = useRef(null);

    const { IDbookinghiss, IDuser, bookingagin, IDproductpay } = props.IDuser
    const navigate = useNavigate();
    const [showhistory, set_showhistory] = useState(true);
    const [bookagain, set_bookagain] = useState(false)
    const [datahistory, set_datahistory] = useState([]);
    const [IDproductregis, set_IDproductregis] = useState([])
    const [storeregis, set_storeregis] = useState([])
    const [getproducts, set_getproducts] = useState([])
    const [timeregis, set_timeregis] = useState([])
    const [startbookingregis, set_startbookingregis] = useState([])


    useEffect(() => {
        if (bookingagin === true) {
            console.log('uoi')
            const IDproduct = IDproductpay
            const idbooking = IDbookinghiss

            openbookagain(IDproduct)

        } else {
            console.log('32455')
        }
    }, [bookingagin])

    const openbookagain = async (IDproduct, IDstore, IDbookinghis) => {
        set_bookagain(!bookagain)
        set_IDproductregis(IDproduct)
        set_storeregis(IDstore)
        const IDbooking = IDbookinghiss || IDbookinghis

        try {
            // เอาประวัติการจองเเละไอดีทีรับมาเพื่อใช้งาน
            const resproduct = await axios.get(`http://localhost:4001/product/callproduct/${IDproduct}`)
            const all = resproduct.data

            set_getproducts(all)

        } catch (err) {
            console.log(err)
        }
    }


    const closebookagain = () => {
        set_bookagain(!bookagain)
    }

    useEffect(() => {
        axios.get(`http://localhost:4001/bookinghis/gethistory/${IDuser}`)
            .then((res) => {
                if (!res) {
                    console.log('Error not data')
                } else {
                    set_datahistory(res.data)
                }
            }).catch((err) => {
                console.error("ERROR", err);
            })
    }, []);

    const todetail = (IDuser, IDstore) => {
        navigate('/Detail_store', { state: { IDstore, IDuser } })
    }

    const [selectpayment, setselectpayment] = useState(false)
    const [datapayment, set_datapayment] = useState([])

    const againbooking = (IDproductregis, IDuser, storeregis, timeregis) => {
        if (startbookingregis.length === 0) {
            alert('กรุณาเลือกเวลา')
        } else if (timeregis.length === 0) {
            alert('กรุณาเลือกเวลา')
        } else {
            setselectpayment(true)
            set_datapayment({ IDproductregis, IDuser, storeregis, startbookingregis, timeregis })
        }
    }

    // นำทางไปหน้ารายละเอียดการจ่ายเงิน
    const linkdeshostory = (IDstore, IDbookinghis, amoutperminute) => {
        navigate('/Historypayment', { state: { IDuser, IDstore, IDbookinghis, amoutperminute } })
    }

    // console.log(datahistory)
    useEffect(() => {
        scrollToBottom();
    }, [datahistory]);

    const scrollToBottom = () => {
        storeListRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const [showreviews, setshowreview] = useState(false)
    const [idhistory, set_idhistory] = useState([])

    const showreview = (IDuser, IDhistory, IDproduct) => {
        set_idhistory({IDuser, IDhistory, IDproduct})
        setshowreview(!showreviews)
    }


    return (
        <div className='container-history'>
            {/* <div className={`popup-history ${showhistory ? 'visible' : ''}`}> */}
            <div className='popup-history'>
                <Review data={{ showreviews, idhistory }} />
                <div className='box-history'>
                    {datahistory.map((item, index) => {
                        const IDhistory = item._id
                        const IDbookinghis = item.IDbookinghis
                        const IDproduct = item.IDproductregishis
                        const IDstore = item.storeregishis

                        let qproduct;
                        let qproducts;
                        if (item.product[0].quantityInStock <= 0) {
                            qproduct = 'สินค้าหมด'
                            if (item.product[0].quantityInStock <= 0) {
                                qproduct = 'สินค้าหมด'
                            }
                        } else if (item.product[0].quantityInStock >= 0) {
                            qproduct = item.product[0].quantityInStock
                            if (item.product[0].quantityInStock >= 0) {
                                // qproducts = <button type='button' onClick={() => openbookagain(IDproduct, IDstore, IDbookinghis)}>รีวิว</button>
                                const IDproduct = item.IDproductregishis
                                qproducts = <button type='button' onClick={() => showreview(IDuser, IDhistory, IDproduct)}>รีวิว</button>
                            }
                        }

                        const isoDateTime = item.bookingtimehis
                        const dateObject = new Date(isoDateTime);
                        const day = dateObject.getDate();
                        const month = dateObject.getMonth() + 1;
                        const year = dateObject.getFullYear();
                        // return `${day}/${month}/${year}`;

                        const amount = item.product[0].priceProduct
                        const bookingstart = item.bookingtimehis
                        const endbooking = item.timebookinghis

                        const timestartString = new Date(bookingstart)
                        const timeendString = new Date(endbooking)
                        const deferrenttime = timeendString - timestartString
                        const pricesell = amount / 60
                        const minuttime = deferrenttime / (1000 * 60)
                        const hours = Math.floor(minuttime / 60);
                        const amoutperminute = pricesell * minuttime
                        // const roundedNumber = amoutperminute.toFixed(2);
                        return (
                            <div className='item-history' key={index}>
                                <div className="content-history">
                                    <div className="item-allbox-payment">
                                        <div className="history-namepay">
                                            <ul>{item.store[0].nameStore}</ul>
                                            <ul style={{ marginRight: '30px', color: '#FFD27C' }} >สำเร็จ</ul>
                                        </div>
                                        <div className="item-box-history">
                                            <div className="history-img">
                                                <img src={`../imageproduct/${item.product[0].imageProduct}`} alt="" />
                                            </div>
                                            {/* <div className='aboue-history'>
                                                <p>{item.product[0].descriptionProduct}</p>
                                                <p>{item.product[0].priceProduct}</p>
                                            </div> */}
                                            <table onClick={() => linkdeshostory(IDstore, IDbookinghis, amoutperminute)} className='table-history'>
                                                <tr>
                                                    <th>ชื่อร้านที่จอง</th>
                                                    <td>{item.store[0].nameStore}</td>
                                                </tr>
                                                <tr>
                                                    <th>ราคาสินค้า</th>
                                                    <td>ชั่วโมงละ : THB {item.product[0].priceProduct}</td>
                                                </tr>
                                                <tr>
                                                    <th>เวลาที่จอง</th>
                                                    <td>{day}/{month}/{year}</td>
                                                </tr>
                                                <tr>
                                                    <th>รวมเวลาที่จองทั้งหมด</th>
                                                    <td>{hours}ชั่วโมง</td>
                                                </tr>
                                                <tr>
                                                    <th>ราคารวม</th>
                                                    <td>{amoutperminute}</td>
                                                </tr>

                                            </table>
                                        </div>
                                        {/* <ul>ชื่อสินค้า :{item.product[0].nameProduct}</ul>
                                        <ul>ราคาสินค้า : {item.product[0].priceProduct}</ul>
                                        <ul>จำนวนสินค้า : {qproduct}</ul> */}

                                    </div>
                                    <div className='history-btn'>
                                        <div className='btn-history-store'>
                                            <button type='button' onClick={() => todetail(IDuser, IDstore)}>ร้านค้า</button>
                                        </div>
                                        <div className='btn-history-pay'>
                                            <p>{qproducts}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        )
                    })}
                    <div ref={storeListRef}></div>
                </div>
            </div>
            <div className={`popup-again ${bookagain ? 'visible' : ''}`}>
                <div className='item-again'>
                    <div className='item-content'>
                        <h1>again</h1>
                        {getproducts && (
                            <div className=''>
                                <ul>{getproducts._id}</ul>
                                <ul>{getproducts.nameProduct}</ul>
                                <ul>{getproducts.priceProduct}</ul>
                                {/* <label htmlFor='datetime'>เลือกวันที่และเวลา:</label>
                                <input type="datetime-local" id="datetime" name="datetime" onChange={(e) => set_timeregis(e.target.value)} ></input> */}

                                <Select item={{ selectpayment, datapayment }} />
                                {/* //newfeature */}
                                <label htmlFor="datetime">เลือกวันที่และเวลาที่เริ่มจอง:</label>
                                <input type="datetime-local" id="datetime" name="datetime" onChange={(e) => set_startbookingregis(e.target.value)} required></input>
                                <label htmlFor="datetime">เลือกวันที่และเวลาสิ้นสุดการจอง:</label>
                                <input type="datetime-local" id="datetime" name="datetime" onChange={(e) => set_timeregis(e.target.value)} required></input>


                            </div>
                        )}

                        <button type='button' onClick={() => againbooking(IDproductregis, IDuser, storeregis, timeregis)}>จองอีกครั้ง</button>
                        <button type='button' onClick={closebookagain}>close</button>
                    </div>
                </div>
            </div>
            {/* <div style={{position:'relative' , zIndex:'20'}} className='btn-click'>
                <button type='button' onClick={clickbtn}>history</button>
            </div> */}
        </div>
    )
}

export default History