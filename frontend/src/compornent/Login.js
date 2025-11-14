import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eyeOpen from '../asset/eye-open.png'
import eyeClose from '../asset/eye-close.png'
import { fetchWithAuth } from '../utils/authRequest';

const Login = ({setIsAuthenticated}) => {
    const [showPassword, setShowPassword] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        user_id: '',
        password: '',
    });
    const [visibleErrorText, setVisibleErrorText] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async() => {
        setIsLoading(true);
        try {
            if(formData.email === '' || formData.password === '') {
                throw new Error('ユーザーIDとパスワード両方を入力してください');
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
            const loginData = await response.json(); //.json()がPromiseを返すため非同期処理にする
            console.log(`APIレスポンス:${loginData.message}`);

            //トークンをローカルストレージに保存
            localStorage.setItem('token', loginData.access_token);

            //認証済みユーザー情報の取得
            const userResponse = await fetchWithAuth('http://127.0.0.1:8000/users/me', navigate);
            if(!userResponse.ok) {
                throw new Error('ユーザー情報の取得に失敗しました');
            }
            setIsAuthenticated(true);
            navigate('/menu');
        } catch (error) {
            if(error.message === 'ユーザーIDまたはパスワードが正しくありません') {
                setVisibleErrorText(true);
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
                    {visibleErrorText && 
                        <div className='error-message'>
                            <p>※ユーザーIDまたはパスワードが間違っています</p>
                        </div>
                    }
                    <div className='user-id'>
                        <label htmlFor="user_id">ユーザーID</label>
                        <input type="text" id='user_id' name='user_id' onChange={handleInputChange} />
                    </div>
                    <div className='password'>
                        <label htmlFor="password">パスワード</label>
                        <input type={showPassword ? 'password' : 'text'} id='password' name='password' onChange={handleInputChange} />
                    </div>
                    <input className='submit-btn' type="submit" value={isLoading ? "ログイン中..." : "ログイン"} disabled={isLoading} />
                </form>
                <img className='eye-img' src={showPassword ? eyeClose : eyeOpen} 
                    onClick={() => showPassword ? setShowPassword(false) : setShowPassword(true)} 
                    alt="eye-image" />
            </div>
        </>
    )
}

export default Login