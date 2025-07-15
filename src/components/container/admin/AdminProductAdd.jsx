import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { addItemSelectorApi } from '../../../API/authAPI'
import { useNavigate } from 'react-router-dom'

const addData = {
    title: '',
    category: '',
    price: ''
}


const AdminProductAdd = () => {

    const [addItem, setAddItem] = useState(addData)
    const [subOp, setSubOp] = useState([])
    //for Search 



    const navi = useNavigate();
    const onInputchangeFn = (e) => {
        const name = e.target.name;
        const value = e.target.value
        setAddItem(prev => ({ ...prev, [name]: value }));
        // 이 코드는 이전 상태를 기반으로 새로운 상태를 만들면서 
        // 특정 속성의 값을 업데이트하는 데 사용됩니다. 
        // 스프레드 연산자를 사용하여 불변성을 유지하면서 
        // 안전하게 상태를 변경할 수 있습니다.

        if (name === "category") {
            const options = {
                food: ["건식사료", "습식사료", "생식"],
                snack: ["육포", "트릿", "기타"],
                toy: ["씹는장난감", "노즈워크", "공", "터그", "인형", "기타"],
                bath: ["샴푸", "린스", "수건", "드라이어", "브러시"],
                house: ["고양이", "강아지", "소형펫"],
                fashion: ["상의", "하의", "올인원", "모자", "소품", "머플러", "안경"]
            };
            setSubOp(options[value] || [
            ]);
            // 선택된 category 바뀌면 sub 도 초기화
            setAddItem(prev => ({ ...prev, sub: '' }));
        }
    };
    const uploadFile = () => {
        // temp function
        return
    }
    const addItemFn = (e) => {
        e.preventDefault();
        const dataURL = `http://localhost:3001/products`
        if (!addItem.title) { alert(`상품명을 입력해주세요`); return; }
        if (!addItem.category) { alert(`카테고리를 선택해주세요`); return; }
        if (!addItem.sub) { alert(`서브카테고리를 선택해주세요`); return; }
        if (!addItem.price) { alert(`가격을 입력해주세요`); return; }

        const AddItemAxiosFn = async () => {
            try {
                alert(`상품등록을 시도합니다. 잠시만 기다려주세요...`)
                const resAPI = await addItemSelectorApi()

                if (resAPI === null) { alert(`상품등록에 실패했습니다. 나중에 다시 시도해주세요...`); return }
                // DB Primary KEY
                const maxId = resAPI.reduce((max, item) => {
                    const idNum = parseInt(item.id, 10); // 뒤에 10은 진법
                    return idNum > max ? idNum : max
                }, 0)

                const newId = { ...addItem, id: (maxId + 1).toString() }

                const AddItemOK = await axios.post(`${dataURL}`, newId)
                navi('/admin/product')

            } catch (err) { alert(err) }
        }
        AddItemAxiosFn()
    }



    useEffect(() => {
    })


    return (
        <div className="item-add">
            <h2>상품추가</h2>
            <div className="item-add-con">
                <form>
                    {/* <div className='item-input'> ID :
                        <input type="text" name="id" id="id" onChange={onInputchangeFn} /> </div> */}
                    <div className='item-input'> 상품명 :
                        <input type="text" name="title" id="title" value={addItem.title} onChange={onInputchangeFn} /> </div>
                    <div className='item-input'> 가격 :
                        <input type="text" name="price" id="price" value={addItem.price} onChange={onInputchangeFn} /> </div>
                    <div className='item-input'>
                        <li>
                            <label htmlFor="category">카테고리</label>
                            <select name="category" id="category" value={addItem.category}
                                onChange={onInputchangeFn}>
                                <option value='food' id='food' name='food' defaultValue>사료</option>
                                <option value="snack" id='snack' name='snack'>간식</option>
                                <option value="toy" id='toy' name='toy'>장난감</option>
                                <option value="bath" id='bath' name='bath'>목욕</option>
                                <option value="house" id='house' name='house'>하우스</option>
                                <option value="fashion" id='fashion' name='fashion'>패션</option>
                            </select>
                        </li>
                    </div>
                    {/* ✅ category 선택 시 서브 옵션 렌더링 */}
                    {subOp.length > 0 && (
                        <div className='item-input'>
                            <label htmlFor="sub">세부항목</label>
                            <select name="sub" id="sub" value={addItem.sub} onChange={onInputchangeFn}>
                                <option value="" id='subNo'>세부항목 선택</option>
                                {subOp.map((opt, idx) => (
                                    <option key={idx} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className='item-input'> 이미지업로드

                        <button onClick={uploadFile}>업로드</button>
                    </div>
                </form>

                <button onClick={addItemFn}>추가</button>
            </div>
        </div>
    )
}

export default AdminProductAdd