import React ,{useEffect , useState} from 'react'
import { useParams ,Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/shopingcard.css'

function Shopping_cart(props) {

    const {IDuser} = props.IDuser
    const [shoppingshow , set_shoppingshow] = useState(false)
    const [itemcard , set_itemcard] = useState([]);

    const openshowshopping = ()=>{
        set_shoppingshow(!shoppingshow);
    }

    const closeshopping = ()=>{
        set_shoppingshow(!shoppingshow)
    }

    useEffect(()=>{
        axios.get(`http://localhost:4001/shoppingcart/getcard/${IDuser}`)
        .then((res)=>{
            console.log(res.data)
            set_itemcard(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    },[])

  return (
    <div className='container'>
        <div className='button'>
            <div className={`shopping-card ${shoppingshow ? 'visible' : ''}`}>
                <div className='item-card'>
                    <p>{IDuser}</p>
                    <button type='button' onClick={closeshopping}>close</button>
                    <b>สินค้า</b>
                    {itemcard.map((item , index)=>{
                        return(
                            <div className='itemcard' key={index}>
                                <ul>{item.product[0].nameProduct}</ul>
                                <ul>{item.product[0].priceProduct}</ul>
                                <div className=''>
                                    <button>จ่ายเงิน</button>
                                    <button>ลบ</button>
                                </div>
                            </div>
                        )
                    })}
                    
                </div>
                
            </div>
            <button type='button' onClick={openshowshopping}>ตระกร้าสินค้า</button>
        </div>
    </div>
  )
}

export default Shopping_cart