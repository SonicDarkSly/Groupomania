import React from 'react';
import Header from '../components/Header';

const Notfound = () => {
    return (
        <div className="notfound">
            <Header />
            <div className="container text-center container-notfound">
                    <h1>Error 404</h1>
                    <p>Page not found</p>
                    <p><a href="/">Return Home</a></p>
            </div>
        </div>
    );
};

export default Notfound;