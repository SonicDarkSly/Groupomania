import React, { useContext } from "react";
import { Redirect, Route } from "react-router";
import Auth from "../context/Auth";

// Context pour identification
const AuthenticatedRoute = ({ path, component }) => {
    const { isAuthenticated } = useContext(Auth);
    
    // Si pas connecté (isAuthenticated = false), redirect vers page login
    return isAuthenticated ? (
        <Route exact path={path} component={component} />
    ) : <Redirect to="/login" />
}

export default AuthenticatedRoute;