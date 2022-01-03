import React, { useEffect, useState, useContext} from 'react';
import Header from '../components/Header';
import Auth from "../context/Auth";
import axios from 'axios';
import { addItem } from "../services/Localestorage";

const Login = ({ history }) => {

  // Appel du context Auth
  const { isAuthenticated, setisAuthenticated } = useContext(Auth);

  const [msgError, setMsgError] = useState()

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
      console.log(response);
    }
  }
  
  // Function login
  function login(credentials) {
    return axios
        .post("http://localhost:8080/api/user/login", credentials)
        .then((response) => {
            const userInfo = [
                response.data.passCrypted
            ];
            addItem('storageToken', response.data.token);
            addItem('storageUserInfo', JSON.stringify(userInfo)); 

            window.location.reload();
        })
        .catch(error => {
          if (error.response.status === 404) {
            setMsgError('Email inconnu');
          }  
          if (error.response.status === 401) {
            setMsgError('Mot de pass incorrect');
          }
        })
  }

  // Redirection si non connecté
  useEffect(() => {
    if (isAuthenticated === true) {
      history.replace('/account');
    }
  }, [history, isAuthenticated, msgError]);
  
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
        <div className="div-error">
         { (msgError &&(<span className='error'>Erreur : { msgError }</span>)) }
       </div>
        <div className="text-center form-group pt-4">
          <button aria-label="Se connecter" type="submit">Se connecter</button> ou <button aria-label="S'enregistrer" onClick={() => window.location.href='/signup'}>S'enregistrer</button>
       </div>
      </form>
      </div>
    </div>
  );
}
 
export default Login;