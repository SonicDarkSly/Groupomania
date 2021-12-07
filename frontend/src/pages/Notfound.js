import React from 'react';
import Header from '../components/Header';

const Notfound = () => {
    return (
        <div className="notfound">
            <Header />
            
            <div className="container text-center">
                    <h1>Error 404</h1>
                    <p>Page not found</p>
                
            </div>
        </div>
    );
};

export default Notfound;