import React, { useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'


const BathLayout = () => {
    useEffect(() => {
        window.scrollTo(0,0)
    },[])
    
  return (
    <>
    {/* <div className="header">

    <Header/>
    </div> */}
    <div className="toy">
      <div className="toy-con">
          <div className="toy-wrap">
              <div className="head-title">
                  <h1><Link to={'/shop/bath'}>GROOMING</Link></h1>
              </div>
              <div className="toy-filter">
                  <div className="toy-filter-type">
                      <ul>
                          <li>
                              <NavLink to={'/shop/bath'} end className={({isActive}) => isActive ? 'navToy active' : 'navToy'}>ALL</NavLink>
                          </li>
                          <li>
                              <NavLink to={'/shop/bath/shampoo'} className={({isActive}) => isActive ? 'navToy active' : 'navToy'}>Shampoo</NavLink>
                          </li>
                          <li>
                              <NavLink to={'/shop/bath/comb'} className={({isActive}) => isActive ? 'navToy active' : 'navToy'}>Comb & Brush</NavLink>
                          </li>
                      </ul>
                  </div>
              </div>
              <Outlet/>
          </div>
        </div>
    </div>
    <div className="footer">

    <Footer/>
    </div>
    </>
  )
}

export default BathLayout