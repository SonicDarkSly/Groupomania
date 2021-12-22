import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getItem } from "../services/Localestorage";
import Header from '../components/Header';
import Auth from '../context/Auth';
import { 
    deleteAccout, 
    logout, 
    axiosupdateUserEmail, 
    axiosupdateUserDescription,
    getUserId
} from '../services/userApi';
import { checkChangePassword, checkChangeEmail } from '../services/checkform';

const Account = () => {

    // State contenant les infos du user connecté / function getUserInfo
    const [userId, setUserId] = useState();
    const [email, setEmail] = useState();
    const [level, setLevel] = useState();
    const [lastName, setLastName] = useState();
    const [firstname, setFirstname] = useState();
    const [description, setDescription] = useState();
    const [avatar, setAvatar] = useState();

    const getUserInfo = async () => {
        try {
            const response = await getUserId();
            setUserId(response.id); // user Id
            setLevel(response.accesslevel); // user level
            setFirstname(response.firstname); // first name
            setLastName(response.lastname); // last name
            setEmail(response.email); // user mail
            setDescription(response.description); // user description
            setAvatar(response.avatarurl); // user avatar
        } catch ({ error }) {
            console.log(error);
        }
    }

    // State data
    const { setisAuthenticated } = useContext(Auth);
    const [profilImage, setProfilImage] = useState();
    const [oldPassword, setoldPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [newEmail, setNewEmail] = useState();
    const [newDescription, setnewDescription] = useState('');

    // State message d'erreur
    const [msgError, setMsgError] = useState()
    const [msgErrorUpdateAvatar, setMsgErrorUpdateAvatar] = useState()

    // State affichage section update
    const [showUpdateMail, setShowUpdateMail] = useState(false)
    const [showUpdateDescription, setShowUpdateDescription] = useState(false)

    // State useEffect
    const [updateAvatarActu, setUpdateAvatarActu] = useState()

    // Fonction delete
    const handleDelete = () => {
        const reqPassDelete = prompt("Veuillez tapez votre mot de passe", "");
        if (reqPassDelete) {
            deleteAccout(userId, reqPassDelete);
            logout();
            setisAuthenticated(false);
        }
    }

    // Fonction update avatar
    const handleUpdateAvatar = () => {
        const credentialsAvatar = [userId, profilImage];
        if (!profilImage) {
            setMsgErrorUpdateAvatar('Veuillez sélectionnez un fichier image');
        } else {
            axiosupdateUserAvatar(credentialsAvatar)
            setMsgErrorUpdateAvatar()
        }
    }

    // UPDATE AVATAR
    function axiosupdateUserAvatar(credentials) {
        const token = getItem('storageToken');
        const formData = new FormData();
        formData.append('userId', credentials[0]);
        formData.append('avatar', credentials[1]);

        axios({
            headers: { Authorization: `Bearer ${token}` },
            'Content-Type': 'application/json',
            url: 'http://localhost:8080/api/user/update/profile-picture',
            method: 'POST',
            data: formData
        })
        .then(response => {
            setUpdateAvatarActu(response) 
        })
        .catch(error => console.log({ error }))
    }


    // Fonction update password
    const handleSubmitChangePassword = event => {
        event.preventDefault();
        try {
          if (checkChangePassword()) {
            const credentialsPassword = [userId, oldPassword, newPassword];
            axiosupdateUserPassword(credentialsPassword)   
          }
        } catch ({ response }) {
          console.log(response);
        }
      }

      // UPDATE PASSWORD
      function axiosupdateUserPassword(credentials) {

        const token = getItem('storageToken');

        let config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer '+token
            }
        }
        axios.post('http://localhost:8080/api/user/update/password', {
            userId: credentials[0],
            oldPassword: credentials[1],
            newPassword: credentials[2]
        }, 
        config
        )
        .then(response => {
            alert('Pour des raisons de sécurité, vous allez être déconnecté');
            logout();
        })
        .catch((err) => {
            if (err.response.status === 401) {
                setMsgError(err.response.data.message);
            }
        });
    }


    // Fonction update email
    const showEmail = () => {
        if (showUpdateMail === false) {
            setShowUpdateMail(true);
        } else {
            setShowUpdateMail(false);
        }
    }
    const handleSubmitChangeEmail = event => {
        event.preventDefault();
        try {
          if ((checkChangeEmail()) && newEmail) {
            const credentialsEmail = [userId, newEmail];
            axiosupdateUserEmail(credentialsEmail)
            setShowUpdateMail(false)
          }
        } catch ({ response }) {
          console.log(response);
        }
    }

    // Fonction update description
    const showDescription = () => {
        if (showUpdateDescription === false) {
            setShowUpdateDescription(true);
        } else {
            setShowUpdateDescription(false);
        }
    }
    const handleSubmitChangeDescription = event => {
        event.preventDefault();
        try {
            const credentialsDescription = [userId, newDescription];
            axiosupdateUserDescription(credentialsDescription)   
            setShowUpdateDescription(false);
        } catch ({ response }) {
          console.log(response);
        }
    }

    // Fonctions affichage sections

       let divs = ["updateAvatar", "updatePassword", "deleteAccount"];
       let visibleId = null;

       function showHidden(id) {
         if(visibleId !== id) {
           visibleId = id;
         } 
         hide();
       }
       
       function hide() {
         let div, i, id;
         for(i = 0; i < divs.length; i++) {
           id = divs[i];
           div = document.getElementById(id);
           if(visibleId === id) {
             div.style.display = "block";
           } else {
             div.style.display = "none";
           }
         }
       } 

       useEffect(() => {
           getUserInfo();
        }, [msgError, showUpdateMail, showUpdateDescription, updateAvatarActu, msgErrorUpdateAvatar]);

        
    return (
        <div className="account">
            <Header />
            <h1>Bienvenue sur votre espace utilisateur</h1>

            {/* div container principale */}
            <div className="div-container">

                {/* div avatar gauche */}
                <div className="div-avatar">
                    <div><img src={ avatar } alt="mon avatar" /></div>
                </div>

                {/* div info user droit */}
                <div className="div-infouser">

                    <div className='div-update-btn'>
                        <span><a role='button' href='#deleteAccount' aria-label="Ancre supprimer le compte"><button className="btn-link" aria-label="Supprimer le compte" onClick={() => showHidden("deleteAccount")}>Supprimer le compte</button></a></span>
                        <span><a role='button' href='#updatePassword' aria-label="Ancre mettre à jour le mot de passe"><button className="btn-link" aria-label="Mettre à jour le mot de passe" onClick={() => showHidden("updatePassword")}>Modifier mot de passe</button></a></span>
                        <span><a role='button' href='#userDescription' aria-label="Ancre modifier la description"><button className="btn-link" aria-label="Modifier la description" onClick={ showDescription }>Modifier description</button></a></span>
                        <span><a role='button' href='#updateEmail' aria-label="Ancre modifier l'email"><button className="btn-link" aria-label="Modifier l'adresse mail" onClick={ showEmail }>Modifier email</button></a></span>
                        <span><a role='button' href='#updateAvatar' aria-label="Ancre modifier l'avatar"><button className="btn-link" aria-label="Modifier l'avatar" onClick={() => showHidden("updateAvatar")}>Modifier avatar</button></a></span>
                        {(level >= 3 &&(<span><button className="btn-link-admin" aria-label="Acces à l'administration" onClick={() => window.location.href='/administration'}>Acces administration</button></span>))}
                    </div>

                    <div className='container-infouser'>
                    <p className="container-name">
                        <span className='name'>#{ userId } { firstname } { lastName }</span>
                    </p>
                    <p>
                        <span className="title-p" id='updateEmail'>Mon email : </span>
                        {(showUpdateMail === false && (
                            <span>{ email }</span>
                        ))}
                        {(showUpdateMail === true && (
                            <span>
                                <input type="text" id="newEmail" name="newEmail" aria-label="Modifier l'adresse email" defaultValue={email} onChange={ (e) => setNewEmail(e.target.value) } required />
                                <button className="btn-valid" aria-label="Valider la nouvelle adresse email" onClick={ handleSubmitChangeEmail }>Modifier</button>
                            </span>
                        ))}
                        
                    </p>
                    {(level >= 3 &&(<p>
                        <span className="title-p">Mon niveau :</span>
                        <span> Administrateur</span>
                    </p>))}
                    {(level === 2 &&(<p>
                        <span className="title-p">Mon niveau :</span>
                        <span> Modérateur</span>
                    </p>))}
                    {(level === 1 &&(<p>
                        <span className="title-p">Mon niveau :</span>
                        <span> Utilisateur</span>
                    </p>))}
                    <div className='pdescr'>
                        <span className="title-p" id='userDescription'>Ma description :</span>
                        {(showUpdateDescription === false && (
                            <>
                            <span>{ description }</span>
                            </>
                        ))}
                        {(showUpdateDescription === true && (
                            
                            <span>
                                <textarea className="form-control description" id="newDescription" name="newDescription" rows="4" cols='60' defaultValue={ description } onChange={ (e) => setnewDescription(e.target.value) } required ></textarea>
                                <button className="btn-valid" onClick={ handleSubmitChangeDescription }>Modifier ma description</button>
                            </span>
                            
                        ))}
                        </div>
                    </div>
                </div>
            </div>


            <div className="updateAvatar show" id="updateAvatar">
                <div className="title-section">
                    <h2>Modification de l'avatar</h2>
                </div>
                <div className="content-section">
                    <p className="p-content-update-avatar">
                        <label htmlFor="avatar">Avatar : </label>
                        <input type="file" id="avatar" name="avatar" accept=".png, .jpg, .jpeg" onChange={ (e) => setProfilImage(e.target.files[0]) }/>
                        <span className='info-format-image'>(*.png, *.jpg, *.jpeg)</span>
                    </p>
                    {((msgErrorUpdateAvatar) && (!profilImage) && (
                        <p>
                            <span className='msgAlert'>{ msgErrorUpdateAvatar }</span>
                        </p>
                    ))}
                    <p className="p-content-update-avatar">
                        <button onClick={ handleUpdateAvatar }>Modifier mon avatar</button>
                    </p>
                </div>
            </div>
         

            <div className="updatePassword  show" id="updatePassword">
            <div className="title-section">
                    <h2>Modification du mot de passe</h2>
                </div>
                <div className="content-section">
                <form onSubmit={ handleSubmitChangePassword }>
                    <div className="p-content-update-password">
                        <p><label htmlFor="oldPassword">Mot de passe actuel : </label><input type="password" id="oldPassword" name="oldPassword"  placeholder="Mot de passe actuel"  onChange={ (e) => setoldPassword(e.target.value) } required /></p>
                        <p><label htmlFor="newPassword">Nouveau mot de passe : </label><input type="password" id="newPassword" name="newPassword"  minLength="8" placeholder="Nouveau mot de passe" onChange={ (e) => setNewPassword(e.target.value) } required /></p>
                        <div className="div-error">
                            { (msgError &&(<span className='error'>Erreur : { msgError }</span>)) }
                        </div>
                        <button type="submit">Modifier le mot de passe</button>
                    </div>
                    <div className="info">
                        <p>Le mot de passe doit respecter les conditions suivantes :</p>
                            <p>
                                <span>Au moins 1 caractère majuscule.</span><br/>
                                <span>Au moins 1 caractère minuscule.</span><br/>
                                <span>Au moins 1 chiffre.</span><br/>
                                <span>Au moins 1 caractère spécial.</span><br/>
                                <span>Minimum 8 caractères.</span>
                            </p>
                    </div>
                </form>
                </div>
            </div>

            <div className="deleteAccount show" id="deleteAccount">
                <div className="title-section">
                    <h2>Suppression du compte</h2>
                </div>
                <div className="content-section">
                    <p className="warning">ATTENTION : La suppression du compte est définitive, toutes les données relative au compte seront supprimées. Aucun retour en arrière ne sera possible.</p>
                    <p className="p-content-delete-account"><button onClick={ handleDelete }>Supprimer mon compte</button></p>
                </div>
            </div>
        </div>
    );
};

export default Account;