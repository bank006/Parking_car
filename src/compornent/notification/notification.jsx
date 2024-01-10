import React from 'react'
import '../../css/bookinghis.css'

function notification(props) {
    const { notibtn } = props?.message || "ไม่มีการจอง"
    return (
        <div className='notification'>
            <div className='item-notification'>
                <p></p>
            </div>
        </div>
    )
}

export default notification