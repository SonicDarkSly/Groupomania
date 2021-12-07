import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

import { axiosCreatePost, axiosDeletePost, axiosUpdatePost } from '../services/postApi';
import { getAccess } from '../services/userApi';
import { axiosOpinionPost } from '../services/opinionApi';
import { getItem } from "../services/Localestorage";

const Posts = () => {

    // Récupère les infos du user dans le localstorage
    const getinfouser = JSON.parse(localStorage.getItem("storageUserInfo"));
        const getUserId = [getinfouser[0]];
        const userId = getinfouser[0];
        const userName = getinfouser[2]+' '+getinfouser[3];

    // Récupère l'avatar du user dans le localstorage
    const getavataruser = localStorage.getItem("storageUserAvatar"); 
        const userAvatar = getavataruser;
    
    // State pré-post
    const [imagePost, setimagePost] = useState('');
    const [contentPost, setcontentPost] = useState('');
    const [posts, setPosts] = useState([]);
    const [datalevel, setdatalevel] = useState();

    // Submit du formulaire pour envois du post
    const handleSubmit = event => {
        event.preventDefault();
        try {
            const credentialsPost = [userId, contentPost, imagePost, userName, userAvatar];
            axiosCreatePost(credentialsPost);
        } catch ({ response }) {
          
        }
    }

    // Affichage  de section pour modification de post
    const showUpdatePost = (postId) => {
        if (document.getElementById('updatePost_'+postId).style.display === 'block') {
            document.getElementById('updatePost_'+postId).style.display = 'none';
        } else {
            document.getElementById('updatePost_'+postId).style.display = 'block';
        }
    }

    // Submit du formulaire pour modifications post
    const handleSubmitUpdatePost = (postId, postUserId) => {
        if (document.getElementById('updateContentPost_'+postId).value === '') {
            alert('Veuillez indiquer un texte');
        }else{
            let msgModifPost = '';
            if (userId !== postUserId) {
                msgModifPost = contentPost+' - Post modéré par '+userName;
            }else{
                msgModifPost = contentPost; 
            }

            const credentialsUpdatePost = [userId, postId, postUserId, msgModifPost, imagePost];
            console.log(credentialsUpdatePost);
            axiosUpdatePost(credentialsUpdatePost);
        }

    }

    // Delete d'un post du user connecté
    const handleDeletePost = (postId, postUserId) => {
        const credentialsDeletePost = [userId, postId, postUserId];
        axiosDeletePost(credentialsDeletePost);
    }
  
    // Like/Dislike d'un post
    const handleOpinionPost = (opinion, userId, postId) => {
        const credentialsOpinion = [opinion, userId, postId];
        console.log('Posts.js : '+credentialsOpinion);
        axiosOpinionPost(credentialsOpinion);
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

           // Appel la fonction pour chercher le niveau d'acces admin dans la BDD
           const level = async () => {
            try {
              const response = await getAccess(getUserId);
              setdatalevel(response);
            } catch ({ response }) {
                console.log(response);
            }
          }
          useEffect(() => {
            level();
          });
          
    return (
        <div className="posts">
            <Header />

            {/* Section pour publier un post */}  
            <div className="container">
                <div className="addEnteteNewPost">Publier un nouveau post</div>
                <div className="addContainerCorpsNewPost">
                    <form onSubmit={ handleSubmit }>
                        <div className="addCorpsNewPost">
                            <label htmlFor="contentPost">Post(*)</label>
                            <textarea id="contentPost" onChange={ (e) => setcontentPost(e.target.value) } required></textarea>
                            <label htmlFor="imgPost">Image</label>
                            <input type="file" id="imgPost" name="imgPost" accept=".png, .jpg, .jpeg" onChange={(e) => setimagePost(e.target.files[0])} />
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
                    <div className="container-entete-post">
                        <div className="g">
                            <span><img className="avatar-post" src={data.useravatar} alt={ 'avatar de '+data.username+' pour le post '+data.id } /></span>
                            <span className="username"><a href={'/users?userId='+data.userid}>{data.username}</a></span>
                        </div>
                        <div className="c">
                            <span>#{data.id}</span>
                        </div>
                        <div className="d">
                            <span>{data.date}</span>
                        </div>
                    </div>
                </div>
                <div id="allpost" className="addContainerCorpsNewPost">

                    {/* Controle si une image existe et affiche */}  
                    {(data.imageurl && (
                        <span className="content-img"><img className="image-posts" src={data.imageurl} alt="poste" /></span>
                    ))}
                    <span className="content">{data.content}</span>

                    {/* Section modification post */} 
                    <div className="updatePost" id={'updatePost_'+data.id}>
                        <hr/>
                        <div className="sectionUpdate">
                            <p className="update-title">Modification du post #{data.id}</p>
                            <p>
                                <span>
                                    <label htmlFor={ 'updateContentPost_'+data.id }>Post(*)</label>
                                    <textarea id={ 'updateContentPost_'+data.id } onChange={ (e) => setcontentPost(e.target.value) } defaultValue={ data.content } required></textarea>
                                </span>
                            </p>
                            <p>
                                <span>
                                    <label htmlFor={ 'updateImgPost'+data.id }>Image</label>
                                    <input type="file" id={ 'updateImgPost'+data.id } name="updateImgPost" accept=".png, .jpg, .jpeg" onChange={ (e) => setimagePost(e.target.files[0]) } />
                                </span>
                            </p>
                            <p>
                                <span><button onClick={ () => handleSubmitUpdatePost(data.id, data.userid) }>Modifier</button></span>
                                { ((userId === data.userid) || (datalevel >= 2)) && (<span className="btn-deletepost"><button onClick={ () => handleDeletePost(data.id, data.userid) }>Supprimer</button></span>)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="footer-post">
                    <div className="footer-post-d">
                        <span>({data.countlike})<a aria-label="Like" onClick={ () => handleOpinionPost('like', userId, data.id) }><i className="fas fa-thumbs-up" aria-hidden="true" title="Like"></i></a> ({data.countdislike})<a aria-label="Dislike" onClick={ () => handleOpinionPost('dislike', userId, data.id) }><i className="fas fa-thumbs-down" aria-hidden="true" title="Dislike"></i></a></span>
                        <span>
                            {/* Affiche le boutton de modification si le userid du post correspont à l'userid de l'user connecter ou si le level est >= 2 */}  
                            { ((userId === data.userid) || (datalevel >= 2)) && (
                                <a aria-label="Modification" href={'#updatePost_'+data.id} onClick={ () => showUpdatePost(data.id) }><i className="fas fa-cog" aria-hidden="true" title="Modification"></i></a>
                            ) }   
                        </span>
                    </div>
                </div>
            </div>
            )}
            </>
            }
        </div>
    );
};

export default Posts;