import React from 'react'
import { Link } from 'react-router-dom'

const Menu = () => {
    return (
        <>
            <ul className='menu'>
                <Link className='calender-link' to="/calender">健康管理</Link>
                <Link className='question-link' to="/question">AIへの質問</Link>
            </ul>
        </>
    )
}

export default Menu