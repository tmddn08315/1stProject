import React, { lazy, Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import toToyRouter from './toToyRouter'
import toBathRouter from './toBathRouter'
import HouseDetail from '../components/container/Detail/HouseDetail'
import FashionDetail from '../components/container/Detail/FashionDetail'
import FoodDetail from '../components/container/Detail/FoodDetail'
import SnackDetail from '../components/container/Detail/SnackDetail'

const Loading = <div className='loading'>Loading...</div>

const ShopMain = lazy(() => import(`../components/container/shop/ShopMainContainer`))
const ShopFood = lazy(() => import(`../components/container/shop/ShopFoodContainer`))
const ShopSnack = lazy(() => import(`../components/container/shop/ShopSnackContainer`))
const ShopToy = lazy(() => import(`../components/container/shop/ShopToyContainer`))
const ShopBath = lazy(() => import(`../components/container/shop/ShopBathContainer`))
const ShopHouse = lazy(() => import(`../components/container/shop/ShopHouseContainer`))
const ShopFashion = lazy(() => import(`../components/container/shop/ShopFashionContainer`))

// yj
const ToyLayout = lazy(() => import('../layout-yyj/ToyLayout'))
const BathLayout = lazy(() => import('../layout-yyj/BathLayout'))
// yj-상세정보
const ToyDetail = lazy(() => import(`../components/container/shop/toy-yyj/ToyDetail`))
const BathDetail = lazy(() => import('../components/container/shop/bath-yyj/BathDetail'))

const toShopRouter = () => {
    return (
        [
            {
                // /shop,
                path: '',
                element: <Navigate replace to={'main'} />
            },
            {
                path: 'main',
                element: <Suspense fallback={Loading}><ShopMain /></Suspense>
            },
            {
                // shop/food
                path: 'food',
                element: <Suspense fallback={Loading}><ShopFood /></Suspense>
            },
            {
                path: 'food/:id',
                element: <Suspense fallback={Loading}><FoodDetail /></Suspense>
            },
            {
                // shop/snack
                path: 'snack',
                element: <Suspense fallback={Loading}><ShopSnack /></Suspense>
            },
            {
                path: 'snack/:id',
                element: <Suspense fallback={Loading}><SnackDetail /></Suspense>
            },
            {
                // shop/toy
                path: 'toy',
                element: <Suspense fallback={Loading}><ToyLayout /></Suspense>,
                children: toToyRouter()
            },
            {
              path: 'toy/detail/:id',
              element: <Suspense fallback={Loading}><ToyDetail/></Suspense>
            },
            {
                // shop/bath
                path: 'bath',
                element: <Suspense fallback={Loading}><BathLayout /></Suspense>,
                children: toBathRouter()
            },
            {
              path: 'bath/detail/:id',
              element: <Suspense fallback={Loading}><BathDetail/></Suspense>
            },
            {
                // shop/toy
                path: 'house',
                element: <Suspense fallback={Loading}><ShopHouse /></Suspense>
            },
            {
                path: 'house/:id',
                element: <Suspense fallback={Loading}><HouseDetail /></Suspense>
            },
            {
                // shop/toy
                path: 'fashion',
                element: <Suspense fallback={Loading}><ShopFashion /></Suspense>
            },
            {
                path: 'fashion/:id',
                element: <Suspense fallback={Loading}><FashionDetail /></Suspense>
            }

        ]
    )
}

export default toShopRouter