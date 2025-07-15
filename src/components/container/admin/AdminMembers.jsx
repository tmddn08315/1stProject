import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'

import { Navigate, useNavigate, useParams } from 'react-router-dom'


const AdminMembers = () => {

    const [memberObj, setMemberObj] = useState({}) // Object init
    const [memberList, setMemberList] = useState([])    //Array Init
    const [modlaOpen, setModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all"); // 카테고리 셀렉터 
    // const [join, setjoin] = useState(joinData)
    const modalBackground = useRef();

    const navigate = useNavigate()


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // if you use Category Function 
    const filteredList = selectedCategory === 'all'
        ? memberList
        : memberList.filter(item => item.category === selectedCategory);

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    const handleClick = (page) => {
        setCurrentPage(page);
    };
    // 전체 Item 페이징
    const getCurrentMembers = () => {
        // Index Start for Per PAges
        const start = (currentPage - 1) * itemsPerPage;
        // bring END Index
        const end = start + itemsPerPage;
        // Bring Items Per Page
        return memberList.slice(start, end);
    };


    const onInputchangeFn = (e) => {
        const name = e.target.name;
        const value = e.target.value
        setMemberObj(prev => ({ ...prev, [name]: value }));
    }



    // Link to > admin/memberList/(Modal)=>user.id
    const param = useParams()

    useEffect(() => {
        const onAdminMemberListFn = async (memberId) => {
            // get Member match by User
            const dataURL = `http://localhost:3001/members`
            try {
                const res = await axios.get(`${dataURL}`)
                const res2 = await axios.get(`${dataURL}?id=${memberId}`)

                setMemberList(res.data)
                setMemberObj(res2.data[0])

            } catch (err) {
                alert(err)
            }
        }
        onAdminMemberListFn(param.id)
    }, [])

    const updateOkFn = async (e) => {

        const dataURL = `http://localhost:3001/members`

        const updateAxiosFn = async (updateData) => {
            try {
                // isMmember Exist? -> if exist same ID -> fix memberInfo
                const res1 = await axios.get(`${dataURL}`)
                const num = res1.data.findIndex(el => {
                    return el.id === memberObj.id
                })
                if (num === -1) {
                    alert(`Member does not exist!`)
                    return
                }
                alert(`try fix Member Info...`)
                const res = await axios.put(`${dataURL}/${updateData.id}`, updateData)
                navigate('/admin')
                console.log(res + ' <<< 회원 수정 res')
            } catch (err) { }
        }
        updateAxiosFn(memberObj)
    }

    const deleteOkFn = (e) => {
        const dataURL = `http://localhost:3001/members`

        const deleteAxiosFn = async (memberId) => {
            try {
                const res1 = await axios.get(`${dataURL}`)  // Index Search
                const num = res1.data.findIndex(el => {
                    return el.id === memberObj.id
                })
                if (num === -1) {
                    alert(`Member does not exist!`)
                    return
                }
                alert(`Delete Member`)
                const res = await axios.delete(`${dataURL}/${memberId}`)
                navigate(`/admin`)
            } catch (err) { }
        }
        deleteAxiosFn(memberObj.id)
    }






    return (
        // router Linking

        <>
            <h1 className='adminTitle'>회원목록</h1>
            <table className="admin-memberList-con">
                <tbody>
                    <tr>
                        <th>ID</th>
                        <th>userEmail</th>
                        <th>userPw</th>
                        <th>userName</th>
                        <th>age</th>
                        <th>address</th>
                        <th>role</th>
                        <th>보기</th>
                    </tr>
                    {/* {memberList && memberList.map(el => { */}
                    {getCurrentMembers().map((el, idx) => {
                        return (
                            <tr>
                                <td>{el.id}</td>
                                <td>{el.userEmail}</td>
                                <td>{el.userPw}</td>
                                <td>{el.userName}</td>
                                <td>{el.age}</td>
                                <td>{el.address}</td>
                                <td>{el.role}</td>
                                <td className={'modal-td'}
                                    onClick={() => {
                                        setMemberObj(el)
                                        setModalOpen(true)
                                    }}>Detail</td>
                            </tr>
                        )
                    })}

                </tbody>
            </table>
            {
                modlaOpen &&
                <div className={'modal-container'} ref={modalBackground} onClick={e => {
                    if (e.target === modalBackground.current) {
                        setModalOpen(false);
                    }
                }}>

                    <div className={'modal-content'}>
                        <div className={'memInfo'}> === MEMBER INFO ===</div>
                        {memberObj.role === "ADMIN" ? <>관리자님 안녕하세요!</> : <>일반회원</>}
                        <ul>
                            <li className='modal-li'>
                                <label htmlFor="id">ID</label>
                                <input type="text" name="id" id="id" value={memberObj.id} readOnly
                                    onChange={onInputchangeFn} />
                            </li>
                            <li className='modal-li'>
                                <label htmlFor="userEmail">이메일</label>   {/* DO NOT FIX EMAIL*/}
                                <input type="email" name="userEmail" id="userEmail" placeholder='EMAIL' readOnly
                                    value={memberObj.userEmail}
                                    onChange={onInputchangeFn} />
                            </li>
                            <li className='modal-li'>
                                <label htmlFor="userName">이름</label>
                                <input type="text" name='userName' id='userName' placeholder='NAME'
                                    value={memberObj.userName} onChange={onInputchangeFn} />
                            </li>
                            <li className='modal-li'>
                                <label htmlFor="userPw">비밀번호</label>
                                <input type="text" name='userPw' id='userPw' placeholder='PASSWORD'
                                    value={memberObj.userPw} onChange={onInputchangeFn} />
                            </li>
                            <li className='modal-li'>
                                <label htmlFor="address">주소</label>
                                <input type="text" name='address' id='address' placeholder='address'
                                    value={memberObj.address} onChange={onInputchangeFn} />
                            </li>
                            <li className='modal-li'>
                                <label htmlFor="age">나이</label>
                                <input type="text" name='age' id='age' placeholder='age'
                                    value={memberObj.age} onChange={onInputchangeFn} />
                            </li>
                            <li className='modal-li'>
                                <label htmlFor="role">권한</label>
                                <select name="role" id="role"
                                    value={memberObj.role} onChange={onInputchangeFn}>
                                    <option value='ROLE_MEMBER' defaultValue>MEMBER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </li>
                        </ul>



                        <button className={'modal-btn'} onClick={updateOkFn}>수정</button>
                        <button className={'modal-btn'} onClick={deleteOkFn}>삭제</button><br />
                        <button className={'modal-close-btn'} onClick={() => setModalOpen(false)}>
                            닫기
                        </button>
                    </div>
                </div >
            }
            <div className="bottom">
                {/* Preview Page */}

                <button onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1}>
                    &lt; Prev
                </button>

                {[...Array(totalPages)].map((_, idx) => {
                    // idx Start from 0
                    const page = idx + 1;
                    return (
                        <button
                            key={page}
                            onClick={() => handleClick(page)}
                        >{page}</button>
                    );
                })}
                {/* after ... page */}
                <button onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next &gt;</button>

            </div>

        </>
    )
}

export default AdminMembers