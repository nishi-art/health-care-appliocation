import React from 'react'
import { Link } from 'react-router-dom'

const HealthCareMenu = () => {
    return (
        <> 
            <ul className='health-care-menu'>
                <Link className='calender-link' to="/calender">カレンダーと記録</Link>
            </ul>
        </>
    )
}

export default HealthCareMenu