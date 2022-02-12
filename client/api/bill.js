import { BASE_PATH } from "../utils/constants";
import { authFetch } from "../utils/fetch";

export async function createBillsApi(data, logout){
    try {
        const url=`${BASE_PATH}/bills`;
        const params={
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify(data),
        };
        const result= await authFetch(url,params,logout);
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function addFileBillApi(data, logout){
    try {
        const url=`${BASE_PATH}/filebills`;
        const params={
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify(data),
        };
        const result= await authFetch(url,params,logout);
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getBillsApi(idUser, logout) {
    try {
        const url=`${BASE_PATH}/bills?user=${idUser}`;
        const result= await authFetch(url, null, logout);
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function deleteBillApi(idBill, logout){
    try {
        const url =`${BASE_PATH}/bills/${idBill}`;
        const params={
            method: 'DELETE',
            headers:{
                'Content-Type':'application/json',
            },
        };
        const result =await authFetch(url, params, logout);
        if(result.statusCode === 500) throw 'Error del servidor';
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function updateBillApi(idBill, bill, logout){
    try {
        const url =`${BASE_PATH}/bills/${idBill}`;
        const params={
            method: 'PUT',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify(bill),
        };
        const result =await authFetch(url, params, logout);
        if(result.statusCode === 500) throw 'Error del servidor';
        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
}