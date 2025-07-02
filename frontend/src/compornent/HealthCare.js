import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

const HealthCare = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const years = [currentYear+1, currentYear, currentYear-1, currentYear-2];
    const months = Array.from({length: 12}, (_,i)=>i+1);
    const [selectedYear, setSelectedYear] = useState(
        JSON.parse(localStorage.getItem('seletedYear') || currentYear));
    const [selectedMonth, setSelectedMonth] = useState(
        JSON.parse(localStorage.getItem('selectedMonth') || currentMonth));
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const firstDayOfWeek = new Date(selectedYear, selectedMonth -1 , 1).getDay();
    const blanks = Array.from({length: firstDayOfWeek});
    const [calenderData, setCalenderData] = useState({});
    const token = localStorage.getItem('token');
    const location = useLocation();
    const handleSelectYear = (e) => {
        setSelectedYear(Number(e.target.value));
    };
    const handleSelectMonth = (e) => {
        setSelectedMonth(Number(e.target.value));
    };
    const navigate = useNavigate();
    const fetchMonthlyMemos = async() => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/users/healthcare/list?year=${selectedYear}&month=${selectedMonth}`, {
                    headers: {'Authorization': `Bearer ${token}`}
                });
                if (!response.ok) throw new Error('カレンダーのデータ取得に失敗しました。');
                const data = await response.json();
                const hospitalMap = {};
                data.forEach((item) => {
                    hospitalMap[item.day] = item.hospital
                });
                setCalenderData(hospitalMap);
            } catch (error) {
                alert(error.message);
            }
        };
    useEffect(() => {
        fetchMonthlyMemos();
        localStorage.setItem('selectedYear', JSON.stringify(selectedYear));
        localStorage.setItem('selectedMonth', JSON.stringify(selectedMonth));
    }, [selectedYear, selectedMonth, location.pathname]);

    useEffect(() => {
        console.log(calenderData);
    }, [calenderData]);

    return (
        <>  
            <div className='health-care'>
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
                <div className='calender'>
                    {blanks.map((_, i) => (
                        <div className='blank' key={`blank-${i}`}></div>
                    ))}
                    {[...Array(daysInMonth)].map((_, i) => {
                        const dayOfWeek = (firstDayOfWeek + i) % 7;
                        let dayClass = 'day';
                        if (dayOfWeek === 0) dayClass += ' sunday';
                        if (dayOfWeek === 6) dayClass += ' saturday';
                        return (
                            <div 
                            className={dayClass} 
                            key={`${dayClass}-${i}`}
                            onClick={() => navigate(`/healthcare/${selectedYear}/${selectedMonth}/${i + 1}`)}>
                                <p className='day-text'>{i+1}</p>
                                <p className='hospital-schedule'>＜病院＞<br/>{calenderData[i+1] || "なし"}</p>
                            </div>
                        )
                    })
                    }
                </div>
            </div>
        </>
    )
}

export default HealthCare