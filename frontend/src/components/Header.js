import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <div className="header">
            <div className="logo">
                <img src="./images/logo.png" alt=""/>
            </div>
            <nav>
                <div className="container-nav">
                    <div className="container-nav-link">
                        <NavLink exact to="/" className="nav-link"><i className="fas fa-home"></i></NavLink>
                    </div>
                    <div className="container-nav-link">
                        <NavLink exact to="/" className="nav-link"><i className="fas fa-user"></i></NavLink>
                    </div>
                    <div className="container-nav-link">
                        <NavLink exact to="/" className="nav-link"><i className="far fa-edit"></i></NavLink>
                    </div>
                </div>
            </nav> 
        </div>
    );
};

export default Header;