import React, { lazy, Suspense } from 'react'

const Loading = <div className='loading'>Loading...</div>
// toy 세부
const ShopToy = lazy(() => import('../components/container/shop/ShopToyContainer'))
const ShopToyBall = lazy(() => import(`../components/container/shop/toy-yyj/ShopToy_ballContainer`))
const ShopToyTug = lazy(() => import(`../components/container/shop/toy-yyj/ShopToy_tugContainer`))
const ShopToyStuffed = lazy(() => import(`../components/container/shop/toy-yyj/ShopToy_stuffedContainer`))


const toToyRouter = () => {
  return (
    [
      {

        path: '',
        element: <Suspense fallback={Loading}><ShopToy /></Suspense>
      },
      {
        // shop/toy
        path: 'ball',
        element: <Suspense fallback={Loading}><ShopToyBall /></Suspense>
      },
      {
        // tug
        path: 'tug',
        element: <Suspense fallback={Loading}><ShopToyTug /></Suspense>
      },
      {
        // ball
        path: 'stuffed',
        element: <Suspense fallback={Loading}><ShopToyStuffed /></Suspense>
      }
    ]

  )
}

export default toToyRouter