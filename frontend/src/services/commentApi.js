import axios from 'axios';
import { getItem } from "./Localestorage";

const token = getItem('storageToken');


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
    window.location.reload(); 
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
    window.location.reload(); 
}
