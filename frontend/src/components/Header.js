import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Auth from '../context/Auth';
import { logout } from '../services/userApi';

const Header = () => {

    const { isAuthenticated, setisAuthenticated } = useContext(Auth);

    const handleLogOut = () => {
        logout();
        setisAuthenticated(false);
    }

    return (
        <div className="header">
            <div className="container-fluid row">
                <div className="logo col-4">
                    <img src="./images/logo.png" alt="logo du groupe groupomania"/>
                </div>
                <div className="col-8">
                    <nav className="navbar navbar-light container">
                        <div className="container justify-content-end">
                            <div className="container row m-0">

                                
                                
                                
                                
                                <div className="col"><NavLink exact to="/" className="nav-link" aria-label="Home"><i className="fas fa-home" aria-hidden="true" title="Home"></i></NavLink></div>

                                {(isAuthenticated === true && (
                                    
                                    <>
                                    <div className="col"><NavLink exact to="/posts" className="nav-link" aria-label="Post"><i className="far fa-edit" aria-hidden="true" title="Post"></i></NavLink></div>
                                    <div className="col"><NavLink exact to="/account" className="nav-link" aria-label="Compte"><i className="fas fa-user" aria-hidden="true" title="Compte"></i></NavLink></div>
                                    <div className="col"><NavLink exact to="/account" className="nav-link" aria-label="Déconnection" onClick={ handleLogOut }><i className="fas fa-power-off" aria-hidden="true" title="Déconnection"></i></NavLink></div>
                                    </>
                                )) || (
                                    <div className="col"><NavLink exact to="/login" className="nav-link" aria-label="Connexion"><i className="fas fa-sign-in-alt" aria-hidden="true" title="Connexion"></i></NavLink></div>
                                )}

                                
                            </div>
                        </div>
                    </nav> 
                </div>
            </div> 
        </div>
    );
};

export default Header;