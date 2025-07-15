import React from 'react'

import LinChart from '../../../chart/LinChart';
import PieChart from '../../../chart/PieChart';
import LoopingText from '../../../js/LoopingText';

// 주석말고 npm install chartjs-2 하세요



const AdminDashBoard = () => {
    const now = new Date();
    const formattedDate = now.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // 24시간 형식
    });
    return (
        <>
            <h1 className='dash_title'>대쉬보드</h1>
            <section class="hero-section">
                <div class="loop-container">
                    {/* <div class="item">관리자님 안녕하세요 오늘도 활기찬 하루 되세요!!! &nbsp;</div> */}
                    <LoopingText text={`관리자님 안녕하세요 오늘도 활기찬 하루 되세요!!! 현재 시각은 >> ${formattedDate} 입니다!!!`} />
                </div>
            </section >
            <div className='LineC'>
                <div className='LineC-con'>
                    월 매출 현황
                    <LinChart />
                </div>
                <div className="PieChart">
                    <div className="PieChart-con">
                        회원 연령별 분포
                        <PieChart />
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminDashBoard