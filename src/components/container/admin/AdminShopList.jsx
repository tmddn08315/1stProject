import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Map } from 'react-kakao-maps-sdk';



const AdminShopList = () => {


    const [shoplist, setshoplist] = useState([])
    const [modalOpen, setModalOpen] = useState(false);
    // for modalSelectMap
    const [selectedShop, setSelectedShop] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const modalBackground = useRef();
    const mapRef = useRef(null);

    //paging 
    //CurrentPage
    const [currentPage, setCurrentPage] = useState(1);
    // Item Count Per Page 
    const itemsPerPage = 5;

    const totalPages = Math.ceil(shoplist.length / itemsPerPage)
    //Click Handler 
    const handleClick = (page) => {
        setCurrentPage(page)
    }


    // map으로 목록을 쏴주자 
    const getCurrentItems = () => {
        // 한페이지의 시작 인덱스
        const start = (currentPage - 1) * itemsPerPage;
        // 가져올 끝 인덱스
        const end = start + itemsPerPage;
        // 한페이당 가져올 아이템수
        return shoplist.slice(start, end);
    };



    // ✅ Kakao SDK 로드
    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            "//dapi.kakao.com/v2/maps/sdk.js?appkey=454ebd09b90c527f1da4544bf2ea90d7&autoload=false&libraries=services";
        script.async = true;
        script.async = true;
        script.onload = () => {
            window.kakao.maps.load(() => {
                console.log("✅ Kakao SDK 로드 완료");
            });
        };
        document.head.appendChild(script);
    }, []);

    // ✅ 점포 리스트 가져오기
    useEffect(() => {
        const shopListFn = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/shopList`);
                setshoplist(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        shopListFn();
    }, []);

    useEffect(() => {
        const shopListFn = async () => {
            const dataURL = `http://localhost:3001/shopList`
            try {
                const res = await axios.get(`${dataURL}`)
                setshoplist(res.data)

            } catch (err) {

            }
        }
        shopListFn()
    }, [])

    useEffect(() => {
        if (modalOpen && selectedShop && window.kakao?.maps) {
            setTimeout(() => {
                if (!mapRef.current) {
                    console.warn("❌ mapRef is still null");
                    return;
                }

                // ✅ 여기서 콘솔로 위치 확인
                console.log("✅ mapRef bounds:", mapRef.current.getBoundingClientRect());

                const geocoder = new window.kakao.maps.services.Geocoder();
                geocoder.addressSearch(selectedShop.address, (result, status) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                        const map = new window.kakao.maps.Map(mapRef.current, {
                            center: coords,
                            level: 3
                        });
                        new window.kakao.maps.Marker({ position: coords, map });
                        map.relayout();
                    }
                });
            }, 300);
        }
    }, [modalOpen, selectedShop]);


    return (
        <>
            <h1 className='adminshopList'>점포목록</h1>
            <table className="adminshopList-con">
                <tbody>
                    <tr>
                        <th>ID</th>
                        <th>주문처명</th>
                        <th>주문처주소</th>
                        <th>전화번호</th>
                        <th>팩스</th>
                        <th>보기</th>
                    </tr>
                    {
                        // shoplist && shoplist.map(el => {
                        getCurrentItems().map((el, idx) => {
                            return (
                                <tr>
                                    <td>{el.id}</td>
                                    <td>{el.name}</td>
                                    <td>{el.address}</td>
                                    <td>{el.phone}</td>
                                    <td>{el.fax}</td>
                                    <td className={'modal-td'}
                                        onClick={() => {
                                            setModalOpen(true)
                                            setSelectedShop(el)
                                            // mapRef.current.relayout();
                                        }}>Detail</td>
                                </tr>
                            )
                        })}
                </tbody>
            </table >
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
            {
                modalOpen && selectedShop &&
                <div className={'modal-container'} ref={modalBackground} onClick={e => {
                    if (e.target === modalBackground.current) {
                        setModalOpen(false);
                        setSelectedShop(null);


                    }
                }}>
                    <div className={'modal-content'}>
                        <div className={'memInfo'}> === SHOP INFO ===</div>
                        <div>점포명 : {selectedShop.name}</div>
                        <div>주소 : {selectedShop.address}</div>
                        <div>전화번호 : {selectedShop.phone}</div>
                        <div className='info'>팩스번호 : {selectedShop.fax}</div><br />
                        <div
                            className='modalmap'
                            ref={mapRef}
                            style={{ width: '100%', height: '300px' }}></div>

                        <button className={'modal-close-btn'} onClick={() => {
                            setModalOpen(false);
                            setSelectedShop(null);
                            // kakao.Map.relayout()
                        }}>
                            닫기
                        </button>

                    </div>
                </div >
            }
        </>
    )
}

export default AdminShopList