import React, { useContext, useState, useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../components/Header';
import Auth from '../context/Auth';
import { 
    deleteAccout, 
    axiosupdateUserAvatar, 
    axiosupdateUserPassword,
    logout, 
    axiosupdateUserEmail, 
    axiosupdateUserDescription
} from '../services/userApi';
import { checkChangePassword, checkChangeEmail } from '../services/checkform';

const Account = () => {

    // State data
    const { isAuthenticated, setisAuthenticated } = useContext(Auth);
    const [profilImage, setProfilImage] = useState();
    const [oldPassword, setoldPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [newEmail, setNewEmail] = useState();
    const [newDescription, setnewDescription] = useState();

    // Récupération info user dans storage
    const getinfouser = JSON.parse(localStorage.getItem("storageUserInfo"));
        const userId = getinfouser[0];
        const email = getinfouser[1];
        const lastName = getinfouser[2];
        const firstname = getinfouser[3];
        const levelaccess = getinfouser[4];
        const description = getinfouser[5];

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
        axiosupdateUserAvatar(credentialsAvatar)
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

    return (
        <div className="account">
            <Header />

            <div className="div-container">
                <div className="div-avatar">
                    <img src={ avatar } alt="mon avatar" />
                    <span className="icon-edit-avatar"><a href="#edit" onClick={() => showHidden("updateAvatar")}><i className="far fa-edit"></i></a></span>
                </div>
                <div className="div-infouser">
                    <p className="name">
                        <span>#{ userId } { firstname } { lastName }</span>
                        <span><a href="#edit" onClick={() => showHidden("deleteAccount")}><i className="fas fa-user-times"></i></a></span>
                        <span><a href="#edit" onClick={() => showHidden("updatePassword")}><i className="fas fa-key"></i></a></span>
                    </p>
                    <p><span className="title-p">Mon email : </span><span>{ email }</span><span><a href="#edit" onClick={() => showHidden("updateEmail")}><i className="far fa-edit"></i></a></span></p>
                    { (levelaccess >= 3 &&(<p><span className="title-p">Mon niveau :</span><span> Administrateur</span><span><a href="/administration"><i className="fas fa-tools"></i></a></span></p>)) }
                    { (levelaccess <= 1 &&(<p><span className="title-p">Mon niveau :</span><span> Utilisateur</span></p>)) }
                    <p><span className="title-p">Ma description :</span><span>{ description }</span><span><a href="#edit" onClick={() => showHidden("updateDescription")}><i className="far fa-edit"></i></a></span></p>
                </div>
            </div>


            <div className="updateAvatar show" id="updateAvatar">
                <div className="title-section">
                    <p>
                        <span>Modification de l'avatar</span>
                    </p>
                </div>
                <div className="content-section">
                    <p className="p-content-update-avatar"><input type="file" id="avatar" name="avatar" accept=".png, .jpg, .jpeg, .gif" onChange={ (e) => setProfilImage(e.target.files[0]) }/></p>
                    <p className="p-content-update-avatar"><button onClick={ handleUpdateAvatar }>Modifier mon avatar</button></p>
                </div>
            </div>
         

            <div className="updatePassword  show" id="updatePassword">
            <div className="title-section">
                    <p>
                        <span>Modification du mot de passe</span>
                    </p>
                </div>
                <div className="content-section">
                <form onSubmit={ handleSubmitChangePassword }>
                    <div className="p-content-update-avatar">
                        <p><span>Mot de passe actuel : </span><input type="password" id="oldPassword" name="oldPassword"  placeholder="Mot de passe actuel"  onChange={ (e) => setoldPassword(e.target.value) } required /></p>
                        <p><span>Nouveau mot de passe : </span><input type="password" id="newPassword" name="newPassword"  minLength="8" placeholder="Nouveau mot de passe" onChange={ (e) => setNewPassword(e.target.value) } required /></p>
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
                    <p>
                        <span>Suppression du compte</span>
                    </p>
                </div>
                <div className="content-section">
                    <p className="warning">ATTENTION : La suppression du compte est définitive, toutes les données relative au compte seront supprimées. Aucun retour en arrière ne sera possible.</p>
                    <p className="p-content-delete-account"><button onClick={ handleDelete }>Supprimer mon compte</button></p>
                </div>
            </div>

            <div className="updateEmail show" id="updateEmail">
                <div className="title-section">
                    <p>
                        <span>Modification de l'adresse mail</span>
                    </p>
                </div>
                <div className="content-section">
                    <form onSubmit={ handleSubmitChangeEmail }>
                        <p className="warning">ATTENTION : L'adresse mail vous sert pour vous connecter, vous devrez vous re-connecter une fois modifier.</p>
                        <p className="p-content-update-email">
                            <span>Nouvelle adresse mail : </span>
                            <span><input type="text" id="newEmail" name="newEmail"  placeholder="Nouvelle adresse mail"  onChange={ (e) => setNewEmail(e.target.value) } required /></span>
                        </p>
                        <p className="p-content-update-email">
                            <button type="submit">Modifier email</button>
                        </p>
                    </form>
                </div>
            </div>

            <div className="updateDescription show" id="updateDescription">
                <div className="title-section">
                    <p>
                        <span>Modification de la description</span>
                    </p>
                </div>
                <div className="content-section">
                    <form onSubmit={ handleSubmitChangeDescription }>
                        <p className="p-content-update-description">
                            <span>Nouvelle description : </span>
                            <span><textarea className="form-control description" id="newDescription" name="newDescription" rows="3" onChange={ (e) => setnewDescription(e.target.value) } required ></textarea></span>
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