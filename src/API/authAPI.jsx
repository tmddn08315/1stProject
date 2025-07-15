import axios from 'axios'

const API_SERVER_URL = 'http://localhost:3001/members'
const API_SERVER_URL_ADDITEM = 'http://localhost:3001/products'

const API_SERVER_URL_ORDERS = 'http://localhost:3001/orders'


export const getOrdersSeletorApi = async () => {
    try {
        const ServerURL = await axios.get(`${API_SERVER_URL_ORDERS}`)
        return ServerURL.data
    } catch (err) {
        alert(err)
    }
}

//login
export const getMemberSelectorApi = async () => {
    try {
        const ServerURL = await axios.get(`${API_SERVER_URL}`)
        return ServerURL.data
    } catch (err) {
        alert(err)
    }
}


//join
export const insertMemberApi = async (user) => {
    try {
        const ServerURLForJoin = await axios.get(`${API_SERVER_URL}`, user) // join
        console.log(`Insert -> ` + ServerURLForJoin)
        return ServerURLForJoin
    } catch (err) {
        alert(err)
    }
}

//AddItem-join
export const addItemApi = async (item) => {
    try {
        const ServerURLForAddItem = await axios.get(`${API_SERVER_URL_ADDITEM}`, item)
        console.log(`Insert ->` + ServerURLForAddItem)
        return ServerURLForAddItem
    } catch (err) { alert(err) }
}

//ADDITEM SERACH
export const addItemSelectorApi = async () => {
    try {
        const ServerURL = await axios.get(`${API_SERVER_URL_ADDITEM}`)
        return ServerURL.data
    } catch (err) {
        alert(err)
    }
}
