import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../css/desbord.css';
import Select from './patment/Selectpayment';
import Navbars from './Navbar';

function Book_car() {

  const location = useLocation();
  const navigate = useNavigate();

  const { IDuser, IDproduct, IDstore, nameStore } = location.state
  const user = IDuser
  const IDproductregis = IDproduct
  const storeregis = IDstore
  const [activityparking, set_activityparking] = useState([])
  const [productrecall, set_productrecall] = useState(null)
  const [timeregis, set_timeregis] = useState([])
  const [startbookingregis, set_startbookingregis] = useState([])

  const [parkingbox, set_parkingbox] = useState([])
  const [red, set_red] = useState({})


  //เพิ่มข้อมูลการจอง
  const handle_timesregis = (e) => {
    set_timeregis(e.target.value)
  }
  const handle_startbookingregis = (e) => {
    set_startbookingregis(e.target.value)
  }

  const [selectpayment, setselectpayment] = useState(false)
  const [datapayment, set_datapayment] = useState([])

  // จองสินค้่าเเละอัพเดตจำนวนสินค้าที่เหลือ
  const regisproduct = (IDproductregis, storeregis) => {
    if (startbookingregis.length === 0) {
      alert('กรุณาเลือกเวลา')
    } else if (timeregis.length === 0) {
      alert('กรุณาเลือกเวลา')
    } else if (parkingbox.length === 0) {
      alert('กรุณาเลือกข่องที่ต้องกาาร')
    } else {
      setselectpayment(true)
      set_datapayment({ IDproductregis, IDuser, storeregis, startbookingregis, timeregis, parkingbox })
      console.log({ IDproductregis, IDuser, storeregis, startbookingregis, timeregis, parkingbox })
    }


  }
  // เซ้ตค่าส่งช่องจองรถ
  const handle_boxparking = (box) => {
    set_parkingbox(box)
    set_red((precolor) => {
      // ถ้ากล่องนี้มีสีอยู่แล้ว ก็ลบสีออก
      if (precolor[box]) {
        const { [box]: _, ...rest } = precolor;
        return rest;
      }
      // ถ้ากล่องนี้ยังไม่มีสี ก็เพิ่มสีเข้าไป (เราให้สีเป็น 'red' ในที่นี้)
      return { ...precolor, [box]: 'red' };
    });
  }

  // เรียกรายการที่มีการจองของสินค้าเเต่ละชิ้น
  useEffect(() => {
    axios.get(`http://localhost:4001/bookingcon/findbooking/${IDproduct}`)
      .then((res) => {
        set_activityparking(res.data)
      }).catch((err) => {
        console.log(err)
      })

    axios.get(`http://localhost:4001/product/callproduct/${IDproduct}`)
      .then((res) => {
        set_productrecall(res.data)
      }).catch((err) => {
        console.log(err)
      })

  }, [])

  const { quantityInStock } = productrecall || ''
  const { quantityInStockrel } = productrecall || ''
  const boxes = Array.from({ length: quantityInStockrel }, (_, index) => index + 1);
  const numberofparking = (quantityInStockrel - quantityInStock)

  // console.log(IDproduct)

  const closecart = ()=>{
    navigate('/dashbord' ,{state:{user}})
  }


  return (
    <div style={{ height: '100vh', background: 'black' }}>
      <Navbars totalID={{ IDuser: IDuser }}/>
      {productrecall && (
        <div className='container-box'>
          <div className="all-boxs">
            <div className="btn-close">
              <button onClick={closecart} ><img src='/public/back.png' alt="" /></button>
            </div>
            <div className="area-parking">
              <div className={`boxs ${boxes.length >= 5 && boxes.length <= 10 ? 'boxs-five' : '' || boxes.length >= 10 ? 'boxs-ten' : ''}`}>

                {boxes !== null ? (
                  boxes.map(box => {
                    const setred = red[box] || ''
                    return (
                      <div className={`item-boxs ${boxes.length >= 5 && boxes.length <= 10 ? 'item-boxs-five' : '' || boxes.length >= 10 ? 'item-boxs-ten' : ''}`}>

                        <button onClick={() => handle_boxparking(box)} className='regiscar' style={{ backgroundColor: `${setred}` }}>

                          {activityparking.map((te, index) => {
                            let a = ''
                            // && te.startbookingtime >= '2024-01-12T00:00'

                            const searchDate = new Date(startbookingregis)
                            const currentDate = new Date();
                            const currentTimeString = currentDate.toLocaleTimeString();
                            const startDate = new Date(te.startbookingtime)
                            const endDate = new Date(te.timebookingcon)
                            if (te.parkingbox === box && searchDate >= startDate && searchDate <= endDate) {
                              a = <button className='car' >ไม่ว่าง</button>
                            }
                            return (
                              <div className='' key={index}  >
                                {a}
                              </div>
                            )
                          })}


                        </button>

                      </div>
                    )
                  })


                ) : (
                  null
                )}

              </div>
            </div>
            <div className="des-productrecall">
              <div className="box-productrecall">
                <div className="recallproduct-item">
                  {/* <p className='namest'>{namest}</p> */}
                  <p>ช่องว่างที่เหลือ: {productrecall.quantityInStock} ช่อง</p>
                </div>
                <div className="input-item">
                  <div className="start-item">
                    <div className="lebel-start">
                      <label htmlFor="datetime">เลือกวันที่และเวลาที่เริ่มจอง:</label>
                    </div>
                    <div className="input-start">
                      <input type="datetime-local" id="datetime" name="datetime" onChange={handle_startbookingregis} required></input>
                    </div>
                  </div>
                  <div className="end-item">
                    <div className='label-endtime'>
                      <label htmlFor="datetime">เลือกวันที่และเวลาสิ้นสุดการจอง:</label>
                    </div>
                    <div className='input-endtime'>
                      <input type="datetime-local" id="datetime" name="datetime" onChange={handle_timesregis} required></input>
                    </div>
                    <div className="button-addproduct">
                      <button onClick={() => regisproduct(IDproductregis, storeregis)}>addproduct</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Select item={{ selectpayment, datapayment }} />
    </div>
  )
}

export default Book_car;
