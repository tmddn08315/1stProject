import React, { useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'


const ToyLayout = () => {
    useEffect(() => {
        window.scrollTo(0,0)
    }, [])

  return (
    <>
    
    <div className="toy">
      <div className="toy-con">
          <div className="toy-wrap">
              <div className="head-title">
                  <h1><Link to={'/shop/toy'}>TOY</Link></h1>
              </div>
              <div className="toy-filter">
                  <div className="toy-filter-type">
                   <ul>
                          <li>
                              <NavLink to={'/shop/toy'} end className={({ isActive }) => isActive ? 'navToy active' : 'navToy'}>ALL</NavLink>
                          </li>
                          <li>
                              <NavLink to={'/shop/toy/ball'} className={({ isActive }) => isActive ? 'navToy active' : 'navToy'}>Ball</NavLink>
                          </li>
                          <li>
                              <NavLink to={'/shop/toy/tug'} className={({ isActive }) => isActive ? 'navToy active' : 'navToy'}>Tug toy</NavLink>
                          </li>
                          <li>
                              <NavLink to={'/shop/toy/stuffed'} className={({ isActive }) => isActive ? 'navToy active' : 'navToy'}>Stuffed toy</NavLink>
                          </li>   
                      </ul>
                  </div>
              </div>
              <Outlet/>
          </div>
        </div>
    </div>
    
    </>
  )
}

export default ToyLayout