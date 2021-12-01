import axios from 'axios';
import { getItem, addItem, removeItem } from "./Localestorage";



// ADD POST

export function axiosCreatePost(credentials) {

    const token = getItem('storageToken');

    let date = new Date();
    let jour = date.getDate();
    let mois = date.getMonth()+1;
    let annee = date.getFullYear();
    let heures = date.getHours();
    let minutes = date.getMinutes();
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
    window.location.reload(); 
}


// DELETE POST

export function axiosDeletePost(credentials) {

    const token = getItem('storageToken');

    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer '+token
        }
    }

    axios.post('http://localhost:8080/api/posts/deleteonepost', 
        {
            userId: credentials[0],
            postId: credentials[1]
        }, 
        config
    )
      .then(function (response) {
        console.log(response);
        window.location.reload(); 
      })
      .catch(function (error) {
        console.log(error);
      });
}
