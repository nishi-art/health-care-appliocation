import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import HeaderWithMenu from './compornent/HeaderWithMenu';
import Menu from './compornent/Menu';
import Login from './compornent/Login';
import NewRegistration from './compornent/NewRegistration';
import HealthCare from './compornent/HealthCare';
import QuestionToAI from './compornent/QuestionToAI';
import { checkAuthStatus } from './utils/auth';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authStatus = checkAuthStatus();
        setIsAuthenticated(authStatus);
    }, []);

    const handleRemoveToken = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={
                    isAuthenticated ? 
                        <Navigate to='/menu' /> :
                        <HeaderWithMenu
                         isAuthenticated={isAuthenticated}
                         handleRemoveToken={handleRemoveToken} 
                        />
                }/>
                <Route path='/login' element={
                    isAuthenticated ? 
                        <Navigate to='/' /> :
                        <>
                            <HeaderWithMenu 
                            isAuthenticated={isAuthenticated}
                            handleRemoveToken={handleRemoveToken} 
                            />
                            <Login setIsAuthenticated={setIsAuthenticated} />
                        </>
                } />
                <Route path='/register' element={
                    isAuthenticated ? 
                        <Navigate to='/' /> : 
                        <>
                            <HeaderWithMenu 
                            isAuthenticated={isAuthenticated} 
                            handleRemoveToken={handleRemoveToken}
                            />
                            <NewRegistration setIsAuthenticated={setIsAuthenticated} />
                        </>
                } />
                <Route path='/menu' element={
                    isAuthenticated ? 
                        <>
                            <HeaderWithMenu
                             isAuthenticated={isAuthenticated}
                             handleRemoveToken={handleRemoveToken} 
                            />
                            <Menu />
                        </> :
                        <Navigate to='/' />
                } />
                <Route path='healthcare' element={
                    isAuthenticated ? 
                        <>
                            <HeaderWithMenu
                             isAuthenticated={isAuthenticated}
                             handleRemoveToken={handleRemoveToken} 
                            />
                            <HealthCare />
                        </> :
                        <Navigate to='/' />
                } />
                <Route path='/question' element={
                    isAuthenticated ? 
                        <>
                            <HeaderWithMenu
                             isAuthenticated={isAuthenticated}
                             handleRemoveToken={handleRemoveToken} 
                            />
                            <QuestionToAI />
                        </> :
                        <Navigate to='/' />
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
