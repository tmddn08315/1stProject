import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import testdb from '../db/testdb.json';


import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
);

const LinChart = () => {

    // sales 배열에서 month와 salesMount 값을 추출
    const labels = testdb.sales.map(item => item.month);    // 월별 레이블 생성
    const dataPoints = testdb.sales.map(item => Number(item.salesMount))    //


    const data = {
        labels: labels,
        datasets: [
            {
                label: '2025년도 월매출',
                data: dataPoints,
                fill: false,
                borderColor: 'RED',
                tension: 0.1
            }
        ]
    };

    return <Line data={data} />;
};

export default LinChart