import { checkAuthStatus } from "./auth";

//ログイン後の認証が必要なAPIリクエストで使用する
export const fetchWithAuth = async(url, options = {}, navigate) => {
    if (!checkAuthStatus()) {
        localStorage.removeItem('token');
        navigate('/');
        return;
    }
    const token = localStorage.getItem('token');
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
    }
    return response;
};