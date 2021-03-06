import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { getUserId } from '../services/userApi';
import { getItem } from "../services/Localestorage";



const Posts = () => {
    const token = getItem('storageToken');
    // State msg info erreur
    const [msgAlertUpdatePost, setMsgAlertUpdatePost] = useState();
    const [msgAlertComment, setMsgAlertComment] = useState();
    const [msgAlertUpdateComment, setMsgAlertUpdateComment] = useState();

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

    // State pour actualisation useEffect
    //posts
    const [addPosts, setAddPosts] = useState(false);
    const [updatePosts, setUpdatePosts] = useState(false);
    const [deletePosts, setDeletePosts] = useState(false);

    //commentaires
    const [hideAddComments, setHideAddComments] = useState(true);
    const [addComments, setAddComments] = useState(false);
    const [updateComments, setUpdateComments] = useState(false);
    const [deleteComments, setDeleteComments] = useState(false);

    //opinions
    const [opinions, setOpinions] = useState(false);

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


    // -------------- Posts --------------


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
            setOpinions(false);
            setAddPosts(false);
            setUpdatePosts(false);
            setDeletePosts(false);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    // ADD POST
    function axiosCreatePost(credentials) {

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
        .then(response => {
            setAddPosts(true)
        })
        .catch(error => console.log({ error }))
    }

    // Submit du formulaire pour envois du post
    const handleSubmit = event => {
        event.preventDefault();
        try {
            const credentialsPost = [userId, contentPost, imagePost, userName, userAvatar];
            axiosCreatePost(credentialsPost);
            setcontentPost('');
            setimagePost('');
            document.getElementById('contentPost').value = '';
            document.getElementById('imgPost').value = '';
        } catch ({ response }) {}
    }

    // Affichage du textarea en cas de modif du post
    const [showChangePost, setShowChangePost] = useState();
    const changestatePost = (id, content) => {
        if (showChangePost === id) {
            setShowChangePost();
        } else {
            setShowChangePost(id);
            setcontentPost(content);
        }
    }

    // Affichage du textarea en cas de modif du post
    const changestateComment = (id) => {
        if (hideAddComments === true) {
            setHideAddComments(false);
        } else {
            setHideAddComments(true);
        }
    }

    // UPDATE POST
    function axiosUpdatePost(credentials) {

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
        .then(response => {
            setUpdatePosts(true); 
        })
        
        .catch(error => console.log({ error }))
    }

    // Submit du formulaire pour modifications post
    const handleSubmitUpdatePost = (postId, postUserId) => {
        if (document.getElementById('updateContentPost_'+postId).value === '') {
            setMsgAlertUpdatePost('Veuillez indiquer un texte');
        }else{
            let msgModifPost = '';
            if (userId !== postUserId) {
                msgModifPost = contentPost+' - Post modéré par '+userName;
            }else{
                msgModifPost = contentPost; 
            }
            const credentialsUpdatePost = [userId, postId, postUserId, msgModifPost, imagePost];
            axiosUpdatePost(credentialsUpdatePost);
            setMsgAlertUpdatePost();
            if (showChangePost) {
                setShowChangePost();
            }
        }
    }

    // DELETE POST API
    function axiosDeletePost(credentials) {
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
        .then(response => {
            setcontentPost('');
            setimagePost('');
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    // Submit Delete d'un post
    const handleDeletePost = (postId, postUserId) => {
        const credentialsDeletePost = [userId, postId, postUserId];
        axiosDeletePost(credentialsDeletePost);
        setDeletePosts(true);
        document.getElementById('contentPost').value = '';
    }
  

    // -------------- Like / Dislike --------------


    function axiosOpinionPost(credentials) {
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
    }
    const handleOpinionPost = (opinion, userId, postId) => {
        const credentialsOpinion = [opinion, userId, postId];
        axiosOpinionPost(credentialsOpinion);
        setOpinions(true); 
    }


    // -------------- Commentaires --------------


    // Affichage de sections de commentaires
    const showUpdateComments = (postId) => {
        if (document.getElementById(postId).style.display === 'block') {
            document.getElementById(postId).style.display = 'none';
        } else {
            document.getElementById(postId).style.display = 'block';
            
        }
    }

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
            setAddComments(false);
            setDeleteComments(false);
            setUpdateComments(false);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    // ADD COMMENTAIRE
    function axiosCreateComment(credentials) {
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

    // Submit du formulaire pour envois du commentaire
    const handleSubmitCommentaires = (postId) => {
            const credentialsCommentaire = [userId, postId, userName, commentairePost];
            if (document.getElementById('addCommentairePost_'+postId).value === '') {
                setMsgAlertComment('Veuillez indiquer un texte');
            }else{
                axiosCreateComment(credentialsCommentaire);
                setAddComments(true);
                setMsgAlertComment();
                setHideAddComments(false);
            }
    }

    // UPDATE COMMENTS
    function axiosUpdateComment(credentials) {
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

    // Submit Update du commemtaire
    const handleUpdateComment = (commentId, commentUserId) => {
        if (document.getElementById('updateCommentairePost_'+commentId).value === '') {
            setMsgAlertUpdateComment('Veuillez indiquer un texte');
        }else{

            let msgModifComment = '';
            if (userId !== commentUserId) {
                msgModifComment = updateComment+' - Post modéré par '+userName;
            }else{
                msgModifComment = updateComment; 
            }
            const credentialsUpdatePost = [userId, commentId, msgModifComment];
            axiosUpdateComment(credentialsUpdatePost);
            setUpdateComments(true);
            setMsgAlertUpdateComment();
            if (showChangeComment) {
                setShowChangeComment();
            }
        }
    }

    // DELETE COMMENTS
    function axiosDeleteComment(credentials) {
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

    // Submit Delete du commentaire 
    const handleDeleteComment = (commentId, postId) => {
        const credentialsDeleteComment = [userId, commentId, postId];
        axiosDeleteComment(credentialsDeleteComment);
        setDeleteComments(true);
        setHideAddComments(true);
    }

    // Affichage du textarea en cas de modif du commentaire
    const [showChangeComment, setShowChangeComment] = useState();
    const changestate = (id) => {
        if (showChangeComment === id) {
            setShowChangeComment();
        } else {
            setShowChangeComment(id);
            setMsgAlertUpdateComment();
        }
    }

    useEffect(() => {
    }, [showChangeComment, 
        msgAlertUpdatePost, 
        msgAlertComment, 
        msgAlertUpdateComment, 
        addPosts, 
        showChangePost
    ]);

    // Prise d'effet lors du chargement de la page
    useEffect(() => {
        getUserInfo();
        getPosts();
        getComments();
    }, [addComments,
        deleteComments, 
        updateComments, 
        opinions, 
        addPosts, 
        updatePosts,
        deletePosts
    ]);



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
                            <input type="file" id="imgPost" name="imgPost" accept=".png, .jpg, .jpeg, .gif" onChange={(e) => setimagePost(e.target.files[0])} /><span className='info-format-image'>(*.png, *.jpg, *.jpeg, *.gif)</span>
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
                    {((data.imageurl) && (showChangePost !== data.id) &&(
                        <span className="content-img"><img className="image-posts" src={data.imageurl} alt={'image du post'+data.id} /></span>
                    ))}
                    {(showChangePost !== data.id && (
                        <span className="content">{data.content}</span>
                    ))}

                    {/* Section modification post */} 
                    <div id={'ancreupdatePost_'+data.id}></div>
                    {(showChangePost === data.id && (
                    <div className="updatePost" id={'updatePost_'+data.id}>
                        <div className="sectionUpdate">
                            <p className="update-title">Modification du post #{data.id}</p>
                            <p>
                                <span>
                                    <label htmlFor={ 'updateContentPost_'+data.id }>Post(*) : </label>{(msgAlertUpdatePost && (<span className='msgAlert'>{ msgAlertUpdatePost }</span>))}
                                    <textarea id={ 'updateContentPost_'+data.id } onChange={ (e) => setcontentPost(e.target.value) } defaultValue={ data.content } required></textarea>
                                </span>
                            </p>
                            <p>
                                <span>
                                    <label htmlFor={ 'updateImgPost'+data.id }>Image : </label>
                                    <input type="file" id={ 'updateImgPost'+data.id } name="updateImgPost" accept=".png, .jpg, .jpeg, .gif" onChange={ (e) => setimagePost(e.target.files[0]) } /><span className='info-format-image'>(*.png, *.jpg, *.jpeg, *.gif)</span>
                                </span>
                            </p>
                            <p>
                                <span>
                                    <button onClick={ () => handleSubmitUpdatePost(data.id, data.userid) }>Modifier</button>
                                </span>
                                { ((userId === data.userid) || (datalevel >= 2)) && (
                                    <span className="btn-deletepost">
                                        <button onClick={ () => handleDeletePost(data.id, data.userid) }>Supprimer</button>
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                    ))}

                    {/* Section add commentaires post */} 
                    <div className="commentairePost" id={'commentairePost_'+data.id}>
                    {(hideAddComments === true && (
                        <>
                        <hr/>
                        <div className="sectionCommentaires" id={'addComment'+data.id}>
                                <input type="hidden" id={ 'postidComment_'+data.id } value={ data.id } />
                                <p className="Commentaire-title">
                                    <span>Ajouter un commentaire pour le post #{data.id}</span>
                                </p>
                                <p>
                                    <label htmlFor={ 'addCommentairePost_'+data.id }>Commentaire(*) : </label><span>{(msgAlertComment && (<span className='msgAlert'>{ msgAlertComment }</span>))}</span>
                                    <textarea id={ 'addCommentairePost_'+data.id } onChange={ (e) => setCommentairePost(e.target.value) } required></textarea>
                                </p>
                                <p>
                                    <button className="btnSubmit" onClick={ () => handleSubmitCommentaires(data.id) }>Envoyer</button>
                                </p>
                        </div>
                        </>
                    ))}

                    {/* Section liste commentaires post */} 
                    {(data.countcomment > 0 && (
                    <div className="commentaireList">
                        <hr/>
                        <div className="sectionCommentaires">
                                <p className="Commentaire-title">
                                    <span>Commentaires pour le post #{data.id}</span>
                                    {(hideAddComments === false && (
                                    <span>
                                        <a role='button' href={'#commentairePost_'+data.id} aria-label="Ancre ajouter un commentaire"> 
                                            <button className='btn-add-comment' aria-label="Ajouter un commentaire" onClick={changestateComment}>Ecrire nouveau commentaire</button>
                                        </a>
                                    </span>
                                    ))}
                                </p>

                                {/* Boucle map du state posts */}  
                                {comments.map(dataComment => 
                                (dataComment.postid === data.id) && (
                                <div className="container-commentaire" key={dataComment.id}>
                                    <div className="entete-commentaire">
                                        Par <span className='com-name'>{dataComment.username}</span> le {dataComment.date} 
                                        {((dataComment.userid === userId) || (datalevel >= 2)) && (<button className='btn-update-com' aria-label="Modifier le commentaire" onClick={() => changestate(dataComment.id) }><i className="far fa-edit" aria-hidden="true" title="Modifier le commentaire"></i></button>)}
                                        {((msgAlertUpdateComment) && (showChangeComment) === dataComment.id && (<p className='msgAlert'>{msgAlertUpdateComment}</p>))}
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

                {/* Section footer post */} 
                <div className="footer-post">
                    <div className="footer-post-d">
                        <span>
                            ({data.countcomment})
                            <a role='button' href={'#commentairePost_'+data.id} aria-label="Ancre bouton commentaire"><button className="btn-link" aria-label="bouton Commentaire" onClick={ () => showUpdateComments('commentairePost_'+data.id) }><i className="fas fa-comment-alt" aria-hidden="true" title="Commentaires"></i></button></a>
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
                                <a role='button' href={'#ancreupdatePost_'+data.id} aria-label="Ancre bouton modification"><button className="btn-link" aria-label="Bouton Modification" onClick={ () => changestatePost(data.id, data.content) }><i className="fas fa-cog" aria-hidden="true" title="Modification"></i></button></a>
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