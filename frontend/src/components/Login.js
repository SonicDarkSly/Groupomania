import React, { useState } from 'react';
 
function Login() {
 
  const [email, setEmail] = useState('');

  function getLogin() {


    // recupération des info du backend selon email et password
    let user = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    }
    fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "content-type": "application/json"
      }
    })
    .then(response => response.json())  
    .then(response => storage(response))

    .catch(function(err) {
      console.log('Il y a eu un problème avec l\'opération fetch: '+err);
    });
  }

  // creation du localStorage contenant les info de l'user
  function storage(info) {
    let infoUser = {
      userid: info.userId,
      email: info.email,
      lastname: info.lastname,
      firstname: info.firstname,
      accesslevel: info.accesslevel,
      token: info.token
    };

    localStorage.setItem("infoUser", JSON.stringify(infoUser));
  }


  return (
    <div className="login">
      <div className="login-title">
        Login
      </div>
      <div className="login-container">
        <div>
          <p>Email : </p>
          <p><input type="text" id="email"/></p>
        </div>
        <div>
        <p>Password : </p>
        <p><input type="password" id="password"/></p>
        </div>
        <div>
          <input type="button" value='se connecter' onClick={getLogin} />
        </div>
      </div>
    </div>
  );
}
 
export default Login;