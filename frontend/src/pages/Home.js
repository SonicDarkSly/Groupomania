import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const Home = () => {

    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState([]);

    // Requete des posts dans la BDD
    const getLastPosts = () => {

        axios.get('http://localhost:8080/api/posts/viewlastpost', {
            headers: { 
                'Content-Type': 'application/json' 
            }})
            .then((res) => {
                setPosts(res.data);
                
            })
            .catch((err) => {
                console.log(err);
            });
        };

        // Requete du dernier user dans la BDD
        const getLastUser = () => {

        axios.get('http://localhost:8080/api/user/viewlastuser', {
            headers: { 
                'Content-Type': 'application/json' 
            }})
            .then((res) => {
                setUser(res.data);
                
            })
            .catch((err) => {
                console.log(err);
            });
        };

        useEffect(() => {
            getLastPosts();
            getLastUser();
        }, []);


    return (
        <div className="home">
            <Header />
            <h1>Bienvenue sur le Groupomania Social Network</h1>

            <div className="block-line">

            
            <div className="block-posts">
                <div className="title">
                    Le dernier post
                </div>
                {
                    <> 
                    {/* Boucle map du state posts */}  
                    {posts.map(data => 
                        <div className="div-container-posts" key={data.id}>
                            <div className="entete">
                                <div className="g">
                                    <span><img className="avatar-post" src={data.useravatar} alt={ 'avatar de '+data.username+' pour le post '+data.id } /></span>
                                    <span className="username"><a aria-label={data.username} href={'/users?userId='+data.userid}>{data.username}</a></span>
                                </div>
                                <div className="d">
                                    <span>{data.date}</span>
                                </div>
                            </div>
                            <div className="corps">
                            
                            {/* Controle si une image existe et affiche */}  
                                {(data.imageurl && (
                                    <span className="content-img"><img className="image-posts" src={data.imageurl} alt={'image du poste'+data.id} /></span>
                                ))}
                                <span className="content">{data.content}</span>
                            </div>
                        <div className="footer">
                            <div className="footer-post-d">
                                <span>{'('+data.countcomment+')'} <button className="btn-link" aria-label="Commentaire"><i className="fas fa-comment-alt" aria-hidden="true" title="Commentaires"></i></button></span>
                                <span>{'('+data.countlike+')'} <button className="btn-link" aria-label="Like"><i className="fas fa-thumbs-up" aria-hidden="true" title="Like"></i></button></span>
                                <span>{'('+data.countdislike+')'} <button className="btn-link" aria-label="Dislike"><i className="fas fa-thumbs-down" aria-hidden="true" title="Dislike"></i></button></span>
                            </div>
                        </div>
                        </div>
                    )}
                    </>
                }
            </div>



            <div className="block-user">
                <div className="title">
                    Bienvenue à...
                </div>
                {
                    <> 
                    {/* Boucle map user */}  
                    {user.map(data => 
                        <div className="div-container-user" key={data.id}>
                            <p>
                                <img src={data.avatarurl} alt={'avatar de '+data.firstname}/>
                            </p>
                            <p>
                                {data.lastname}
                            </p>
                            <p>
                                {data.firstname}    
                            </p>
                            <p>
                                <a href={ '/users?userId='+data.id }>Voir le profil</a>
                            </p>
                        </div>
                    )}
                    </>
                }
            </div>
            </div>
        </div>
    );
};

export default Home;