import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { addCart, decreaseCount, increaseCount } from '../../../../slices/cartSlice'
import ShopDetailLayout from '../../../../layout-yyj/ShopDetailLayout'
import { setPaymentItems } from '../../../../slices/cartSlice'


const ProductDetail = () => {

  const param = useParams()
  console.log(param.id, typeof (param.id))
  const navigate = useNavigate()
  const dispatch = useDispatch()



  const [product, setProduct] = useState([])
  const [count, setCount] = useState(1)
  const [addCartModal, setAddCartModal] = useState(false)

  useEffect(() => {
    const productURL = `http://localhost:3001/products`


    const productFn = async (id) => {
      try {
        const res = await axios.get(`${productURL}?id=${param.id}`)
        console.log(res + " res")
        if (res.data.length > 0) {
          setProduct(res.data[0])
        }
      } catch (err) {
        alert(err)
      }
    }
    productFn(param.id)
  }, [])

  const addToCart = () => {
    const item = { id: product.id, title: product.title, price: product.price, img: product.img, hoverImg: product.hoverImg, count: count }
    console.log(item.img)
    setAddCartModal(true)
    dispatch(addCart(item))
  }

  const payDirect = () => {
    const item = { id: product.id, title: product.title, price: product.price, img: product.img, hoverImg: product.hoverImg, count: count }
    dispatch(addCart(item))
    dispatch(setPaymentItems([item]))
    navigate('/payment')
  }
  const decrease = () => {
    if (count > 1) {
      setCount(count - 1)
    }
  }
  const increase = () => {
    setCount(count + 1)
  }

  product && console.log(product)

  console.log('hoverImg:', product.hoverImg)
  console.log('image path:', `/images/${product.hoverImg}`)

  const images = [
    product.img ? `/images/${product.img}` : null,
    product.hoverImg ? `/images/${product.hoverImg}` : null,
  ].filter(Boolean)

  return (
    <ShopDetailLayout
      img={`/images/${product.img}`}
      hoverImg={product.hoverImg && product.hoverImg !== "" ? `/images/${product.hoverImg}` : null}
      title={product.title}
      price={product.price}
      count={count}
      onAddToCart={addToCart}
      onDecrease={decrease}
      onIncrease={increase}
      addCartModal={addCartModal}
      setAddCartModal={setAddCartModal}
      payDirect={payDirect}
      images={images}
    >

    </ShopDetailLayout>
  )
}

export default ProductDetail