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

    const handleLogin = async() => {
        try {
            const response = await fetch('http://127.0.0.1:8000/users/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}, //リクエストボディがJSON形式であることを指定
                body: JSON.stringify({/*まだ空だがここにユーザー情報など*/})
            });
            if(!response.ok) {
                const errorData = await response.json();
                //バックエンドは{"detail": "ユーザー名が..."}のように詳細なエラーメッセージをJSON形式で返してくるのでそのオブジェクトを指定している
                throw new Error(errorData.detail || `HTTPエラー: ${response.status}`)
            }
            const loginData = await response.json() //.json()がPromiseを返すため非同期処理にする
            console.log(`APIレスポンス:${loginData.message}`)
        } catch (error) {
            error instanceof TypeError ? 
                alert('ネットワーク関連のエラーです') : 
                alert(`エラー:${error.message}`)
        }
    }
    return (
    <>
        <div className='header-with-menu'>
            <h1 className='header'>Pet Health Care</h1>
            <ul className='menu'>
                <li onClick={() => SetactiveMenuCompornent('health-care')}>健康管理</li>
                <li onClick={() => SetactiveMenuCompornent('question-to-AI')}>AIへの質問</li>
            </ul>
            <div className='user-management'>
                <button className='btn' onClick={handleLogin}>ログイン</button>
                <button className='btn'>新規登録</button>
            </div>
        </div>
        {activeMenuCompornent === 'health-care' ?? <HealthCare />}
        {activeMenuCompornent === 'question-to-AI' ?? <QuestionToAI />}
    </>
    )
}

export default HeaderWithMenu