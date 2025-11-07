import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eyeOpen from '../asset/eye-open.png';
import eyeClose from '../asset/eye-close.png';

const NewRegistration = ({setIsAuthenticated}) => {
    const [showPassword, setShowPassword] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        user_id: '',
        password: '',
    });
    const [visibleErrorText, setVisibleErrorText] = useState(false);
    const navigate = useNavigate();

    const handleRegistration = async() => {
        setIsLoading(true);
        try {
            if(formData.user_id === '' || formData.password === '') {
                throw new Error('ユーザーIDとパスワード両方を入力してください');
            }
            const response = await fetch('http://127.0.0.1:8000/users/registration', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            if(!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTPエラー: ${response.status}`)
            }
            const registrationData = await response.json();
            console.log('APIレスポンス:', registrationData);
            setIsAuthenticated(true);
            navigate('/menu');
        } catch(error) {
            if(error.message === 'このユーザーIDは既に使用されています') {
                setVisibleErrorText(true);
            }
            else {
                error instanceof TypeError ? 
                alert('ネットワーク関連のエラーです') : 
                alert(`${error.name}:${error.message}`)
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
                    handleRegistration();}}>
                    {visibleErrorText && 
                        <div className='error-message'>
                            <p>※このユーザーIDは既に使用されています</p>
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
                    <input className='submit-btn' type="submit" value={isLoading ? "登録中..." : "新規登録"} disabled={isLoading} />
                </form>
                <img className='eye-img-registration' src={showPassword ? eyeClose : eyeOpen} 
                    onClick={() => showPassword ? setShowPassword(false) : setShowPassword(true)} 
                    alt="eye-image" />
            </div>
        </>
    )
}

export default NewRegistration