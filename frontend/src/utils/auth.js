import { jwtDecode } from 'jwt-decode';

export const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    if(!token) return false;

    try {
        const decodedToken = jwtDecode(token);
        /* Date.now()は、ミリ秒を返すのに対して
           .expは秒のため単位を合わせる
         */
        const currentTime = Date.now() /1000;
        return decodedToken.exp > currentTime
    }
    catch (error) {
        console.log(`トークンの検証中にエラーが発生: ${error}`);
        return false;
    }
};