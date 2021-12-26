import { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import Posts from "./pages/Posts";
import Users from "./pages/Users";
import Notfound from "./pages/Notfound";

import { hasAuthenticated } from './services/userApi'
import Auth from "./context/Auth";
import AuthenticatedRoute from "./services/AuthenticatedRoute";

require('dotenv').config();

function App() {

  const [isAuthenticated, setisAuthenticated] = useState(hasAuthenticated());

  return (
    
    /* Utilisation de Provider pour passer en props la validité du token contenu dans le state (connexion du user) */
    <Auth.Provider value={{isAuthenticated, setisAuthenticated}}>

      { 
      /* AuthenticatedRoute = Si user non connecté, renvoi vers page login */ 
      /* Route = Page accessible sans login */ 
      }

      <BrowserRouter>
         <Switch>
           <Route exact path="/" component= { Home } />
           <AuthenticatedRoute exact path="/posts" component= { Posts } />
           <Route exact path="/login" component= { Login } />
           <Route exact path="/signup" component= { Signup } />
           <AuthenticatedRoute exact path="/account" component= { Account } />
           <AuthenticatedRoute exact path="/administration" component= { Admin } />
           <AuthenticatedRoute exact path="/users" component= { Users } />
           <Route component= { Notfound } />
         </Switch>
      </BrowserRouter>
  
    </Auth.Provider>
  );
}

export default App;
