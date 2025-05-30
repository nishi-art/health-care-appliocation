import React from 'react'
import { useState, useEffect } from 'react'
import HealthCare from './HealthCare';
import QuestionToAI from './QuestionToAI';
import Login from './Login';
import NewRegistration from './NewRegistration';

const HeaderWithMenu = () => {
    const [activeMenuCompornent, SetactiveMenuCompornent] = useState(() => 
        JSON.parse(localStorage.getItem('activeMenuCompornent')) || '' );
    const [visibleLogin, setVisibleLogin] = useState(() => 
        JSON.parse(localStorage.getItem('visibleLogin')) || false);
    const [visibleNewRegistration, setVisibleNewRegistration] = useState(() => 
        JSON.parse(localStorage.getItem('visibleNewRegistration')) || false);

    useEffect(() => {
        localStorage.setItem('activeMenuCompornent', JSON.stringify(activeMenuCompornent));
        localStorage.setItem('visibleLogin', JSON.stringify(visibleLogin));
        localStorage.setItem('visibleNewRegistration', JSON.stringify(visibleNewRegistration));
    }, [activeMenuCompornent, visibleLogin, visibleNewRegistration]);

    return (
    <>
        <div className='header-with-menu'>
            <h1 className='header'>Pet Health Care</h1>
            <ul className='menu'>
                <li onClick={() => SetactiveMenuCompornent('health-care')}>健康管理</li>
                <li onClick={() => SetactiveMenuCompornent('question-to-AI')}>AIへの質問</li>
            </ul>
            <div className='user-management'>
                <button className='btn' onClick={() => {setVisibleLogin(true);setVisibleNewRegistration(false);}}>ログイン</button>
                <button className='btn' onClick={() => {setVisibleNewRegistration(true);setVisibleLogin(false);}}>新規登録</button>
            </div>
        </div>
        {activeMenuCompornent === 'health-care' ?? <HealthCare />}
        {activeMenuCompornent === 'question-to-AI' ?? <QuestionToAI />}
        {visibleLogin && <Login />}
        {visibleNewRegistration && <NewRegistration />}
    </>
    )
}

export default HeaderWithMenu