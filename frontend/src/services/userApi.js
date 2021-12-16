import axios from 'axios';
import { getItem, removeItem } from "./Localestorage";

const jwt = require('jsonwebtoken');

export function hasAuthenticated() {
    const token = getItem('storageToken');
    const tokenIsValidn = token ? tokenIsValid(token) : false;
    if(false === tokenIsValidn) {
        removeItem('storageToken');
        removeItem('storageUserInfo');
    }
    return tokenIsValidn;
}

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

// GET LEVEL FOR ACCOUNT

export function getLevel(credentials) {

    const token = getItem('storageToken');

    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer '+token
        }
    }
    return axios.post('http://localhost:8080/api/user/getlevel', 
        {
            userId: credentials[0]
        }, 
        config
    )
    .then(response => {
        return response.data
    })
    .catch(error => console.log({ error }))
}


// LOGOUT

export function logout() {
    removeItem('storageToken');
    removeItem('storageUserInfo');
    window.location.reload(); 
}


// SIGNUP

export function signup(credentials) {

    return axios
        .post("http://localhost:8080/api/user/signup", credentials)
        .then(response => {
            console.log(response);
        })
        .catch(error => console.log({ error }))
}


// UPDATE AVATAR

export function axiosupdateUserAvatar(credentials) {

    const token = getItem('storageToken');

    const formData = new FormData();
    formData.append('userId', credentials[0]);
    formData.append('avatar', credentials[1]);

    axios({
        headers: { Authorization: `Bearer ${token}` },
        'Content-Type': 'application/json',
        url: 'http://localhost:8080/api/user/update/profile-picture',
        method: 'POST',
        data: formData
    })
    .then(response => {
        window.location.reload(); 
    })
    .catch(error => console.log({ error }))
}


// DELETE ACCOUNT

export function deleteAccout(userid, userpass) {

    const token = getItem('storageToken');

    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer '+token
        }
    }

    axios.post('http://localhost:8080/api/user/delete', 
        {
            userId: userid,
            userPass: userpass
        }, 
        config
    )
      .then(function (response) {
        removeItem('storageToken');
        removeItem('storageUserInfo');
      })
      .catch(function (error) {
        console.log(error);
      });
}





// UPDATE EMAIL

export function axiosupdateUserEmail(credentials) {

    const token = getItem('storageToken');

    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer '+token
        }
    }

    axios.post('http://localhost:8080/api/user/update/email', 
        {
            userId: credentials[0],
            newEmail: credentials[1]
        }, 
        config
    )
    .then(response => {
        alert("Votre adresse mail à bien été modifier, vous allez être déconnecté");
        logout();
    })
    .catch(error => console.log({ error }))
}

// UPDATE DESCRIPTION

export function axiosupdateUserDescription(credentials) {

    const token = getItem('storageToken');

    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer '+token
        }
    }

    axios.post('http://localhost:8080/api/user/update/description', 
        {
            userId: credentials[0],
            newDescription: credentials[1]
        }, 
        config
    )
    .then(response => {
        window.location.reload(); 
    })
    .catch(error => console.log({ error }))
}
