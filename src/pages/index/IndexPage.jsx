import React from 'react'
import Footer from '../../components/common/Footer'
import Header from '../../components/common/Header'
import { Link } from 'react-router-dom'

const IndexPage = () => {

    return (
        <>
            <div className="index">
                <video className='bg_v' autoPlay muted loop>
                    <source src="./videos/dgbg.mp4" type="video/mp4" />
                </video>
                <div className="index-title">
                    <h1> EVERYTHING ABOUT PET</h1>
                </div>
                <div className="index-con">

                    <Link to={'/shop'} className="text-draw"
                        data-text="S H O P">S H O P</Link>

                </div>
            </div>
        </>








    )
}

export default IndexPage