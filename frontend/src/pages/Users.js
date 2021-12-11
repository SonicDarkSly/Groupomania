import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { getItem } from "../services/Localestorage";

const Users = () => {

    const [user, setUser] = useState([]);

    const getUser = () => {

        const token = getItem('storageToken');

        const urlId = window.location.search;
        const urlSearchId = new URLSearchParams(urlId);
        const userid = urlSearchId.get("userId");

         axios
        .get('http://localhost:8080/api/user/profile/'+userid, {
            headers: { 
                Authorization: `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            },
        })
        .then((datas) => {
            setUser(datas.data);
            
        })
        .catch((err) => {
            console.log(err);
        });
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className="users">
            <Header />

            {      
            <> 
            {user.map(data => 
                <div className="div-container" key={data.id}>
                    <div className="div-avatar">
                        <img src={ data.avatarurl } alt="mon avatar" />
                        <span className="icon-edit-avatar"></span>
                    </div>
                    <div className="div-infouser">
                        <div className="name">
                            <h1>#{ data.id } { data.firstname } { data.lastname }</h1>
                        </div>
                        { (data.accesslevel >= 3 &&(<p><span className="title-p">Niveau : </span><span>Administrateur</span></p>)) }
                        { (data.accesslevel <= 1 &&(<p><span className="title-p">Niveau : </span><span>Utilisateur</span></p>)) }
                        <p><span className="title-p">Description : </span><span>{ data.description }</span></p>
                    </div>
                </div>
            )}
            </>
            }
        </div>
    );
};

export default Users;