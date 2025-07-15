import React, { useEffect, useState } from 'react'
import { logOutUserFn } from '../../../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getMemberSelectorApi } from '../../../API/authAPI';
import axios from 'axios';





const AdminNav = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const isLogin = useSelector(state => state.auth.isLogin);
    const [memberObj, setMemberObj] = useState({}); // object init


    const storedUserLoggedInformation = localStorage.getItem("isLoggedIn")
    const dispatch = useDispatch();


    const handleLogout = () => {

        dispatch(logOutUserFn());
        nav('/auth')

    }


    const nav = useNavigate()


    useEffect(() => {

        if (storedUserLoggedInformation === "1") {
            setIsLoggedIn(true);
            console.log(`YOU ARE ALREADY LOGGED IN`)
        }
        if (localStorage.getItem("isLoggedIn")) {
            // Navigate("/shop");

        }


    }, [isLogin])

    return (

        <>
            {
                !storedUserLoggedInformation === '1' || !memberObj.role === "ADMIN" ?
                    // !isAuthenticated ?
                    (

                        nav('/auth')


                    ) : (
                        <>
                            <div className="admin_nav" onClick={handleLogout}> LOGOUT </div>
                            <div className="admin-nav-con"> 관리페이지 </div>
                        </>
                    )
            }
        </>
    )
}

export default AdminNav