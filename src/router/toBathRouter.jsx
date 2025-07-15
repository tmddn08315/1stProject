import React, { lazy, Suspense } from 'react'


const Loading = <div className='loading'>Loading...</div>

// bath 세부
const ShopBath = lazy(() => import('../components/container/shop/ShopBathContainer'))
const ShopBathShampoo = lazy(() => import('../components/container/shop/bath-yyj/ShopBath_shampooContainer'))
const ShopBathComb = lazy(() => import('../components/container/shop/bath-yyj/ShopBath_combContainer'))


const toBathRouter = () => {
  return (
    [
      {
        path: '',
        element: <Suspense fallback={Loading}><ShopBath /></Suspense>
      },
      {
        path: 'shampoo',
        element: <Suspense fallback={Loading}><ShopBathShampoo /></Suspense>
      },
      {
        path: 'comb',
        element: <Suspense fallback={Loading}><ShopBathComb /></Suspense>
      }
    ]
  )
}

export default toBathRouter