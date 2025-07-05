import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import { checkAuthStatus } from './utils/auth';
import Header from './compornent/Header';
import Menu from './compornent/Menu';
import HealthCareMenu from './compornent/HealthCareMenu';
import Login from './compornent/Login';
import NewRegistration from './compornent/NewRegistration';
import QuestionToAI from './compornent/QuestionToAI';
import MemoPaper from './compornent/MemoPaper';
import Calender from './compornent/Calender';
import CalculateCalorie from './compornent/CalculateCalorie';

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
                            <HealthCareMenu />
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
                <Route path='/calender/:year/:month/:day' element={
                    isAuthenticated ? 
                        <>
                            <Header
                             isAuthenticated={isAuthenticated} 
                             handleRemoveToken={handleRemoveToken}
                            />
                            <MemoPaper />
                        </> :
                        <Navigate to='/' />
                }>

                </Route>
                <Route path='calender' element={
                    isAuthenticated ?
                        <>
                            <Header
                             isAuthenticated={isAuthenticated} 
                             handleRemoveToken={handleRemoveToken}
                            />
                            <HealthCareMenu />
                            <Calender />
                        </> :
                        <Navigate to='/' />
                }>
                </Route>
                <Route path='calorie' element={
                    isAuthenticated ? 
                        <>
                            <Header
                             isAuthenticated={isAuthenticated} 
                             handleRemoveToken={handleRemoveToken}
                            />
                            <HealthCareMenu />
                            <CalculateCalorie />
                        </> :
                        <Navigate to='/' />
                }></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
