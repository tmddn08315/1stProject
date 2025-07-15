import React, { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2';
import testdb from '../db/testdb.json'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
    const [charData, setCharData] = useState(null);

    useEffect(() => {
        const ageGroups = {
            // '10대 이하': 0,
            '10대': 0,
            '20대': 0,
            '30대': 0,
            '40대 이상': 0
        };

        testdb.members.forEach(member => {
            const rawAge = member.age;
            const age = parseInt(rawAge);

            if (!isNaN(age)) {
                // if (age < 10) ageGroups['10대 이하']++;
                if (age < 20) ageGroups['10대']++;
                else if (age < 30) ageGroups['20대']++;
                else if (age < 40) ageGroups['30대']++;
                else ageGroups['40대 이상']++;
            }
        });

        const labels = Object.keys(ageGroups);
        const values = Object.values(ageGroups);

        const ChartFormat = {
            labels: labels,
            datasets: [
                {
                    label: '회원 분포수',
                    data: values,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'purple',
                        'yellow',
                        'blue'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'purple',
                        'yellow',
                        'blue'
                    ],
                    borderWidth: 1
                }
            ]
        };
        setCharData(ChartFormat)

    }, [])
    if (!charData) return <p>Loading...</p>;

    return <Pie data={charData} />;

};

export default PieChart