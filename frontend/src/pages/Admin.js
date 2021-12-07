import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { getItem } from "../services/Localestorage";
import axios from 'axios';

const Admin = () => {

    // récupération de tous les user de la BDD
    const [user, setUser] = useState([]);
    const getUser = () => {
        const token = getItem('storageToken');
        axios
        .get('http://localhost:8080/api/user/admin', {
            headers: { 
                Authorization: `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            },
        })
        .then((datas) => {
            setUser(datas.data);
            console.log(datas.data);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    useEffect(() => {
        getUser();
    }, []);


    //


    return (
        <div className="admin">
            <Header />
            <h1>Espace administrateur</h1>
            <div className="div-container">
                <div>
                
                <label htmlFor="user">Sélection utilisateur : </label>
                <select id="user">

                {user.map(data => 
                    <option value={ data.id } key={'key_'+data.id }>{ data.id+' - '+ data.firstname+' '+data.lastname }</option>
                )}
                </select>
                <button>afficher</button>
                
                </div>

            </div>
        </div>
    );
};

export default Admin;