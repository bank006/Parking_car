import React from 'react'

function Incurd_em() {
    


  return (
    <div className='container'>
        <p>การสมัครสมาชิก</p>
        <form>
            <div className='fome-data'>
                <div className='fname'>
                    <p>ชื่อ</p>
                    <input type="text" placeholder='firstname' />
                </div>
                <div className='lname'>
                    <p>นามสกุล</p>
                    <input type="text" placeholder='lastname' />
                </div>
            </div>
        </form>
    </div>
  )
}

export default Incurd_em