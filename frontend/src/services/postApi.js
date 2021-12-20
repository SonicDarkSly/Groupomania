import axios from 'axios';
import { getItem } from "./Localestorage";

const token = getItem('storageToken');

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