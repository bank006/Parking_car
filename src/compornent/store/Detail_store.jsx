import React, { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import '../../css/desbord.css'
import Select from '../patment/Selectpayment'
function Detail_store() {
  // const {IDstore ,IDuser} = useParams();

  const location = useLocation();
  const { IDstore, IDuser } = location.state;

  const [profilestore, set_profilestore] = useState([]);
  const [productstore, set_productstore] = useState([]);
  //booking
  const [showpopup, set_showpopup] = useState(false)
  const [productinregis, set_popupinrigis] = useState([])
  const [timeregis, set_timeregis] = useState([])
  const [startbookingregis, set_startbookingregis] = useState([])



  useEffect(() => {
    axios.get(`http://localhost:4001/store/loginstore/${IDstore}`)
      .then((store) => {
        if (store) {
          // console.log(store.data)
          set_profilestore(store.data)
        }
        else {
          alert("not fount")
        }
      }).catch((err) => {
        if (err) {
          console.log(err)
        } else {
          console.log("something went wrong")
        }
      })
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:4001/product/getproduct/${IDstore}`)
      .then((product) => {
        if (product) {
          set_productstore(product.data)
          // console.log(product.data)
        } else {
          alert("error")
        }
      }).catch((error) => {
        if (error) {
          console.log(error)
        } else {
          console.log("somthing went wrong")
        }
      })
  }, []);


  const booking = (_id) => {
    set_showpopup(true)
    const IDproduct = _id
    axios.get(`http://localhost:4001/product/callproduct/${IDproduct}`)
      .then((res) => {
        set_popupinrigis(res.data)

      }).catch((err) => {
        console.log(err)
      })
  }


  //เพิ่มข้อมูลการจอง
  const handle_timesregis = (e) => {
    set_timeregis(e.target.value)
  }
  //เพิ่มวันเวลาเริ่มการจอง
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
    } else {
      setselectpayment(true)
      set_datapayment({ IDproductregis, IDuser, storeregis, startbookingregis, timeregis })
    }
  }

  const close = () => {
    set_showpopup(false)
  }

  return (
    <div className='container'>
      <p>{"idstore : " + IDstore}</p>
      <p>{"iduser : " + IDuser}</p>
      <p>test</p>
      <div className={`popup ${showpopup ? 'visible' : ''}`}>
        <div className='box-regis'>
          <div className='regis'>
            <img src={`/imageproduct/${productinregis.imageProduct}`} alt="" width={100} height={100} />
            <ul>{productinregis.nameProduct}</ul>

            <Select item={{ selectpayment, datapayment }} />

            <label htmlFor="datetime">เลือกวันที่และเวลาที่เริ่มจอง:</label>
            <input type="datetime-local" id="datetime" name="datetime" onChange={handle_startbookingregis} required></input>
            <label htmlFor="datetime">เลือกวันที่และเวลาสิ้นสุดการจอง:</label>
            <input type="datetime-local" id="datetime" name="datetime" onChange={handle_timesregis} required></input>
            <button onClick={() => regisproduct(productinregis._id, IDstore)}>addproduct</button>
            <button type="button" onClick={close}>close</button>
          </div>
        </div>
      </div>
      <div className='profile-store'>
        <div className='box-item-img'>
          <img width={300} height={300} src={`/imagestore/${profilestore.imageStores}`} />
        </div>
        <div className='box-item-name'>
          <p>{profilestore.nameStore}</p>
        </div>
        <div className='box-item-descrip'>
          <p>{profilestore.description}</p>
        </div>
      </div>
      <div className='product-store'>
        <div className='product'>
          <div className='item-product'>
            {productstore.map((itemproduct) => (
              <div className='container-product' key={itemproduct._id}>
                <div className='item-product-image'>
                  <img src={`/imageproduct/${itemproduct.imageProduct}`} alt="" width={100} height={100} />
                </div>
                <div className='item-product-name'>
                  <p>{itemproduct.nameProduct}</p>
                  <p>{itemproduct._id}</p>
                </div>
                <div className='item-product-regis'>
                  <button onClick={() => booking(itemproduct._id)}>register</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Detail_store