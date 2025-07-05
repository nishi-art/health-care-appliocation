import React from 'react'
import { useNavigate } from 'react-router-dom'

const Menu = () => {
    const navigate = useNavigate();
    return (
        <>
            <ul className='menu'>
                <li onClick={() => navigate('/calender')}>健康管理</li>
                <li onClick={() => navigate('/question')}>AIへの質問</li>
            </ul>
        </>
    )
}

export default Menu