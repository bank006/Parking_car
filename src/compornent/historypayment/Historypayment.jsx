import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios'
import './historypayment.css'
import History from '../History'


function Historypayment() {
    const location = useLocation();
    const { IDuser, IDstore, IDbookinghis, amoutperminute } = location.state
    const [historydata, sethistory] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:4001/bookinghis/detail/${IDbookinghis}`)
            .then((res) => {
                if (!res) {
                    console.log('Error not data')
                } else {
                    sethistory(res.data)
                }
            }).catch((err) => {
                console.error("ERROR", err);
            })
    }, []);
    // console.log(historydata)

    const rest = () => {
        const IDstore = '64d91abf459a3205b4cd5aef'
        axios.post('http://localhost:4001/storechat/storechatpost', { IDstore })
            .then((Res) => {
                console.log(Res)
            }).catch((err) => {
                console.log(err)
            })
    }

    const [bookingagin, setbooking_again] = useState()
    const [IDproductpay, set_IDproduct] = useState()
    const [IDbookinghiss, setIDbookinghis] = useState()
    const changvalue_bookingagain = (IDbookinghis, IDproduct) => {
        setbooking_again(true)
        set_IDproduct(IDproduct)
        setIDbookinghis(IDbookinghis)
    }


    return (
        <div className='container-historypayment'>
            <div className={`itembox-all ${bookingagin ? 'hidden' : ''}`}>
                <div className='history-checklist-item'>
                    {historydata.map((historydetail, index) => {
                        const IDproduct = historydetail.IDproductregishis
                        const IDbookinghis = historydetail.IDbookinghis
                        const beforpayment = historydetail.timeregister
                        const paynow =historydetail.payment[0].paymentDate
                        const active = historydetail.histime
                        const Beforpayment = moment(beforpayment).format('DD/MM/YYYY');
                        const Paynow = moment(paynow).format('DD/MM/YYYY');
                        const Active = moment(active).format('DD/MM/YYYY');
                        return (
                            <div className='all-data' key={index}>
                                <div className="checklist-historypayment" >
                                    <div className="allcheck-item">
                                        <div className="center-item">
                                            <div className="checkitem">
                                                <img src="./MeetingTime.png" alt="" />
                                            </div>
                                            <div className="timecheckitem">
                                                <p style={{marginLeft:'13px'}}>ที่ต้องชำระ</p>
                                                <p>{Beforpayment}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="allcheck-item">
                                        <div className="center-item">
                                            <div className="checkitem">
                                                <img src="./MeetingTime.png" alt="" />
                                            </div>
                                            <div className="timecheckitem">
                                                <p style={{marginLeft:'5px'}}>ชำระเงินเเล้ว</p>
                                                <p>{Paynow}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="allcheck-item">
                                        <div className="center-item">
                                            <div className="checkitem">
                                                <img src="./MeetingTime.png" alt="" />
                                            </div>
                                            <div className="timecheckitem">
                                                <p>กำลังดำเนินการ</p>
                                                <p style={{marginLeft:'5px'}}>{Active}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="allcheck-item">
                                        <div className="center-item">
                                            <div className="checkitem">
                                                <img src="./MeetingTime.png" alt="" />
                                            </div>
                                            <div className="timecheckitem">
                                                <p style={{marginLeft:'24px'}}>เสร็จสิ้น</p>
                                                <p style={{marginLeft:'10px'}}>{Active}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="line"></div>
                                </div>
                                <div className="btn-checkitem-history">
                                    <div className="btn-review">
                                        <button onClick={rest}>รีวิว</button>
                                    </div>
                                    <div className="btn-regis-checkitem">
                                        <button onClick={() => changvalue_bookingagain(IDbookinghis, IDproduct)}>จองอีกครั้ง</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {historydata.map((data, index) => {
                    const isoDateString = data.timebookinghis
                    const thaiDate = moment(isoDateString).format('DD/MM/YYYY');
                    const Hofprice = amoutperminute / data.product[0].priceProduct
                    return (
                        <div className='item-aboutepayment' key={index}>
                            <div className="item-box-content">
                                <div className="title-content-historypayment">
                                    <div className="title-namestore-history">
                                        <p>{data.store[0].nameStore}</p>
                                    </div>
                                    <div className="title-pricetotal-history">
                                        <p>{amoutperminute}</p>
                                    </div>
                                </div>
                                <div className="aboute-item-historypayment">
                                    <div className="img-hispayment">
                                        <img src={`../imageproduct/${data.product[0].imageProduct}`} alt="" />
                                    </div>
                                    <div className='name-boxhispayment'>

                                        <p>{data.product[0].nameProduct}</p>
                                        <p>{data.product[0].priceProduct}/ชั่วโมง</p>
                                    </div>
                                </div>
                                <table className='table-histable'>
                                    <tr>
                                        <th>วัน/เดือน/ปี ที่จอง</th>
                                        <td>{thaiDate}</td>
                                    </tr>
                                    <tr>
                                        <th>เวลาที่จอง</th>
                                        <td>{Hofprice} ชั่วโมง</td>
                                    </tr>
                                    <tr>
                                        <th>ช่องทางการชำระเงิน</th>
                                        <td>Prompay</td>
                                    </tr>
                                    <tr>
                                        <th>ราคาทั้งสิ้น :</th>
                                        <td style={{color:'red' , fontWeight:'700'}}>{amoutperminute} THB</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className={`nonedisplay ${bookingagin ? 'nonnone' : ''}`}>
                {/* <div style={{display:'none'}}> */}
                <History IDuser={{ IDbookinghiss, IDuser, bookingagin, IDproductpay }} />
            </div>
        </div>
    )
}

export default Historypayment