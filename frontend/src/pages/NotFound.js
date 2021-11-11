import React from 'react';
import { NavLink } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="notfound">
            <div className="block-center">
                <h1>Error 404</h1>
                <NavLink exact to="/">Retour</NavLink>
            </div>
        </div>
    );
};

export default NotFound;