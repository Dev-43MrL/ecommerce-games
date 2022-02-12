import { getToken, hasExpireToken } from "../api/token";

export async function authFetch(url, params, logout){
    const token=getToken();

    if(!token){
        logout(); // Usuario no logueado
    }else{
        if(hasExpireToken(token)){
            //Token caducado
            logout();
        }else{
            const paramsTemp={
                ...params,
                headers:{
                    ...params?.headers,
                    'x-token': `${token}`,
                },
            };
            try {
                const response =await fetch(url, paramsTemp);
                const result =await response.json();
                
                return result;
            } catch (error) {
                return error;
            }
        }
    }
}