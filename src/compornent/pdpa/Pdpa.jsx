import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';

import './Pdpa.css'

function Pdpa() {
    const navigate = useNavigate();
    const location = useLocation();

    const IDuser = location.state?.IDuser

    const submit = () => {
        navigate('/Incrud', { state: { IDuser } })
    }
    const backprofile =()=>{
        navigate("/Profile", { state:{IDuser} });
    }
    return (
        <div className='pdpa'>
            <div className="container-pdpa">
                <div className='title-pdpa'>
                    <h1>Privacy Policy</h1>
                </div>
                <div className='content-pdpa'>
                    <div className="">
                        <h3>การเก็บข้อมูลส่วนบุคคล</h3>
                        <p>ท่านสามารถเยี่ยมชมเว็บไซต์ PDPA Pro โดยไม่ต้องบอกเราว่าท่านคือใครหรือเปิดเผยข้อมูลใด ๆ ที่ทำให้บุคคลอื่นสามารถระบุตัวตนของท่านได้อย่างเฉพาะเจาะจง อย่างไรก็ตาม ท่านจะถูกสอบถามให้บอกกล่าวข้อมูลส่วนบุคคลบางอย่าง (เช่น ชื่อและอีเมลของท่าน) หากท่านมีความประสงค์ที่จะใช้ระบบการทำงานบางตัวของเว็บไซต์ PDPA Pro เราได้รับและจัดเก็บข้อมูลใด ๆ ที่ท่านได้ให้เราไว้โดยที่ท่านรับรู้เมื่อท่านได้ทำการสร้างบัญชีผู้ใช้ ประกาศเนื้อหา ทำการสั่งซื้อ หรือกรอกแบบฟอร์มบนเว็บไซต์ PDPA Pro เมื่อมีความจำเป็นข้อมูลเหล่านั้นอาจมีดังนี้</p>
                        <li>ข้อมูลส่วนบุคคล เช่น ชื่อ นามสกุล อายุ วันเดือนปีเกิด เลขประจำตัวประชาชน/หนังสือเดินทาง</li>
                        <li>ข้อมูลการติดต่อ เช่น อีเมล ที่อยู่ หมายเลขโทรศัพท์</li>
                        <li>ข้อมูลบัญชี เช่น ชื่อผู้ใช้งาน รหัสผู้ใช้งานที่เป็นเอกลักษณ์ รหัสผ่าน</li>
                        <li>หลักฐานการแสดงตัวตน เช่น สำเนาบัตรประจำตัวประชาชน สำเนาหนังสือเดินทาง</li>
                        <li>ข้อมูลการทำธุรกรรมและการเงิน เช่น รายละเอียดบัตรเครดิต บัญชีธนาคาร ประวัติการสั่งซื้อ</li>
                        <li>ข้อมูลอื่น ๆ ที่ท่านยินยอมนำส่งให้แก่เรา เช่น บทความ รูปภาพ ภาพเคลื่อนไหว ข้อเสนอแนะ และข้อมูลอื่นใดที่ถือว่าเป็นข้อมูลส่วนบุคคลตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล เป็นต้น</li>
                    </div>
                </div>

                <div className='btn-pdpa'>
                    <div className='btn-click-deline'>
                        <button onClick={backprofile}>Deline</button>
                    </div>
                    <div className='btn-click-accep'>
                        <button onClick={submit}>Accept the terms</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pdpa