import React, { useEffect, useState } from 'react';
import eyeOpen from '../asset/eye-open.png'
import eyeClose from '../asset/eye-close.png'

const Login = () => {
    const [showPassword, setShowPassword] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleLogin = async() => {
        setIsLoading(true);
        try {
            if(formData.email === '' || formData.password === '') {
                throw new Error("メールアドレスとパスワード両方を入力してください");
            }
            const response = await fetch('http://127.0.0.1:8000/users/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}, //リクエストボディがJSON形式であることを指定
                body: JSON.stringify(formData)
            });
            if(!response.ok) {
                const errorData = await response.json();
                //バックエンドは{"detail": "ユーザー名が..."}のように詳細なエラーメッセージをJSON形式で返してくるのでそのオブジェクトを指定している
                throw new Error(errorData.detail || `HTTPエラー: ${response.status}`)
            }
            const loginData = await response.json() //.json()がPromiseを返すため非同期処理にする
            console.log(`APIレスポンス:${loginData.message}`)
        } catch (error) {
            if(error.message === 'メールアドレスまたはパスワードが正しくありません') {
                const visibility = document.querySelector('.error-message-login');
                visibility.classList.remove('hidden')
            }
            else {
                error instanceof TypeError ? 
                alert('ネットワーク関連のエラーです') : 
                alert(`エラー:${error.message}`)
            }
        } finally {
            setIsLoading(false);
        }
    }
    
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    return (
        <>
            <div className='form'>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();}}>
                    <div className='error-message hidden error-message-login'>
                        <p>※メールアドレスまたはパスワードが間違っています</p>
                    </div>
                    <div className='mail'>
                        <label htmlFor="email">メールアドレス</label>
                        <input type="email" id='email' name='email' onChange={handleInputChange} />
                    </div>
                    <div className='password'>
                        <label htmlFor="password">パスワード</label>
                        <input type={showPassword ? 'password' : 'text'} id='password' name='password' onChange={handleInputChange} />
                    </div>
                    <a className='forgot-password' href='https://www.deepl.com/ja/translator'>パスワードをお忘れの方</a>
                    <input className='submit-btn' type="submit" value={isLoading ? "ログイン中..." : "ログイン"} disabled={isLoading} />
                </form>
                <img className='eye-img-login' src={showPassword ? eyeClose : eyeOpen} 
                    onClick={() => showPassword ? setShowPassword(false) : setShowPassword(true)} 
                    alt="eye-image" />
            </div>
        </>
    )
}

export default Login