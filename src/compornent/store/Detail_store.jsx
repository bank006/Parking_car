import React, { useEffect } from 'react'
import axios from 'axios'
import { useState  } from 'react'
import { useParams } from 'react-router-dom'

function Detail_store() {
  const {IDstore ,IDuser} = useParams();

  const [profilestore , set_profilestore ] = useState([]);
  const [productstore , set_productstore] = useState([]);

  useEffect(()=>{
    axios.get(`http://localhost:4001/store/loginstore/${IDstore}`)
    .then((store)=>{
      if(store){
        console.log(store.data)
        set_profilestore(store.data)
      }
      else{
        alert("not fount")
      }
    }).catch((err)=>{
      if(err){
        console.log(err)
      }else{
        console.log("something went wrong")
      }
    })
  },[]);

  console.log(profilestore.imageStores)

  useEffect(()=>{
    axios.get(`http://localhost:4001/product/getproduct/${IDstore}`)
    .then((product)=>{
      if(product){
        set_productstore(product.data)
        console.log(product.data)

      }else{
        alert("error")
      }
    }).catch((error)=>{
      if(error){
        console.log(error)
      }else{
        console.log("somthing went wrong")
      }
    })
  },[]);



  return (
      <div className='container'>
        <p>{"idstore : " + IDstore}</p>
        <p>{"iduser : " + IDuser}</p>
        <p>test</p>
        <div className='profile-store'>
          <div className='box-item-img'>
            <img width={300} height={300}  src={`/imagestore/${profilestore.imageStores}`}/>
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
              {productstore.map((itemproduct)=> (
                <div className='container-product' key={itemproduct._id}>
                  <div className='item-product-image'>
                    <img src={`/imageproduct/${itemproduct.imageProduct}`} alt="" width={100} height={100} />
                  </div>
                  <div className='item-product-name'>
                    <p>{itemproduct.nameProduct}</p>
                  </div>
                  <div className='item-product-regis'>
                    <button>register</button>
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