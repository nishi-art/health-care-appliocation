import React from 'react'
import { useNavigate } from 'react-router-dom'

const HealthCareMenu = () => {
    const navigate = useNavigate();
    return (
        <> 
            <ul className='health-care-menu'>
                <li onClick={() => navigate('/calender')}>カレンダーと記録</li>
                <li onClick={() => navigate('/calorie')}>カロリー計算</li>
            </ul>
        </>
    )
}

export default HealthCareMenu