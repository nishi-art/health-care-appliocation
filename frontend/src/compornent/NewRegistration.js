import React, { useState } from 'react';
import eyeOpen from '../asset/eye-open.png';
import eyeClose from '../asset/eye-close.png';

const NewRegistration = ({setIsRegistered}) => {
    const [showPassword, setShowPassword] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleRegistration = async() => {
        setIsLoading(true);
        try {
            if(formData.email === '' || formData.password === '') {
                throw new Error('メールアドレスとパスワード両方を入力してください');
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
            setIsRegistered(true);
        } catch(error) {
            if(error.message === 'このメールアドレスは既に使用されています') {
                const visibility = document.querySelector('.error-message-registration');
                visibility.classList.remove('hidden')
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
                    <div className='error-message hidden error-message-registration'>
                        <p>※このメールアドレスは既に使用されています</p>
                    </div>
                    <div className='mail'>
                        <label htmlFor="email">メールアドレス</label>
                        <input type="email" id='email' name='email' onChange={handleInputChange} />
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