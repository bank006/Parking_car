import axios from 'axios';
import { useEffect, useState } from 'react';
import React from 'react'
import { useLocation } from 'react-router-dom'

function Chat() {
    const [storelist, setstorelist] = useState([])
    const location = useLocation();
    const { IDuser } = location.state



    useEffect(() => {
        axios.get('http://localhost:4001/storechat')
            .then((res) => {
                setstorelist(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }, [])

    console.log(storelist)

    return (
        <div className=''>
            {storelist !== null ? (
                <div className=''>
                    {storelist.map(store => {
                        return (
                            <div className='' key={store._id}>
                                <p>{store.IDstore}</p>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div>
                    <p>ไม่มีผู้สนทนา</p>
                </div>
            )}
        </div>
    )
}

export default Chat