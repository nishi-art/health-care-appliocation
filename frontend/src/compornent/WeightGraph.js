import React from 'react'
import { useState, useEffect } from 'react'

const WeightGraph = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const years = [currentYear+1, currentYear, currentYear-1, currentYear-2];
    const months = Array.from({length: 12}, (_,i)=>i+1);
    const [selectedYear, setSelectedYear] = useState(
        JSON.parse(localStorage.getItem('WeCoSeletedYear') || currentYear));
    const [selectedMonth, setSelectedMonth] = useState(
        JSON.parse(localStorage.getItem('WeCoSelectedMonth') || currentMonth));
    const [weightData, setWeightData] = useState({});
    const token = localStorage.getItem('token');
    const handleSelectYear = (e) => {
        setSelectedYear(Number(e.target.value));
    };
    const handleSelectMonth = (e) => {
        setSelectedMonth(Number(e.target.value));
    };
    const fetchMonthlyWeightMemos = async() => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/users/weight/list?year=${selectedYear}&month=${selectedMonth}`, {
                headers: {'Authorization': `Bearer ${token}`},
            });
            if (!response.ok) throw new Error('グラフのデータ取得に失敗しました。');
            const weightMap = {};
            const data = await response.json();
            data.forEach((item) => {
                weightMap[item.day] = item.weight
            });
            setWeightData(weightMap);
        } catch (error) {
            alert(error.message);
        }
    }
    useEffect(() => {
        fetchMonthlyWeightMemos();
        localStorage.setItem('WeCoSeletedYear', JSON.stringify(selectedYear));
        localStorage.setItem('WeCoSelectedMonth', JSON.stringify(selectedMonth));
    }, [selectedYear, selectedMonth,]);
    useEffect(() => {
        console.log(weightData);
    }, [weightData]);
    return (
        <>
            <div className='weight-graph'>
                <div className='select-year-month'>
                    <select className='select-year' size='1' value={selectedYear} onChange={handleSelectYear}>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <select className='select-month' size='1' value={selectedMonth} onChange={handleSelectMonth}>
                        {months.map((month) => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>
            </div>
        </>
    )
}

export default WeightGraph