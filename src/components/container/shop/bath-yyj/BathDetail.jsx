import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { addCart, setPaymentItems } from '../../../../slices/cartSlice'
import axios from 'axios'
import ShopDetailLayout from '../../../../layout-yyj/ShopDetailLayout'

const BathDetail = () => {
  const param = useParams()
  console.log(param.id, typeof (param.id))
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [addCartModal, setAddCartModal] = useState(false)

  const addToCart = () => {
    const item = { id: product.id, title: product.title, price: product.price, img: product.img, hoverImg: product.hoverImg, count: count }

    dispatch(addCart(item))
    setAddCartModal(true)
  }

  const payDirect = () => {
    const item = { id: product.id, title: product.title, price: product.price, img: product.img, hoverImg: product.hoverImg, count: count }

    dispatch(addCart(item))
    dispatch(setPaymentItems([item]))
    navigate('/payment')
  }

  const [count, setCount] = useState(1)
  const [product, setProduct] = useState([])

  const onIncrease = () => {
    setCount(count + 1)
  }
  const onDecrease = () => {
    if (count > 1) {
      setCount(count - 1)
    }
  }

  const images = [
    product.img ? `/images/${product.img}` : null,
    product.hoverImg ? `/images/${product.hoverImg}` : null,
  ].filter(Boolean)

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


  product && console.log(product)
  return (
    <ShopDetailLayout
      img={`/images/${product.img}`}
      hoverImg={product.hoverImg && product.hoverImg !== '' ? `/images/${product.hoverImg}` : null}
      title={product.title}
      price={product.price}
      count={count}
      onAddToCart={addToCart}
      onIncrease={onIncrease}
      onDecrease={onDecrease}
      addCartModal={addCartModal}
      setAddCartModal={setAddCartModal}
      payDirect={payDirect}
      images={images}
    >

    </ShopDetailLayout>
  )
}

export default BathDetail