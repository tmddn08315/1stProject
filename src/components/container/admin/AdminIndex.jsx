import React from 'react'
import { useNavigate } from 'react-router-dom';

const AdminIndex = () => {
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
        else if (ct === 'INSERT ITEM')
            Navigate('/admin/product_add')


    }
    return (
        <>

            <div className="adminIndex">
                <div className="menu" onClick={liClick}>MEMBERS</div>
                <div className="menu" onClick={liClick}>DASHBOARD</div>
                <div className="menu" onClick={liClick}>PAYMENTS</div>
                <div className="menu" onClick={liClick}>SHOPLIST</div>
                <div className="menu" onClick={liClick}>PRODUCTS</div>
                <div className="menu" onClick={liClick}>INSERT ITEM</div>
            </div>
        </>
    )
}

export default AdminIndex