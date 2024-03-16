import React from 'react'
import { useRef, useEffect, useState } from 'react';
import { Chart } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

function income(props) {

    const IDstore = props.IDstore.IDstore
    const thismonth = new Date();
    const today = new Date(thismonth);
    const thaiDateString = today.toLocaleDateString('th-TH', { month: 'long' });

    useEffect(() => {
        setSelectedMonth(thaiDateString);
    }, [thaiDateString]);


    const [selectedMonth, setSelectedMonth] = useState(thaiDateString);
    const [year, set_year] = useState([2024])
    const [datas, set_data] = useState([])
    const [endMonth, setendMonth] = useState(thaiDateString)

    const [January, set_January] = useState({ monthi: 'มกราคม', total: null })
    const [February, set_February] = useState({ monthi: 'กุมพาพันธ์', total: null })
    const [March, set_March] = useState({ monthi: 'มีนาคม', total: null })
    const [April, set_April] = useState({ monthi: 'เมษายน', total: null })
    const [May, set_May] = useState({ monthi: 'พฤษภาคม', total: null })
    const [June, set_June] = useState({ monthi: 'มิถุนายน', total: null })
    const [July, set_July] = useState({ monthi: 'กรกฎาคม', total: null })
    const [August, set_August] = useState({ monthi: 'กันยายน', total: null })
    const [September, set_September] = useState({ monthi: 'สิงหาคม', total: null })
    const [October, set_October] = useState({ monthi: 'ตุลาคม', total: null })
    const [November, set_November] = useState({ monthi: 'พฤศจิกายน', total: null })
    const [December, set_December] = useState({ monthi: 'ธันวาคม', total: null })

    useEffect(() => {
        set_January({ monthi: 'มกราคม', total: null });
        set_February({ monthi: 'กุมพาพันธ์', total: null });
        set_March({ monthi: 'มีนาคม', total: null });
        set_April({ monthi: 'เมษายน', total: null });
        set_May({ monthi: 'พฤษภาคม', total: null });
        set_June({ monthi: 'มิถุนายน', total: null });
        set_July({ monthi: 'กรกฎาคม', total: null });
        set_August({ monthi: 'กันยายน', total: null });
        set_September({ monthi: 'สิงหาคม', total: null });
        set_October({ monthi: 'ตุลาคม', total: null });
        set_November({ monthi: 'พฤศจิกายน', total: null });
        set_December({ monthi: 'ธันวาคม', total: null });
    }, [year]);

    const showdata = async (selectedYear) => {
        try {
            const res = await axios.get(`http://localhost:4001/income/getincome/${selectedYear}/${IDstore}`);
            set_data(res.data); // รอให้ mapdata เสร็จสิ้นก่อนที่จะทำต่อ
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (year !== 'none') {
            showdata(year);
        }
    }, [year]);

    // เรียก showdata เมื่อกดปุ่ม OK
    const handleButtonClick = () => {
        if (year !== 'none') {
            showdata(year);
        }
    }

    useEffect(() => {
        datas.forEach((item, index) => {
            const idValue = item._id
            const totalAmountValue = item.totalAmount;

            if (idValue === 1) {
                const monthi = 'มกราคม'
                const total = item.totalAmount
                set_January({ monthi, total })
            }
            else if (idValue === 2) {
                const monthi = 'กุมพาพันธ์'
                const total = item.totalAmount
                set_February({ monthi, total })
            } else if (idValue === 3) {
                const total = item.totalAmount
                const monthi = 'มีนาคม'
                set_March({ monthi, total })
            }
            else if (idValue === 4) {
                const total = item.totalAmount
                const monthi = 'เมษายน'
                set_April({ monthi, total })
            }
            else if (idValue === 5) {
                const total = item.totalAmount
                const monthi = 'พฤษภาคม'
                set_May({ monthi, total })
            }
            else if (idValue === 6) {
                const total = item.totalAmount
                const monthi = 'มิถุนายน'
                set_June({ monthi, total })
            }
            else if (idValue === 7) {
                const total = item.totalAmount
                const monthi = 'กรกฎาคม'
                set_July({ monthi, total })
            }
            else if (idValue === 8) {
                const total = item.totalAmount
                const monthi = 'สิงหาคม'
                set_August({ monthi, total })
            }
            else if (idValue === 9) {
                const total = item.totalAmount
                const monthi = 'กันยายน'
                set_September({ monthi, total })
            }
            else if (idValue === 10) {
                const total = item.totalAmount
                const monthi = 'ตุลาคม'
                set_October({ monthi, total })
            }
            else if (idValue === 11) {
                const total = item.totalAmount
                const monthi = 'พฤศจิกายน'
                set_November({ monthi, total })
            }
            else if (idValue === 12) {
                const total = item.totalAmount
                const monthi = 'ธันวาคม'
                set_December({ monthi, total })
            }
            // set_data({ month: idValue, income: totalAmountValue })
            // console.log({ month: idValue, income: totalAmountValue })
        });

    }, [datas])

    // January.monthi , February.month , March.month , April.monthi ,May.monthi, June.monthi , July.monthi ,August.monthi , September.monthi,
    // January.total , February.total , March.total , April.total ,May.total, June.total , July.total ,August.total , September.total,

    const data = {

        labels: [January.monthi, February.monthi, March.monthi, April.monthi, May.monthi, June.monthi, July.monthi, August.monthi, September.monthi, October.monthi, November.monthi, December.monthi],
        datasets: [
            {
                label: 'รายได้ในเเต่ละเดือน',
                data: [January.total, February.total, March.total, April.total, May.total, June.total, July.total, August.total, September.total, October.total, November.total, December.total],
                backgroundColor: (value) => {
                    // กำหนดสีตามช่วงค่าข้อมูล
                    return value.raw <= 50 ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)';
                },
                borderColor: (values) => {
                    return values.raw <= 50 ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)';
                },

                borderWidth: 1,
            },
        ],
    };

    const [chartWidth, setChartWidth] = useState(window.innerWidth);
    const [chartHeight, setChartHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setChartWidth(window.innerWidth);
            setChartHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    // 'มกราคม', 'กุมพาพันธ์' , 'มีนาคม', 'เมษายน' ,'พฤษภาคม','มิถุนายน','กรกฎาคม' ,'กันยายน' ,'สิงหาคม',

    const months = ['มกราคม', 'กุมพาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'กันยายน', 'สิงหาคม', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม', 'มกราคม']
    // กรองข้อมูลตามเดือนที่ถูกเลือก
    const filteredData = selectedMonth === 'All' ? data : {
        labels: months.slice(monthToIndex(selectedMonth), monthToIndex(endMonth) + 1),
        datasets: [{
            label: 'รายได้ในเเต่ละเดือน',
            data: months.slice(monthToIndex(selectedMonth), monthToIndex(endMonth) + 1).map(month => data.datasets[0].data[monthToIndex(month)]),
            backgroundColor: (value) => {
                // กำหนดสีตามช่วงค่าข้อมูล
                return value.raw <= 50 ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)';
            },
            borderColor: (values) => {
                return values.raw <= 50 ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)';
            },
            borderWidth: 1,
        }],
    };


    return (
        <div className=''>
            <div style={{ height: '260px' }}>
                <Bar data={filteredData} options={options} />
            </div>
            <div style={{marginTop:'20px'}} className="optionvalue">
                <select onChange={(e) => setSelectedMonth(e.target.value)}>
                    <option value="All">All Months</option>
                    <option value="มกราคม">มกราคม</option>
                    <option value="กุมพาพันธ์">กุมพาพันธ์</option>
                    <option value="มีนาคม">มีนาคม</option>
                    <option value="เมษายน">เมษายน</option>
                    <option value="พฤษภาคม">พฤษภาคม</option>
                    <option value="มิถุนายน">มิถุนายน</option>
                    <option value="กรกฎาคม">กรกฎาคม</option>
                    <option value="กันยายน">กันยายน</option>
                    <option value="สิงหาคม">สิงหาคม</option>
                    <option value="ตุลาคม">ตุลาคม</option>
                    <option value="พฤศจิกายน">พฤศจิกายน</option>
                    <option value="ธันวาคม">ธันวาคม</option>
                </select>
                <select onChange={(e) => setendMonth(e.target.value)}>
                    <option value="All">All Months</option>
                    <option value="มกราคม">มกราคม</option>
                    <option value="กุมพาพันธ์">กุมพาพันธ์</option>
                    <option value="มีนาคม">มีนาคม</option>
                    <option value="เมษายน">เมษายน</option>
                    <option value="พฤษภาคม">พฤษภาคม</option>
                    <option value="มิถุนายน">มิถุนายน</option>
                    <option value="กรกฎาคม">กรกฎาคม</option>
                    <option value="กันยายน">กันยายน</option>
                    <option value="สิงหาคม">สิงหาคม</option>
                    <option value="ตุลาคม">ตุลาคม</option>
                    <option value="พฤศจิกายน">พฤศจิกายน</option>
                    <option value="ธันวาคม">ธันวาคม</option>
                </select>
                <select onChange={(e) => set_year(e.target.value)}>
                    {/* <option value="none">none</option> */}
                    {/* <option value="2023">2023</option> */}
                    <option value="2024">2024</option>
                </select>
                <button onClick={handleButtonClick}>ok</button>
            </div>
        </div>
    )
}
// ฟังก์ชั่นแปลงชื่อเดือนเป็นดัชนีของเดือนใน array
function monthToIndex(month) {
    const months = ['มกราคม', 'กุมพาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'กันยายน', 'สิงหาคม', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม', 'มกราคม'];
    return months.indexOf(month);
}

export default income