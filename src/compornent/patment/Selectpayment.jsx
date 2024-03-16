import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import '../patment/payment.css'


function Selectpayment(props) {

  // รับค่าจาก props
  const { selectpayment, datapayment } = props.item
  // เเสดงหน้าการเลือกวิธีการจ่าย
  const [popupslpay, set_popupslpay] = useState(false)
  //  เเสดงข้อมูลการรายการการจองจาก props
  const { IDproductregis, IDuser, storeregis, startbookingregis, timeregis , parkingbox } = datapayment
  // เเสดงผลข้อมูลลัพรายละเอียการจอง
  const [validate, set_validate] = useState([]);

  useEffect(() => {
    if (datapayment.length === 0) {
      // console.log(null)
    } else {
      set_popupslpay(selectpayment)
      getpr();
    }
  }, [datapayment])

  const [selectedOption, setSelectedOption] = useState('');
  const [bank, set_bank] = useState('')

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const closepayment = () => {
    set_popupslpay(false)
  }

  const handlesetbank = (e) => {
    set_bank(e.target.value)
  }

  const getpr = () => {
    const IDproduct = IDproductregis
    axios.get(`http://localhost:4001/product/callproduct/${IDproduct}`)
      .then((res) => {
        // console.log(res.data)
        set_validate(res.data)
      }).catch((err) => {
        console.log(err)
      })
  }


  const cfregister = () => {
    Swal.fire({
      title: 'คุณต้องการชำระเงินพื้นที่ให้บบริการใช้ไหม',
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
    }).then((result) => {
      if (result.isConfirmed) {
        regisproduct();
        Swal.fire({
          title: 'ดำเนินการเสร็จสมบูรณ์',
          text: 'ข้อมูลได้รับการบันทึกเรียบร้อย',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((res) => {
          if (res.isConfirmed) {
            window.location.reload();
          }
        })
      } else if (result.isDenied) {
        window.location.reload();
      }
    })
  }

  const regisproduct = () => {
    axios.post('http://localhost:4001/booking/postbooking', { IDproductregis, IDuser, storeregis, startbookingregis, timeregis , parkingbox })
      .then((res) => {
        console.log(res)
        // window.location.reload();
      }).catch((err) => {
        console.log(err)
      })

  }

  return (
    <div className={`popup-sl-payment ${popupslpay ? 'visible' : ''}`}>
      <div className='item-sl-payment'>
        {/* <p>รายละเอียดคำสั่งจอง</p>
        {validate && (
          <div>
            <p>{validate.nameProduct}</p>
          </div>
        )} */}
        <div className="payment-title">
          <p>วิธีการชำระเงิน</p>
        </div>
        <div className='bg-sl-obtion'>
          <form value={selectedOption} onChange={handleOptionChange}>
            <div className='container-radio'>
              <div className="box-bank">
                <input
                  type="radio"
                  value="bank"
                  checked={selectedOption === "bank"}
                  onChange={handleOptionChange}
                />

                <select className='sl-header' value={bank} onChange={handlesetbank}>
                  <option value="" >Select a bank</option>
                  <option value="scb">scb</option>
                  <option value="next">next</option>
                  <option value="k-bank">k-bank</option>
                </select>
              </div>
            </div>
            <div className='container-radio'>
              <div className="box-credit">
                <input
                  type="radio"
                  value="credit"
                  checked={selectedOption === "credit"}
                  onChange={handleOptionChange}
                />
                <p>Credit</p>
              </div>
            </div>
            <div className='container-radio'>
              <div className='box-prompay'>
                <input
                  type="radio"
                  value="Prompay"
                  checked={selectedOption === "Prompay"}
                  onChange={handleOptionChange}
                />
                <p>Prompay</p>
              </div>
            </div>
          </form>
        </div>
        <div className="container-btn">
          <div className='btn-regis'>
            <button type='submit' onClick={cfregister}>addcart</button>
          </div>
          <div className="btn-close-payment">
            <button onClick={closepayment} >close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Selectpayment