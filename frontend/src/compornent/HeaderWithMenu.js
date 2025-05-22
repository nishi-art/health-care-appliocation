import React from 'react'
import { useState, useEffect } from 'react'
import HealthCare from './HealthCare';
import QuestionToAI from './QuestionToAI';

const HeaderWithMenu = () => {
    const [activeMenuCompornent, SetactiveMenuCompornent] = useState(() => 
        JSON.parse(localStorage.getItem('activeMenuCompornent')) || '' );
    useEffect(() => {
        localStorage.setItem('activeMenuCompornent', JSON.stringify(activeMenuCompornent));
    }, [activeMenuCompornent]);
    return (
    <>
        <div className='header-with-menu'>
            <h1 className='header'>Pet Health Care</h1>
            <ul className='menu'>
                <li onClick={() => SetactiveMenuCompornent('health-care')}>健康管理</li>
                <li onClick={() => SetactiveMenuCompornent('question-to-AI')}>AIへの質問</li>
            </ul>
            <button className='rogin-button'>ログイン</button>
        </div>
        {activeMenuCompornent === 'health-care' ?? <HealthCare />}
        {activeMenuCompornent === 'question-to-AI' ?? <QuestionToAI />}
    </>
    )
}

export default HeaderWithMenu