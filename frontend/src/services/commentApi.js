import axios from 'axios';
import { getItem } from "./Localestorage";

const token = getItem('storageToken');

// ADD COMMENTAIRE
export function axiosCreateComment(credentials) {

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
    
    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer '+token
        }
    }

    axios.post('http://localhost:8080/api/comments/addcomment', 
        {
            userId: credentials[0],
            postId: credentials[1],
            userName: credentials[2],
            dateComment: formatDate,
            contentComment: credentials[3]
        }, 
        config
    )

      .catch(function (error) {
        console.log(error);
      });
}

// DELETE COMMENTS
export function axiosDeleteComment(credentials) {

    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer '+token
        }
    }
    axios.post('http://localhost:8080/api/comments/deletecomment', 
        {
            userId: credentials[0],
            commentId: credentials[1],
            postId: credentials[2]
        }, 
        config
    )
    .catch(error => console.log({ error }))
}

// UPDATE COMMENTS
export function axiosUpdateComment(credentials) {

    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer '+token
        }
    }
    axios.post('http://localhost:8080/api/comments/updatecomment', 
        {
            userId: credentials[0],
            commentId: credentials[1],
            commentContent: credentials[2],
            postId: credentials[3]
        }, 
        config
    )
    .catch(error => console.log({ error }))
}
