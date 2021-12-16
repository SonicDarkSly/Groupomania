import axios from 'axios';
import { getItem } from "./Localestorage";

const token = getItem('storageToken');

// ADD POST API
export function axiosCreatePost(credentials) {

        // formatage de la date
        let date = new Date();
        let jour = date.getDate();
            if (jour < 10){jour = '0'+jour;}
        let mois = date.getMonth()+1;
            if (mois < 10){mois = '0'+mois;}
        let annee = date.getFullYear();
        let heures = date.getHours();
            if (heures < 10){heures = '0'+heures;}
        let minutes = date.getMinutes();
            if (minutes < 10){minutes = '0'+minutes;}
        let formatDate = jour+"/"+mois+"/"+annee+" - "+heures+"h"+minutes;

        const formData = new FormData();
        formData.append('userId', credentials[0]);
        formData.append('contentPost', credentials[1]);
        formData.append('imgPost', credentials[2]);
        formData.append('date', formatDate);
        formData.append('userName', credentials[3]);
        formData.append('userAvatar', credentials[4]);
    
        axios({
            headers: { Authorization: `Bearer ${token}` },
            'Content-Type': 'application/json',
            url: 'http://localhost:8080/api/posts/addpost',
            method: 'POST',
            data: formData
        })
        .catch(error => console.log({ error }))
    }

// UPDATE POST

export function axiosUpdatePost(credentials) {

    const formData = new FormData();
    formData.append('userId', credentials[0]);
    formData.append('postId', credentials[1]);
    formData.append('postUserId', credentials[2]);
    formData.append('contentPost', credentials[3]);
    formData.append('imgPost', credentials[4]);
    
    axios({
        headers: { Authorization: `Bearer ${token}` },
        'Content-Type': 'application/json',
        url: 'http://localhost:8080/api/posts/updatepost',
        method: 'POST',
        data: formData
    })
    .catch(error => console.log({ error }))
}

// DELETE POST API
    export function axiosDeletePost(credentials) {

        let config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer '+token
            }
        }

        axios.post('http://localhost:8080/api/posts/deleteonepost', 
        {
            userId: credentials[0],
            postId: credentials[1],
            postUserId: credentials[2]
        }, 
        config
        )
        .catch(function (error) {
            console.log(error);
        });
}