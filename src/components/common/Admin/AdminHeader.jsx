import React from 'react'
import { useNavigate } from 'react-router-dom'

const AdminHeader = () => {

    const Navigate = useNavigate()
    const liClick = (e) => {
        e.preventDefault();
        const ct = e.currentTarget.innerText

        if (ct === 'MEMBERS')
            Navigate('/admin/members')
        else if (ct === 'DASHBOARD')
            Navigate('/admin/dashboard')
        else if (ct === 'PAYMENTS')
            Navigate('/admin/paym')
        else if (ct === 'SHOPLIST')
            Navigate('/admin/shop_list')
        else if (ct === 'PRODUCTS')
            Navigate('/admin/product')
        else if (ct === 'PRODUCTS-ADD')
            Navigate('/admin/product_add')
        else if (ct === 'SHOPLINK')
            Navigate('/shop')
    }

    return (
        <>
            <div className="adminheader">
                <ul id='menu'>
                    <li><img src='/images/logo.png' /></li>
                    <li onClick={liClick}>MEMBERS</li>
                    <li onClick={liClick}>DASHBOARD</li>
                    <li onClick={liClick}>PAYMENTS</li>
                    <li onClick={liClick}>SHOPLIST</li>
                    <li onClick={liClick}>PRODUCTS</li>
                    <li onClick={liClick}>PRODUCTS-ADD</li>
                    <li onClick={liClick}>SHOPLINK</li>
                </ul>
            </div>
        </>
    )
}

export default AdminHeader