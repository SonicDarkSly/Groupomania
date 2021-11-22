import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Auth from '../context/Auth';
import { logout } from '../services/AuthApi';

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
                    <img src="./images/logo.png" alt=""/>
                </div>
                <div className="col-8">
                    <nav className="navbar navbar-light container">
                        <div className="container justify-content-end">
                            <div className="container row m-0">
                                <div className="col"><NavLink exact to="/" className="nav-link"><i className="fas fa-home"></i></NavLink></div>

                                {(isAuthenticated === true && (
                                    
                                    <>
                                    <div className="col"><NavLink exact to="/posts" className="nav-link"><i className="far fa-edit"></i></NavLink></div>
                                    <div className="col"><NavLink exact to="/account" className="nav-link"><i className="fas fa-user"></i></NavLink></div>
                                    <div className="col"><NavLink exact to="/account" className="nav-link" onClick={ handleLogOut }><i className="fas fa-power-off"></i></NavLink></div>
                                    </>
                                )) || (
                                    <div className="col"><NavLink exact to="/login" className="nav-link"><i className="fas fa-sign-in-alt"></i></NavLink></div>
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