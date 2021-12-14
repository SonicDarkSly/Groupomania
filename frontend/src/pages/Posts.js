import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

import { getUserId } from '../services/userApi';
import { axiosCreatePost, axiosDeletePost, axiosUpdatePost, axiosCreateComment } from '../services/postApi';
import { axiosOpinionPost } from '../services/opinionApi';
import { getItem } from "../services/Localestorage";
import { axiosDeleteComment, axiosUpdateComment } from '../services/commentApi';

const Posts = () => {

    // State contenant les infos du user connecté / function getUserInfo
    const [userId, setUserId] = useState();
    const [userName, setUserName] = useState();
    const [datalevel, setdatalevel] = useState();
    const [userAvatar, setAvatar] = useState();
    
    // State post
    const [imagePost, setimagePost] = useState('');
    const [contentPost, setcontentPost] = useState('');
    const [posts, setPosts] = useState([]);

    // State commentaires
    const [commentairePost, setCommentairePost] = useState('');
    const [comments, setComments] = useState([]);
    const [updateComment, setUpdateComment] = useState();

    // Submit du formulaire pour envois du post
    const handleSubmit = event => {
        event.preventDefault();
        try {
            const credentialsPost = [userId, contentPost, imagePost, userName, userAvatar];
            axiosCreatePost(credentialsPost);
        } catch ({ response }) {
          
        }
    }

    // Affichage de sections de post
    const showUpdatePost = (postId) => {
        if (document.getElementById(postId).style.display === 'block') {
            document.getElementById(postId).style.display = 'none';
        } else {
            document.getElementById(postId).style.display = 'block';
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

    // Requete des commentaires dans la BDD
    const getComments = () => {
        const token = getItem('storageToken');
        axios
        .get('http://localhost:8080/api/comments/viewcomment', {
            headers: { 
                Authorization: `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            },
        })
        .then((res) => {
            setComments(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
    };
    
    // Requete des info du user connecté dans la BDD
    const getUserInfo = async () => {
        try {
            const response = await getUserId();
            setUserId(response.id); // user Id
            setdatalevel(response.accesslevel); // user level
            setAvatar(response.avatarurl); // user level
            setUserName(response.lastname+' '+response.firstname); // user name
        } catch ({ error }) {
            console.log(error);
        }
    }

    // -------------- Commentaires --------------

    // Submit du formulaire pour envois du commentaire
    const handleSubmitCommentaires = (postId) => {
            const credentialsCommentaire = [userId, postId, userName, commentairePost];
            if (document.getElementById('addCommentairePost_'+postId).value === '') {
                alert('Veuillez indiquer un texte');
            }else{
                axiosCreateComment(credentialsCommentaire);
                setTimeout(function(){ 
                    window.location.reload() 
                }, 300);
            }
    }

    // Update du commemtaire
    const handleUpdateComment = (commentId, commentUserId) => {

        if (document.getElementById('updateCommentairePost_'+commentId).value === '') {
            alert('Veuillez indiquer un texte');
        }else{

            let msgModifComment = '';
            if (userId !== commentUserId) {
                msgModifComment = updateComment+' - Post modéré par '+userName;
            }else{
                msgModifComment = updateComment; 
            }
            const credentialsUpdatePost = [userId, commentId, msgModifComment];
            axiosUpdateComment(credentialsUpdatePost);
        }
        
    }

    // Delete du commentaire 
    const handleDeleteComment = (commentId, postId) => {
        const credentialsDeleteComment = [userId, commentId, postId];
        axiosDeleteComment(credentialsDeleteComment);
    }


    // Affichage du textarea en cas de modif du commentaire
    const [showChangeComment, setShowChangeComment] = useState();
    const changestate = (id) => {
        if (showChangeComment === id) {
            setShowChangeComment();
        } else {
            setShowChangeComment(id);
        }
    }
    useEffect(() => {
    }, [showChangeComment]);

    // Prise d'effet lors du chargement de la page
    useEffect(() => {
        getUserInfo();
        getPosts();
        getComments();
    }, []);

    return (
        <div className="posts">
            <Header />
            <h1>Fil des posts</h1>
            {/* Section pour publier un post */}  
            <div className="container-principale">
                <div className="addEnteteNewPost">Publier un nouveau post</div>
                <div className="addContainerCorpsNewPost">
                    <form onSubmit={ handleSubmit }>
                        <div className="addCorpsNewPost">
                            <label htmlFor="contentPost">Post(*) : </label>
                            <textarea id="contentPost" onChange={ (e) => setcontentPost(e.target.value) } required></textarea>
                            <label htmlFor="imgPost">Image : </label>
                            <input type="file" id="imgPost" name="imgPost" accept=".png, .jpg, .jpeg" onChange={(e) => setimagePost(e.target.files[0])} />
                        </div>
                        <div className="text-center">
                            <button type="submit">Envoyer</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* AFFICHAGE DES POSTS */}  

            {      
            <> 
            {/* Boucle map du state posts */}  
            {posts.map(data => 
            <div className="container-principale" key={data.id}>
                <div className="addEnteteNewPost">
                    <div className="container-entete-post">
                        <div className="g">
                            <span><img className="avatar-post" src={data.useravatar} alt={ 'avatar de '+data.username+' pour le post '+data.id } /></span>
                            <span className="username"><a aria-label={data.username} href={'/users?userId='+data.userid}>{data.username}</a></span>
                        </div>

                        <div className="d">
                            <span>{data.date}</span>
                        </div>
                    </div>
                </div>
                <div id={'post_'+data.id} className="addContainerCorpsNewPost">

                    {/* Controle si une image existe et affiche */}  
                    {(data.imageurl && (
                        <span className="content-img"><img className="image-posts" src={data.imageurl} alt={'image du post'+data.id} /></span>
                    ))}
                    <span className="content">{data.content}</span>

                    {/* Section modification post */} 
                    <div className="updatePost" id={'updatePost_'+data.id}>
                        <hr/>
                        <div className="sectionUpdate">
                            <p className="update-title">Modification du post #{data.id}</p>
                            <p>
                                <span>
                                    <label htmlFor={ 'updateContentPost_'+data.id }>Post(*) : </label>
                                    <textarea id={ 'updateContentPost_'+data.id } onChange={ (e) => setcontentPost(e.target.value) } defaultValue={ data.content } required></textarea>
                                </span>
                            </p>
                            <p>
                                <span>
                                    <label htmlFor={ 'updateImgPost'+data.id }>Image : </label>
                                    <input type="file" id={ 'updateImgPost'+data.id } name="updateImgPost" accept=".png, .jpg, .jpeg" onChange={ (e) => setimagePost(e.target.files[0]) } />
                                </span>
                            </p>
                            <p>
                                <span><button onClick={ () => handleSubmitUpdatePost(data.id, data.userid) }>Modifier</button></span>
                                { ((userId === data.userid) || (datalevel >= 2)) && (<span className="btn-deletepost"><button onClick={ () => handleDeletePost(data.id, data.userid) }>Supprimer</button></span>)}
                            </p>
                        </div>
                    </div>

                    {/* Section add commentaires post */} 
                    <div className="commentairePost" id={'commentairePost_'+data.id}>
                        <hr/>
                        <div className="sectionCommentaires">
                            
                                <input type="hidden" id={ 'postidComment_'+data.id } value={ data.id } />
                                <p className="Commentaire-title">
                                    Ajouter un commentaire pour le post #{data.id}
                                </p>
                                <p>
                                    <label htmlFor={ 'addCommentairePost_'+data.id }>Commentaire(*) : </label>
                                    <textarea id={ 'addCommentairePost_'+data.id } onChange={ (e) => setCommentairePost(e.target.value) } required></textarea>
                                </p>
                                <p>
                                    <button className="btnSubmit" onClick={ () => handleSubmitCommentaires(data.id) }>Envoyer</button>
                                </p>
                        </div>

                    {/* Section liste commentaires post */} 
                    {(data.countcomment > 0 && (
                    <div className="commentaireList">
                        <hr/>
                        <div className="sectionCommentaires">
                                <p className="Commentaire-title">
                                    Commentaires pour le post #{data.id}
                                </p>

                                {/* afficher les commentaires si >0 */} 

                                {comments.map(dataComment => 
                                (dataComment.postid === data.id) && (
                                
                                <div className="container-commentaire" key={dataComment.id}>
                                    <div className="entete-commentaire">
                                        Par {dataComment.username} le {dataComment.date} 
                                        {((dataComment.userid === userId) || (datalevel >= 2)) && (<button aria-label="Modifier le commentaire" onClick={() => changestate(dataComment.id) }><i className="fas fa-sync-alt" aria-hidden="true" title="Modifier le commentaire"></i></button>)}
                                    </div>
                                    <div className="corps-commentaire">
                                    {(showChangeComment !== dataComment.id && (<span>{ dataComment.content }</span>))}
                                    {(showChangeComment === dataComment.id && (
                                    <span>
                                        <textarea aria-label={ 'commentaire_'+dataComment.id } defaultValue={ dataComment.content } id={ 'updateCommentairePost_'+dataComment.id } onChange={ (e) => setUpdateComment(e.target.value) }></textarea>
                                        <button className="btn-valid-modif" aria-label="Valider la modification du commentaire" onClick={ () => handleUpdateComment(dataComment.id, dataComment.userid) }>Modifier</button>
                                        <button className="btn-valid-supp" aria-label="Supprimer le commentaire" onClick={ () => handleDeleteComment(dataComment.id, dataComment.postid) }>Supprimer</button> 
                                    </span>
                                    ))}
                                    </div>
                                </div>
                                )
                                )}
                        </div>
                    </div>
                    ))}

                    </div>
                </div>
                <div className="footer-post">
                    <div className="footer-post-d">
                        <span>
                            ({data.countcomment})
                            <button className="btn-link" aria-label="Commentaire" onClick={ () => showUpdatePost('commentairePost_'+data.id) }><i className="fas fa-comment-alt" aria-hidden="true" title="Commentaires"></i></button>
                        </span>
                        <span>
                            ({data.countlike})
                            <button className="btn-link" aria-label="Like" onClick={ () => handleOpinionPost('like', userId, data.id) }><i className="fas fa-thumbs-up" aria-hidden="true" title="Like"></i></button>
                            
                            ({data.countdislike})
                            <button className="btn-link" aria-label="Dislike" onClick={ () => handleOpinionPost('dislike', userId, data.id) }><i className="fas fa-thumbs-down" aria-hidden="true" title="Dislike"></i></button>
                        </span>
                        <span>
                            {/* Affiche le boutton de modification si le userid du post correspont à l'userid de l'user connecter ou si le level est >= 2 */}  
                            { ((userId === data.userid) || (datalevel >= 2)) && (
                                <button className="btn-link" aria-label="Modification" onClick={ () => showUpdatePost('updatePost_'+data.id) }><i className="fas fa-cog" aria-hidden="true" title="Modification"></i></button>
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