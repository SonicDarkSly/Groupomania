import React, { useContext, useState, useEffect } from 'react';
import Header from '../components/Header';
import Auth from '../context/Auth';
import { 
    deleteAccout, 
    axiosupdateUserAvatar, 
    axiosupdateUserPassword,
    logout, 
    axiosupdateUserEmail, 
    axiosupdateUserDescription,
    getLevel
} from '../services/userApi';
import { checkChangePassword, checkChangeEmail } from '../services/checkform';

const Account = () => {

    // State data
    const { setisAuthenticated } = useContext(Auth);
    const [profilImage, setProfilImage] = useState();
    const [oldPassword, setoldPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [newEmail, setNewEmail] = useState();
    const [newDescription, setnewDescription] = useState();
    const [datalevel, setdatalevel] = useState();

    // Récupération info user dans storage
    const getinfouser = JSON.parse(localStorage.getItem("storageUserInfo"));
        const getUserId = [getinfouser[0]];
        const userId = getinfouser[0];
        const email = getinfouser[1];
        const lastName = getinfouser[2];
        const firstname = getinfouser[3];
        const description = getinfouser[4];

    // Récupération url avatar dans storage
    const getinfouseravatar = localStorage.getItem("storageUserAvatar");
        const avatar = getinfouseravatar;

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
            alert('Veuillez sélectionnez un fichier image');
        } else {
            axiosupdateUserAvatar(credentialsAvatar) 
        }
        
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

    // Fonction update email
    const handleSubmitChangeEmail = event => {
        event.preventDefault();
        try {
          if (checkChangeEmail()) {
            const credentialsEmail = [userId, newEmail];
            axiosupdateUserEmail(credentialsEmail)   
          }
        } catch ({ response }) {
          console.log(response);
        }
      }


      // Fonction update description
      const handleSubmitChangeDescription = event => {
        event.preventDefault();
        try {
            const credentialsDescription = [userId, newDescription];
            axiosupdateUserDescription(credentialsDescription)   
          
        } catch ({ response }) {
          console.log(response);
        }
      }

    // Fonctions affichage sections

       let divs = ["updateAvatar", "updatePassword", "deleteAccount", "updateEmail", "updateDescription"];
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

       // Appel la fonction pour chercher le niveau d'acces admin dans la BDD
       const level = async () => {
        try {
          const response = await getLevel(getUserId);
          setdatalevel(response);
        } catch ({ response }) {
            console.log(response);
        }
      }
      useEffect(() => {
        level();
      });

    return (
        <div className="account">
            <Header />
            <h1>Bienvenue sur votre espace utilisateur</h1>
            <div className="div-container">
                <div className="div-avatar">
                    <img src={ avatar } alt="mon avatar" />
                    <span className="icon-edit-avatar">
                        <button className="btn-link" aria-label="Modifier l'avatar" onClick={() => showHidden("updateAvatar")}><i className="far fa-edit" aria-hidden="true" title="Modifier l'avatar"></i></button>
                    </span>
                </div>
                <div className="div-infouser">
                    <p className="name">
                        <span>#{ userId } { firstname } { lastName }</span>
                        <span>
                            <button className="btn-link" aria-label="Supprimer le compte" onClick={() => showHidden("deleteAccount")}><i className="fas fa-user-times" aria-hidden="true" title="Supprimer le compte"></i></button>
                        </span>
                        <span>
                            <button className="btn-link" aria-label="Mettre à jour le mot de passe" onClick={() => showHidden("updatePassword")}><i className="fas fa-key" aria-hidden="true" title="Mettre à jour le mot de passe"></i></button>
                        </span>
                    </p>
                    <p>
                        <span className="title-p">Mon email : </span>
                        <span>{ email }</span>
                        <span>
                            <button className="btn-link" aria-label="Modifier l'adresse mail" onClick={() => showHidden("updateEmail")}><i className="far fa-edit" aria-hidden="true" title="Modifier l'adresse mail"></i></button>
                        </span>
                    </p>
                    { (datalevel >= 3 &&(<p>
                        <span className="title-p">Mon niveau :</span>
                        <span> Administrateur</span>
                        <span>
                            <button className="btn-link" aria-label="Acces à l'administration" onClick={() => window.location.href='/administration'}><i className="fas fa-tools" aria-hidden="true" title="Acces à l'administration"></i></button>
                        </span>
                    </p>))}
                    {(datalevel <= 1 &&(<p>
                        <span className="title-p">Mon niveau :</span>
                        <span> Utilisateur</span>
                    </p>))}
                    <p>
                        <span className="title-p">Ma description :</span>
                        <span>{ description }</span>
                        <span>
                            <button className="btn-link" aria-label="Modifier la description" onClick={() => showHidden("updateDescription")}><i className="far fa-edit" aria-hidden="true" title="Modifier la description"></i></button>
                        </span>
                    </p>
                </div>
            </div>


            <div className="updateAvatar show" id="updateAvatar">
                <div className="title-section">
                    <h2>Modification de l'avatar</h2>
                </div>
                <div className="content-section">
                    <p className="p-content-update-avatar"><label htmlFor="avatar">Avatar : </label><input type="file" id="avatar" name="avatar" accept=".png, .jpg, .jpeg" onChange={ (e) => setProfilImage(e.target.files[0]) }/></p>
                    <p className="p-content-update-avatar"><button onClick={ handleUpdateAvatar }>Modifier mon avatar</button></p>
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
                        <button type="submit">Modifier le mot de passe</button>
                    </div>
                    <p className="info">Le mot de passe doit respecter les conditions suivantes :
                        
                            <span>Au moins 1 caractère majuscule.</span><br/>
                            <span>Au moins 1 caractère minuscule.</span><br/>
                            <span>Au moins 1 chiffre.</span><br/>
                            <span>Au moins 1 caractère spécial.</span><br/>
                            <span>Minimum 8 caractères.</span>
                        
                    </p>
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

            <div className="updateEmail show" id="updateEmail">
                <div className="title-section">
                     <h2>Modification de l'adresse mail</h2>
                </div>
                <div className="content-section">
                    <form onSubmit={ handleSubmitChangeEmail }>
                        <p className="warning">ATTENTION : L'adresse mail vous sert pour vous connecter, vous devrez vous re-connecter une fois modifier.</p>
                        <p className="p-content-update-email">
                            <label htmlFor="newEmail">Nouvelle adresse mail : </label>
                            <input type="text" id="newEmail" name="newEmail"  placeholder="Nouvelle adresse mail"  onChange={ (e) => setNewEmail(e.target.value) } required />
                        </p>
                        <p className="p-content-update-email">
                            <button type="submit">Modifier email</button>
                        </p>
                    </form>
                </div>
            </div>

            <div className="updateDescription show" id="updateDescription">
                <div className="title-section">
                    <h2>Modification de la description</h2>
                </div>
                <div className="content-section">
                    <form onSubmit={ handleSubmitChangeDescription }>
                        <p className="p-content-update-description">
                            <label htmlFor="newDescription">Nouvelle description : </label>
                            <textarea className="form-control description" id="newDescription" name="newDescription" rows="3" onChange={ (e) => setnewDescription(e.target.value) } required ></textarea>
                        </p>
                        <p className="info">La modification sera visible lors de votre prochaine connexion.</p>
                        <p className="p-content-update-description">
                            <button type="submit">Modifier ma description</button>
                        </p>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default Account;