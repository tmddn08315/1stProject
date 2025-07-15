import React, { lazy, Suspense } from 'react'
import { Navigate } from 'react-router-dom'

const Loading = <div className='loading'>Loading...</div>
const LoginPage = lazy(() => import('../components/container/auth/AuthJoin'))


const toLoginOutRouter = () => {
  return (
    [
      {
        //auth
        path: '',
        element: <Navigate replace to={'login'} />
      },
      {
        //auth/login
        path: 'login',
        element: <Suspense fallback={Loading}><LoginPage /></Suspense>

      }
    ]
  )

}

export default toLoginOutRouter