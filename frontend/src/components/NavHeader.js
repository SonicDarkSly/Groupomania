import React, { useContext } from 'react';
import Auth from '../context/Auth';
import { logout } from '../services/userApi';
import { NavLink } from 'react-router-dom';

const NavHeader = () => {

    const { isAuthenticated, setisAuthenticated } = useContext(Auth);

    const handleLogOut = () => {
        logout();
        setisAuthenticated(false);
    }

    return (
        <div className="navHeader">
            <nav>
                <NavLink exact to="/" aria-label="Home"><i className="fas fa-home" aria-hidden="true" title="Home"></i></NavLink>
                {(isAuthenticated === true && (
                <>
                    <NavLink exact to="/posts" aria-label="Post"><i className="fas fa-comments" aria-hidden="true" title="Post"></i></NavLink>
                    <NavLink exact to="/account" aria-label="Compte"><i className="fas fa-user" aria-hidden="true" title="Compte"></i></NavLink>
                    <NavLink exact to="/" aria-label="Déconnection" onClick={ handleLogOut }><i className="fas fa-power-off" aria-hidden="true" title="Déconnection"></i></NavLink>
                </>
                )) || (
                <NavLink exact to="/login" aria-label="Connexion"><i className="fas fa-sign-in-alt" aria-hidden="true" title="Connexion"></i></NavLink>
                )}
            </nav>
        </div>
    );
};

export default NavHeader;