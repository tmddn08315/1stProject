import React, { useEffect, useState } from 'react'
import AdminHeader from '../components/common/Admin/AdminHeader'
import AdminNav from '../components/common/Admin/AdminNav'
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'


const AdminLayout = () => {
    const { id } = useParams();
    const isLogin = useSelector(state => state.auth.isLogin)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const isAuthenticated = isLogin || isLoggedIn;
    const [memberObj, setMemberObj] = useState({}) // Object init

    const navi = useNavigate();
    const storedUserLoggedInformation = localStorage.getItem("isLoggedIn")


    useEffect(() => {

        const onAdminMemberListFn = async (memberId) => {
            // get Member match by User
            const dataURL = "http://localhost:3001/members"
            try {

                const res = await axios.get(`${dataURL}?id=${memberId}`)

                setMemberObj(res.data[0])

            } catch (err) {
                alert(err)
            }
        }

        onAdminMemberListFn()
        console.log(setMemberObj)

    }, [])

    if (!storedUserLoggedInformation) {
        return <Navigate to="/auth" replace />;
    }


    return (
        <>

            < div className="layoutRoot">
                <AdminHeader />
                <div className="layout-con">
                    <AdminNav />
                    <Outlet />
                </div>
            </div >
        </>
    )
}

export default AdminLayout