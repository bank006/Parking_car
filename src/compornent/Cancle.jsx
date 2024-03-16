import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import '../css/cancle.css'

function Cancle(props) {
    const location = useLocation();
    const { IDuser } = props.IDuser

    const [canceldata, setcanceldata] = useState([])
    useEffect(() => {
        axios.get(`http://localhost:4001/cancel/getcancel/${IDuser}`)
            .then((res) => {
                setcanceldata(res.data)
            }).catch((err) => {
                console.log(err);
            })
    }, [])

    return (
        <div className='container-cancle'>
            <div className="item-canclescoll">
                <div className="all-box-cancle">
                    {canceldata.map((item, index) => {
                        return (
                            <div className='item-mycancel'>
                                <div className="img-mycancel">
                                    <div className="conten-img-mycancel">
                                        <img  src={`../imageproduct/${item.product[0].imageProduct}`} />
                                    </div>
                                </div>
                                <div className="about-mycancel">
                                    <p>ชื่อพื้นที่จอด : {item.product[0].nameProduct}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Cancle