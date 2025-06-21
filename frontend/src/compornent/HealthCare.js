import React from 'react'
import { useState } from 'react'

const HealthCare = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const years = [currentYear, currentYear-1, currentYear-2];
    const months = Array.from({length: 12}, (_,i)=>i+1);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const handleSelectYear = (e) => {
        setSelectedYear(Number(e.target.value));
    };
    const handleSelectMonth = (e) => {
        setSelectedMonth(Number(e.target.value));
    };

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
            </div>
        </>
    )
}

export default HealthCare