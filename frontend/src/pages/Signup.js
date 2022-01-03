import React, { useEffect, useContext, useState} from 'react';
import { useHistory } from 'react-router-dom';
import Auth from "../context/Auth";
import Header from '../components/Header';
import { checksignup } from '../services/checkform'
import axios from 'axios';

const Signup = ({ history }) => {

  // Récupere le context pour le controle de la connection
  const { isAuthenticated } = useContext(Auth);

  // State initial
  const [usersignup, setusersignup] = useState({
        "lastname": "",
        "firstname": "",
        "email": "",
        "password": "",
        "avatar": ""
  })

  // State message erreur
  const [msgError, setMsgError] = useState();

      // Change le state avec les info du formulaire (objet)
      const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setusersignup({...usersignup, [name]: value})
      }

      // SIGNUP
      function signup(credentials) {
        axios
        .post("http://localhost:8080/api/user/signup", credentials)
        .then(res => {
          setMsgError(res.data.message);
          history.replace('/login');
        })
        .catch((err) => {
          setMsgError(err.response.data.message);
        });
      }
      // Validation du formulaire
      const handleSubmit = () => {
          if (checksignup()) {
            signup(usersignup);
          }
      }

      // Redirection si besoin (btn signup)
      const historyLink = useHistory();
      const redirect = (url) => { 
        historyLink.push(url);
      }
  
      // Redirection si non connecté
      useEffect(() => {
        if (isAuthenticated === true) {
          history.replace('/account');
        }
      }, [history, isAuthenticated]);

    return (
        <div className="signup">
            <Header />
            <h1>Enregistrement</h1>
            <div className="container container-signup">
                
                    <div className="form-group">
                        <label htmlFor="lastname">Nom(*)</label>
                        <input type="text" className="form-control" id="lastname" name="lastname" placeholder="Nom" onChange={ handleChange } required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstname">Prénom(*)</label>
                        <input type="text" className="form-control" id="firstname" name="firstname" placeholder="Prénom" onChange={ handleChange } required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email(*)</label>
                        {(msgError &&(<span className='msgError'>{ msgError }</span>))}
                        
                        <input type="email" className="form-control" id="email" name="email" placeholder="Email"  onChange={ handleChange } required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mot de passe(*)</label><span id="msg_mdp_signup"></span>
                        <input type="password" className="form-control" id="password" name="password" minLength="8" placeholder="Mot de passe" onChange={ handleChange } required/>
                        <div className="info">
                          <p className='title'>Le mot de passe doit respecter les conditions suivantes :</p>
                          <p>
                            <span>Au moins 1 caractère majuscule.</span><br/>
                            <span>Au moins 1 caractère minuscule.</span><br/>
                            <span>Au moins 1 chiffre.</span><br/>
                            <span>Au moins 1 caractère spécial.</span><br/>
                            <span>Minimum 8 caractères.</span>
                          </p>
                        </div>
                        <div>
                          <p>(*) : Champs obligatoires</p>
                        </div>
                    </div>
                    <div className="text-center form-group pt-4">
                    {(msgError &&(<p><span className='msgError'>{ msgError }</span></p>))}
                        <button onClick={handleSubmit} aria-label="S'enregistrer">S'enregistrer</button> ou <button aria-label="Se connecter" onClick={() => redirect('/login')}>Se connecter</button>
                    </div>
                
            </div>
        </div>
    );
};

export default Signup;