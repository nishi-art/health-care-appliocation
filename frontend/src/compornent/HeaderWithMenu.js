import React from 'react'
import { useNavigate } from 'react-router-dom';

const HeaderWithMenu = () => {
    const navigate = useNavigate();
    return (
    <>
        <div className='header-with-menu'>
            <h1 className='header'>Pet Health Care</h1>
            <div className='user-management'>
                <button className='btn' onClick={() => navigate('/login')}>ログイン</button>
                <button className='btn' onClick={() => navigate('/register')}>新規登録</button>
            </div>
        </div>
    </>
    )
}

export default HeaderWithMenu