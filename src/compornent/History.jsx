import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


import '../css/history.css'

function History(props) {

    const { IDuser } = props.IDuser
    const navigate = useNavigate();

    const [showhistory, set_showhistory] = useState(false);
    const [bookagain, set_bookagain] = useState(false)
    const [datahistory, set_datahistory] = useState([]);


    const [IDproductregis, set_IDproductregis] = useState([])
    const [storeregis, set_storeregis] = useState([])
    const [getproducts, set_getproducts] = useState([])
    const [timeregis, set_timeregis] = useState([])
    const [startbookingregis, set_startbookingregis] = useState([])

    const clickbtn = () => {
        set_showhistory(!showhistory)
    }
    const closebtn = () => {
        set_showhistory(!showhistory)
    }

    const openbookagain = async (IDproduct, IDstores) => {
        set_bookagain(!bookagain)
        set_IDproductregis(IDproduct)
        set_storeregis(IDstores)

        try {
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
                    console.log(res.data)
                    set_datahistory(res.data)
                }
            }).catch((err) => {
                console.error("ERROR", err);
            })
    }, []);

    const todetail = (IDuser, IDstore) => {
        navigate('/Detail_store', { state: { IDstore, IDuser } })
        console.log(IDuser, IDstore)
    }


    const againbooking = (IDproductregis, IDuser, storeregis, timeregis) => {
        console.log(IDproductregis, IDuser, storeregis, timeregis)
        if (startbookingregis.length === 0) {
            alert('กรุณาเลือกเวลา')
        } else if (timeregis.length === 0) {
            alert('กรุณาเลือกเวลา')
        } else {
            axios.post('http://localhost:4001/booking/postbooking', { IDproductregis, IDuser, storeregis, startbookingregis, timeregis })
                .then((res) => {
                    console.log(res)
                    window.location.reload();
                }).catch((err) => {
                    console.log(err)
                })

            // ลบสินค้าในสตอค
            axios.put(`http://localhost:4001/product/updatepostbooking/${IDproductregis}`)
                .then((update) => {
                    console.log(update)
                }).catch((err) => {
                    console.log(err)
                })

        }
    }

    // console.log(datahistory)

    return (
        <div className='container'>
            <div className={`popup-history ${showhistory ? 'visible' : ''}`}>
                <div className='box-history'>
                    <button type='button' onClick={closebtn}>close</button>
                    <h1>history</h1>
                    {datahistory.map((item, index) => {
                        const IDproduct = item.IDproductregishis
                        const IDstores = item.storeregishis
                        return (
                            <div className='item-history' key={index}>
                                <ul>{item.IDproductregishis}</ul>
                                <ul>ร้านค้า : {item.store[0].nameStore}</ul>
                                <ul>ชื่อสินค้า :{item.product[0].nameProduct}</ul>
                                <ul>ราคาสินค้า : {item.product[0].priceProduct}</ul>
                                <div className='btn'>
                                    <button type='button' onClick={() => todetail(IDuser, IDstore)}>ร้านค้า</button>
                                </div>
                                <div className='btn'>
                                    <button type='button' onClick={() => openbookagain(IDproduct, IDstores)}>จองอีกครั้ง</button>
                                </div>
                            </div>

                        )
                    })}
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
            <div className='btn-click'>
                <button type='button' onClick={clickbtn}>history</button>
            </div>
        </div>
    )
}

export default History