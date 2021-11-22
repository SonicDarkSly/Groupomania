import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../components/Header';
import Auth from '../context/Auth';
import { deleteAccout, axiosupdateUserAvatar, axiosupdateUserPassword, logout, axiosupdateUserEmail } from '../services/AuthApi';
import { checkChangePassword, checkChangeEmail } from '../services/checkform';

const Account = () => {

    // State
    const { isAuthenticated, setisAuthenticated } = useContext(Auth);
    const [profilImage, setProfilImage] = useState();
    const [oldPassword, setoldPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [newEmail, setNewEmail] = useState();

    // Récupération info user dans storage
    const getinfouser = JSON.parse(localStorage.getItem("storageUserInfo"));
        const userId = getinfouser[0];
        const email = getinfouser[1];
        const lastName = getinfouser[2];
        const firstname = getinfouser[3];
        const levelaccess = getinfouser[4];
        const description = getinfouser[6];

    // Récupération url avatar dans storage
    const getinfouseravatar = localStorage.getItem("storageUserAvatar");
        const avatar = getinfouseravatar;

    // Fonction delete
    const handleDelete = () => {
        const reqPassDelete = prompt("Veuillez tapez votre mot de passe (en cas d'échec vous serez déconnecté !)", "");
        if (reqPassDelete !== '') {
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


    return (
        <div className="account">
            <Header />

            { (levelaccess >= 3 && (
              <>
              <div>
                  <p>
                      <NavLink exact to="/administration" className="nav-link"><i className="fas fa-users-cog"></i></NavLink>
                  </p>
              </div>
              </>
            ))}

            <div className="container-fluid row">
                <div className="col-4 text-center">
                    <img src={ avatar } width="100" alt="mon avatar" />
                </div>
                <div className="col-8">
                    <h1>{ firstname } { lastName } </h1>
                    <h2>ici c'est mon espace user</h2>
                    <h3>mon email : { email }</h3>
                    <h3>mon ID : { userId }</h3>
                    <h3>ma description : { description }</h3>
                </div>
            </div>
            <div className="container-fluid text-center border">
                <h2>Modifier mon avatar</h2>
            </div>
            <div className="container text-center">
                <input type="file" id="avatar" name="avatar" onChange={(e) => setProfilImage(e.target.files[0])}/>
                <button onClick={handleUpdateAvatar} className="btn btn-primary">Modifier avatar</button>
            </div>
            <div className="container-fluid text-center border">
                <h2>Modifier mon mot de passe</h2>
            </div>
            <div className="container text-center">
                <form onSubmit={ handleSubmitChangePassword }>
                    <p><span>Mot de passe actuel : </span><input type="password" id="oldPassword" name="oldPassword"  placeholder="Mot de passe actuel"  onChange={ (e) => setoldPassword(e.target.value) } required /></p>
                    <p><span>Nouveau mot de passe : </span><input type="password" id="newPassword" name="newPassword"  minLength="8" placeholder="Nouveau mot de passe" onChange={ (e) => setNewPassword(e.target.value) } required /></p>
                    
                    <div>
                        <p>Le mot de passe doit respecter les conditions suivantes :</p>
                        <ul>
                            <li>Au moins 1 caractère majuscule.</li>
                            <li>Au moins 1 caractère minuscule.</li>
                            <li>Au moins 1 chiffre.</li>
                            <li>Au moins 1 caractère spécial.</li>
                            <li>Minimum 8 caractères.</li>
                        </ul>
                    </div>

                    <button type="submit" className="btn btn-primary">Modifier le mot de passe</button>
                </form>
            </div>
            <div className="container-fluid text-center border">
                <h2>Supprimer mon compte</h2>
            </div>
            <div className="container text-center">
                <button onClick={ handleDelete }>Supprimer compte</button>
            </div>
            <div className="container-fluid text-center border">
                <h2>Modifier mon adresse mail</h2>
            </div>
            <div className="container text-center">
                <form onSubmit={ handleSubmitChangeEmail }>
                    <p>ATTENTION : L'adresse mail vous sert pour vous connecter, vous devrez vous re-connecter une fois modifier.</p>
                    <p><span>Nouvelle adresse mail : </span><input type="text" id="newEmail" name="newEmail"  placeholder="Nouvelle adresse mail"  onChange={ (e) => setNewEmail(e.target.value) } required /></p>
                    <button type="submit">Modifier email</button>
                </form>
            </div>


        </div>
    );
};

export default Account;