import React, { useState } from 'react';
import eyeOpen from '../asset/eye-open.png';
import eyeClose from '../asset/eye-close.png';

const NewRegistration = () => {
    const [showPassword, setShowPassword] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegistration = async() => {
        setIsLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/users/registration', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({})
            });
            if(!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTPエラー: ${response.status}`)
            }
            const registrationData = await response.json();
            console.log(`APIレスポンス:${registrationData.message}`);
        } catch(error) {
            error instanceof TypeError ? 
                alert('ネットワーク関連のエラーです') : 
                alert(`エラー:${error.message}`)
        } finally {
            setIsLoading(false);
        }
    }

    return (
    <>
        <div className='form'>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleRegistration();}}>
                <div className='mail'>
                    <label htmlFor="email">メールアドレス</label>
                    <input type="email" id='email' name='email' />
                </div>
                <div className='password'>
                    <label htmlFor="password">パスワード</label>
                    <input type={showPassword ? 'password' : 'text'} id='password' name='password' />
                </div>
                <input className='submit-btn' type="submit" value={isLoading ? "登録中..." : "新規登録"} disabled={isLoading} />
            </form>
            <img className='eye-img' src={showPassword ? eyeClose : eyeOpen} 
                onClick={() => showPassword ? setShowPassword(false) : setShowPassword(true)} 
                alt="eye-image" />
        </div>
    </>
    )
}

export default NewRegistration