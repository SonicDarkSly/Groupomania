import React, { useEffect, useState, useContext} from 'react';
import Header from '../components/Header';
import Auth from "../context/Auth";
import { login } from '../services/userApi';

const Login = ({ history }) => {

  // Appel du context Auth
  const { isAuthenticated, setisAuthenticated } = useContext(Auth);

  // Initialisation State
  const [user, setUser] = useState({
    email: "",
    password:""
  })
  
  // Attribution des valeurs des inputs email et password au State user
  const handleChange = ({currentTarget}) => {
    const {name, value} = currentTarget;
    setUser({...user, [name]: value})
  }

  // Validation du formulaire de login
  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const response = await login(user);
      setisAuthenticated(response);
    } catch ({ response }) {
      
    }
  }
  
  // Redirection si non connecté
  useEffect(() => {
    if (isAuthenticated === true) {
      history.replace('/account');
    }
  }, [history, isAuthenticated]);
  


  return (
    <div className="login">
      <Header />
      <h1>Se connecter</h1>
      <div className="container container-login">
        <form onSubmit={ handleSubmit } encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="email">Email(*)</label>
          <input type="email" className="form-control" id="email" name="email" placeholder="Email" onChange={ handleChange } required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe(*)</label>
          <input type="password" className="form-control" id="password" name="password" placeholder="Mot de passe" onChange={ handleChange } required />
        </div>
        <div className="text-center form-group pt-4">
          <button aria-label="Se connecter" type="submit">Se connecter</button> ou <button aria-label="Se connecter" onClick={() => window.location.href='/signup'}>S'enregistrer</button>
       </div>
      </form>
      </div>
    </div>
  );
}
 
export default Login;