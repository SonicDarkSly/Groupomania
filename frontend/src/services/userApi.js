import axios from 'axios';
import { getItem, removeItem } from "./Localestorage";

const jwt = require('jsonwebtoken');

// Action selon validité du token
export function hasAuthenticated() {
    const token = getItem('storageToken');
    const tokenIsValidn = token ? tokenIsValid(token) : false;
    if(false === tokenIsValidn) {
        removeItem('storageToken');
        removeItem('storageUserInfo');
    }
    return tokenIsValidn;
}

// Controle du token
function tokenIsValid(token) {
    const { REACT_APP_TOKEN } = process.env;
    const { exp } = jwt.verify(token, REACT_APP_TOKEN); 
    if (exp * 1000 > new Date().getTime()) {
        return true;
    }
    removeItem(token);   
}

// GET USERID
export function getUserId() {
    const getinfouser = JSON.parse(localStorage.getItem("storageUserInfo"));
    const token = getItem('storageToken');
    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer '+token
        }
    }
    return axios.post('http://localhost:8080/api/user/getuserid', 
        {
            userPassCrypted: getinfouser[0]
        }, 
        config
    )
    .then(response => {
        return response.data;
    })
    .catch(error => console.log({ error }))
}

// LOGOUT
export function logout() {
    removeItem('storageToken');
    removeItem('storageUserInfo');
    window.location.reload(); 
}