import React from 'react'
import { useNavigate } from 'react-router-dom';

const Header = ({ isAuthenticated, handleRemoveToken }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        handleRemoveToken();
        navigate('/');
    }

    return (
    <>
        <div className='header-with-menu' onClick={() => navigate('/')}>
            <h1 className='header'>Pet Health Care</h1>
            {!isAuthenticated && 
            <div className='user-management'>
                <button className='btn' onClick={(e) => {
                    navigate('/login');
                    e.stopPropagation();
                }}>ログイン</button>
                <button className='btn' onClick={(e) => {
                    navigate('/register');
                    e.stopPropagation();
                }}>新規登録</button>
            </div>
            }
            {isAuthenticated && 
            <div className='user-logout'>
                <button className='btn' onClick={(e) => {
                    handleLogout();
                    e.stopPropagation();
                }}>ログアウト</button>
            </div>
            }
        </div>
    </>
    )
}

export default Header