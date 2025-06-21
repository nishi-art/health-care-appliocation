import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Header from './compornent/Header';
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
                        <Header
                         isAuthenticated={isAuthenticated}
                         handleRemoveToken={handleRemoveToken} 
                        />
                }/>
                <Route path='/login' element={
                    isAuthenticated ? 
                        <Navigate to='/' /> :
                        <>
                            <Header 
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
                            <Header 
                            isAuthenticated={isAuthenticated} 
                            handleRemoveToken={handleRemoveToken}
                            />
                            <NewRegistration setIsAuthenticated={setIsAuthenticated} />
                        </>
                } />
                <Route path='/menu' element={
                    isAuthenticated ? 
                        <>
                            <Header
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
                            <Header
                             isAuthenticated={isAuthenticated}
                             handleRemoveToken={handleRemoveToken} 
                            />
                            <Menu />
                            <HealthCare />
                        </> :
                        <Navigate to='/' />
                } />
                <Route path='/question' element={
                    isAuthenticated ? 
                        <>
                            <Header
                             isAuthenticated={isAuthenticated}
                             handleRemoveToken={handleRemoveToken} 
                            />
                            <Menu />
                            <QuestionToAI />
                        </> :
                        <Navigate to='/' />
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
