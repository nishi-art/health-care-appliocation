import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import HeaderWithMenu from './compornent/HeaderWithMenu';
import Menu from './compornent/Menu';
import Login from './compornent/Login';
import NewRegistration from './compornent/NewRegistration';
import HealthCare from './compornent/HealthCare';
import QuestionToAI from './compornent/QuestionToAI';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={
                    isAuthenticated ? 
                        <Navigate to='/menu' /> :
                        <HeaderWithMenu />
                }/>
                <Route path='/login' element={
                    isAuthenticated ? 
                        <Navigate to='/' /> :
                        <Login setIsAuthenticated={setIsAuthenticated} />
                } />
                <Route path='/register' element={
                    isAuthenticated ? 
                        <Navigate to='/' /> :
                        <NewRegistration setIsAuthenticated={setIsAuthenticated} />
                } />
                <Route path='/menu' element={
                    isAuthenticated ? 
                        <>
                            <HeaderWithMenu />
                            <Menu />
                        </> :
                        <Navigate to='/' />
                } />
                <Route path='healthcare' element={
                    isAuthenticated ? 
                        <HealthCare /> :
                        <Navigate to='/' />
                } />
                <Route path='/question' element={
                    isAuthenticated ? 
                        <QuestionToAI /> :
                        <Navigate to='/' />
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
