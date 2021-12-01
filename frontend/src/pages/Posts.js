import React, { useState, useEffect} from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { axiosCreatePost, axiosDeletePost } from '../services/postApi';
import { getItem, addItem, removeItem } from "../services/Localestorage";

const Posts = () => {

    // Récupère les infos du user dans le localstorage
    const getinfouser = JSON.parse(localStorage.getItem("storageUserInfo"));
        const userId = getinfouser[0];
        const userName = getinfouser[2]+' '+getinfouser[3];


    // Récupère l'avatar du user dans le localstorage
    const getavataruser = localStorage.getItem("storageUserAvatar"); 
        const userAvatar = getavataruser;
    
    // State pré-post
    const [imagePost, setimagePost] = useState('');
    const [contentPost, setcontentPost] = useState();
    const [posts, setPosts] = useState([]);

    // Submit du formulaire pour envois du post
    const handleSubmit = event => {
        event.preventDefault();
        try {
            const credentialsPost = [userId, contentPost, imagePost, userName, userAvatar];
            console.log(credentialsPost);
            axiosCreatePost(credentialsPost);
        } catch ({ response }) {
          
        }
    }

    // Delete d'un post du user connecté
    const handleDeletePost = (postId) => {
        const credentialsDeletePost = [userId, postId];
        axiosDeletePost(credentialsDeletePost);
    }
    

    // Requete des posts dans la BDD
  const getPosts = () => {
      const token = getItem('storageToken');

      axios
        .get('http://localhost:8080/api/posts/viewallpost', {
            headers: { 
                Authorization: `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            },
        })
        .then((datas) => {
            setPosts(datas.data);

        })
        .catch((err) => {
            console.log(err);
        });
    };

  useEffect(() => {
    getPosts();
  }, []);

    return (
        <div className="posts">
            <Header />

            {/* Section pour publier un post */}  
            <div className="container">
                <div className="addEnteteNewPost">Publier un nouveau post</div>
                <div className="addContainerCorpsNewPost">
                    <form onSubmit={ handleSubmit }>
                        <div className="addCorpsNewPost">
                            <textarea id="contentPost" onChange={ (e) => setcontentPost(e.target.value) } required></textarea>
                            <input type="file" id="imgPost" name="imgPost" accept=".png, .jpg, .jpeg, .gif" onChange={(e) => setimagePost(e.target.files[0])} />
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary">Envoyer</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* AFFICHAGE DES POSTS */}  

            {      
            <> 
                {/* Boucle map du state posts */}  
                {posts.map(data => 
                    <div className="container" key={data.id}>
                        <div className="addEnteteNewPost">
                            <span><img src={data.useravatar} width="30"/> <i>{data.username}</i> - {data.date}</span>

                            <span><a href="#like"><i className="fas fa-thumbs-up"></i></a></span>
                            <span><a href="#dislike"><i className="fas fa-thumbs-down"></i></a></span>
                            <span>
                                {/* Affiche le boutton delete si le userid du post correspont à l'userid de l'user connecter */}  
                                {(userId === data.userid && (
                                    <a href="#delete" onClick={() => handleDeletePost(data.id) }><i className="fas fa-trash-alt"></i></a>
                                ))}   
                            </span>
                            
                        </div>
                        <div id="allpost" className="addContainerCorpsNewPost">

                            {/* Controle si une image existe et affiche */}  
                            {(data.imageurl && (
                                <span className="content-img"><img className="image-posts" src={data.imageurl}/></span>
                            ))}
                            <span className="content">{data.content}</span>
                        </div>
                    </div>
                )}
            </>
            }
        </div>
    );
};

export default Posts;