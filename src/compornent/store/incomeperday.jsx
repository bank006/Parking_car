import React from 'react'
import { useRef, useEffect, useState } from 'react';

import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import axios from 'axios';

function incomeperday(props) {

    const IDstore = props.IDstore.IDstore
    // นับรายได้ประำจำวัน
    const currentDate = new Date(); // สร้างวัตถุ Date สำหรับวันที่ปัจจุบัน
    const currentYear = currentDate.getFullYear(); // ดึงปีปัจจุบัน
    const currentMonth = currentDate.getMonth() + 1; // ดึงเดือนปัจจุบัน (0-11) เพิ่มเลข 1 เพื่อเริ่มนับเดือนจาก 1-12
    const currentDay = currentDate.getDate(); // ดึงวันปัจจุบันในเดือน (1-31)

    const [years, setyears] = useState(currentYear)
    const [monthss, setmonth] = useState(currentMonth)
    const [days, setday] = useState(currentDay)

    const [dataincomeperday, set_dataimcomeperday] = useState([]);


    const [datetincome, setDatetoimcome] = useState([]);


    const handleDateChange = (e) => {
        setDatetoimcome(e.target.value);
    }

    useEffect(() => {
        if (datetincome && typeof datetincome === 'string') {
            const parts = datetincome.split('-');
            if (parts.length === 3) {
                setday(parts[2]);
                setmonth(parts[1]);
                setyears(parts[0]);
            }
        }
    }, [datetincome]);

    useEffect(() => {
        if (datetincome.length !== 0) {
            inputdata()
        } else if (datetincome.length === 0) {
            inputdata()
        }


    }, [days])

    const inputdata = () => {
        axios.get(`http://localhost:4001/income/getincomeperday/${years}/${monthss}/${days}/${IDstore}`)
            .then((incoemperday) => {
                set_dataimcomeperday(incoemperday.data)

            }).catch((err) => {
                console.log(err)
            })
    }


    useEffect(() => {
        getdayincome();
    }, [dataincomeperday])

    const [amoun, set_amounper] = useState([])
    const [day, set_day] = useState([])
    const getdayincome = () => {
        dataincomeperday.forEach((element) => {
            const day = element._id.day
            const income = element.totalAmount
            set_amounper(income)
            set_day(day)
        });
    }

    const data = {
        label: 'day',
        labels: [
            day
        ],
        datasets: [{
            label: 'รายได้รายวัน',
            data: [amoun],
            backgroundColor: (value) => {
                // กำหนดสีตามช่วงค่าข้อมูล
                return value.raw <= 50 ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)';
            },
            borderColor: (values) => {
                return values.raw <= 50 ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)';
            },
            hoverOffset: 31
        }]
    };


    return (
        <div className='' style={{ width: '270px' }}>

            {dataincomeperday.length > 0 ? (
                <>
                    <Doughnut data={data} />
                    <p>วันที่ :{day} เดือน: {monthss} ปี: {years} รายได้ :{amoun}</p>
                </>
            ) : (
                <p>ไม่มีข้อมูลสำหรับวันที่ที่เลือก</p>
            )}

            <label htmlFor="date">date</label>
            <input type="date" onChange={handleDateChange} name="date" id="date" required />
            <button onClick={inputdata}>ok</button>
        </div>
    )
}

export default incomeperday