import React from 'react';
import NavHeader from './NavHeader';

const Header = () => {
    return (
        <div className="header">
            <div className="">
                <div className="logo">
                    <img src="./images/logo.png" alt="logo du groupe groupomania"/>
                </div>
                <div>
                    <NavHeader />
                </div>
            </div> 
        </div>
    );
};

export default Header;