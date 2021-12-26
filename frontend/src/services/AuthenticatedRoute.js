import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import Auth from "../context/Auth";

// Context pour identification
const AuthenticatedRoute = ({ path, component }) => {
    const { isAuthenticated } = useContext(Auth);
    
    // Si pas connecté (isAuthenticated = false), redirect vers page login
    return isAuthenticated ? (
        <Route exact path={path} component={component} />
    ) :  <Route render={() => <Redirect to="login" />} />
    
}

export default AuthenticatedRoute;