import axios from 'axios';
import { getItem, addItem, removeItem } from "./Localestorage";

export function axiosOpinionPost(credentials) {

    const token = getItem('storageToken');

    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer '+token
        }
    }

    axios.post('http://localhost:8080/api/opinions/opinionpost', 
        {
            opinion: credentials[0],
            userId: credentials[1],
            postId: credentials[2]
        }, 
        config
    )
    .catch(error => console.log({ error }))
    window.location.reload(); 
}
