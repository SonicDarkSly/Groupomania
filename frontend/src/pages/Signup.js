import React, { useEffect, useContext, useState} from 'react';
import Auth from "../context/Auth";
import Header from '../components/Header';
import { signup } from '../services/userApi';
import { checksignup } from '../services/checkform'

const Signup = ({ history }) => {

    const { isAuthenticated } = useContext(Auth);

    const [usersignup, setusersignup] = useState({
        "lastname": "",
        "firstname": "",
        "email": "",
        "password": "",
        "avatar": "",
        "description": ""
      })

      const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setusersignup({...usersignup, [name]: value})
      }

      const handleSubmit = event => {
        event.preventDefault();
        try {
          
          if (checksignup()) {
            history.replace('/account');
            signup(usersignup);
          }
          
        } catch ({ response }) {
          
        }
      }

    useEffect(() => {
        if (isAuthenticated === true) {
          history.replace('/account');
        }
      }, [history, isAuthenticated]);

    return (
        <div className="signup">
            <Header />
            <h1>Enregistrement</h1>
            <div className="container">
                <form onSubmit={handleSubmit}>
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
                        <input type="email" className="form-control" id="email" name="email" placeholder="Email"  onChange={ handleChange } required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mot de passe(*)</label><span id="msg_mdp_signup"></span>
                        <input type="password" className="form-control" id="password" name="password" minLength="8" placeholder="Mot de passe" onChange={ handleChange } required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea className="form-control" id="description" name="description" rows="3" onChange={ handleChange }></textarea>
                    </div>
                    <div className="text-center form-group pt-4"> 
                        <button type="submit" aria-label="S'enregistrer">S'enregistrer</button> ou <button aria-label="Se connecter" onClick={() => window.location.href='/login'}>Se connecter</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;