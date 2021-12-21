import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { getItem } from "../services/Localestorage";
import { checkChangePasswordAdmin } from '../services/checkform';
import axios from 'axios';
import { getUserId } from '../services/userApi'; 

const Admin = () => {
    
    // State message
    const [msgUpdateLastName, setMsgUpdateLastName] = useState()
    const [msgUpdateFirstName, setMsgUpdateFirstName] = useState()
    const [msgUpdateEmail, setMsgUpdateEmail] = useState()
    const [msgUpdatePassword, setMsgUpdatePassword] = useState()
    const [msgUpdateLevel, setMsgUpdateLevel] = useState()
    const [msgUpdateDelete, setMsgUpdateDelete] = useState()

    // State message d'erreur
    const [msgError, setMsgError] = useState()

    // State pour afficher l'espace admin (true / false)
    const [userAdmin, setUserAdmin] = useState(false);

    // Récupère le niveau de l'admin
    const [adminLevel, setAdminLevel] = useState();

    // Recherche l'userId de l'utilisateur connecter / fonction getUserInfo
    const [adminId, setAdminId] = useState();

    const getUserInfo = async () => {
        try {
            const response = await getUserId();
            setAdminId(response.id); 
        } catch ({ error }) {
            console.log(error);
        }
    }

    // Itinialisation du state de recupération du mot de passe du form access
    const [adminPass, setAdminPass] = useState();

    // Itinialisation du state de l'user concerné par la modif
    const [userIdToUpdate, setUserIdToUpdate] = useState();

    // userId et pass admin pour transmettre à la requete
    const credentialAdminAccess = [adminId, adminPass];

    // Récupération du token dans le localstorage
    const token = getItem('storageToken');


    /* ACCES ADMINISTRATION */


    // Requete pour controle acces administration
    const reqAccess = () => {
        if (!adminPass) {
            setMsgError('Veuillez indiquer un mot de passe');
        } else {
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : 'Bearer '+token
                }
            }
            axios.post('http://localhost:8080/api/admin/access', 
                {
                    adminId: credentialAdminAccess[0],
                    adminPass: credentialAdminAccess[1]
                }, 
                config
            )
            .then((res) => {
                if (res.status === 200) {
                    setUserAdmin(true);
                    setAdminLevel(res.data);
                }else{
                    setUserAdmin(false);
                }
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    setMsgError(err.response.data.message);
                  }  
                if (err.response.status === 401) {
                    setMsgError(err.response.data.message);
                }
            });
        }
    };


    /* GET ALL USERS */


    // récupération de tous les user de la BDD
    const [user, setUser] = useState([]);
    const getUser = () => {
        const token = getItem('storageToken');
        axios
        .get('http://localhost:8080/api/admin/get/allusers', {
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


    /* GET ONE USER */


    // State
    const [getuser, setGetUser] = useState([]);

    // Onchange
    const handleChange = () => {
        const userid = document.getElementById('user').value;
        if (userid !== '') {
            setMsgUpdateLastName();
            setMsgUpdateFirstName();
            setMsgUpdateEmail();
            setMsgUpdatePassword();
            setMsgUpdateLevel();
            setMsgUpdateDelete();
            setUserIdToUpdate(userid);
            getUserById(userid);  
        }
    }
    // Requete
    const getUserById = (userid) => {
        const token = getItem('storageToken');
        axios
        .get('http://localhost:8080/api/admin/get/'+userid, {
            headers: { 
                Authorization: `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            },
        })
        .then((datas) => {
            setGetUser(datas.data);
        })
        .catch((err) => {
            console.log(err);
        });
    };


    /* UPDATE LEVEL */


    // state update
    const [levelUpdate, setlevelUpdate] = useState();

    // Fonction update level
    const adminUpdateLevel = () => {
        const promptIdUpdate = prompt("Veuillez tapez l'ID \""+userIdToUpdate+"\"  de l'utilisateur concerné par la modification du niveau", "");
        if (promptIdUpdate === userIdToUpdate) {
            if (!levelUpdate) {
                setMsgUpdateLevel("Veuillez sélectionnez un niveau différent de l'ancien");
            } else {
                let config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : 'Bearer '+token
                    }
                }
                axios.post('http://localhost:8080/api/admin/update/level', 
                    {
                        userId: adminId,
                        userIdToUpdate: userIdToUpdate,
                        updateLevel: levelUpdate
                    }, 
                    config
                )
                .then((res) => {
                    setMsgUpdateLevel(res.data.message);
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        }else{
            alert('ID utilisateur incorrect ou action annulée');
        }
    }


    /* UPDATE PASSWORD */


    // state update
    const [passwordUpdate, setPasswordUpdate] = useState();

    // Fonction update password
    const adminUpdatePassword = () => {
        const promptIdUpdate = prompt("Veuillez tapez l'ID \""+userIdToUpdate+"\"  de l'utilisateur concerné par la modification du mot de passe", "");
        if (promptIdUpdate === userIdToUpdate) {
            if (checkChangePasswordAdmin()) {
                if (!passwordUpdate) {
                    setMsgUpdatePassword('Veuillez sélectionnez un mot de passe');
                } else {
                    let config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization' : 'Bearer '+token
                        }
                    }
                    axios.post('http://localhost:8080/api/admin/update/password', 
                        {
                            userId: adminId,
                            userIdToUpdate: userIdToUpdate,
                            updatePassword: passwordUpdate
                        }, 
                        config
                    )
                    .then((res) => {
                        setMsgUpdatePassword(res.data.message);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                }
            }
        }else{
            alert('ID utilisateur incorrect ou action annulée');
        }

    }


    /* UPDATE EMAIL */


    // state update
    const [emailUpdate, setEmailUpdate] = useState();

    // Fonction update email
    const adminUpdateEmail = () => {
        const promptIdUpdate = prompt("Veuillez tapez l'ID \""+userIdToUpdate+"\"  de l'utilisateur concerné par la modification de l'email", "");
        if (promptIdUpdate === userIdToUpdate) {
            if (!emailUpdate) {
                setMsgUpdateEmail("Veuillez sélectionnez un email différent de l'ancien");
            } else {
                let config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : 'Bearer '+token
                    }
                }
                axios.post('http://localhost:8080/api/admin/update/email', 
                    {
                        userId: adminId,
                        userIdToUpdate: userIdToUpdate,
                        updateEmail: emailUpdate
                    }, 
                    config
                )
                .then((res) => {
                    setMsgUpdateEmail(res.data.message);
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        }else{
            alert('ID utilisateur incorrect ou action annulée');
        }
    }


     /* UPDATE LASTNAME */


    // state update
    const [lastNameUpdate, setLastNameUpdate] = useState();

    // Fonction update lastname
    const adminUpdateLastname = () => {
        const promptIdUpdate = prompt("Veuillez tapez l'ID \""+userIdToUpdate+"\"  de l'utilisateur concerné par la modification du nom", "");
        if (promptIdUpdate === userIdToUpdate) {
            if (!lastNameUpdate) {
                setMsgUpdateLastName("Veuillez sélectionnez un nom différent de l'ancien");
            } else {
                let config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : 'Bearer '+token
                    }
                }
                axios.post('http://localhost:8080/api/admin/update/lastname', 
                    {
                        userId: adminId,
                        userIdToUpdate: userIdToUpdate,
                        updateLastName: lastNameUpdate
                    }, 
                    config
                )
                .then((res) => {
                    setMsgUpdateLastName(res.data.message);
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        }else{
            alert('ID utilisateur incorrect ou action annulée');
        }
    }


    /* UPDATE FIRSTNAME */


    // state update
    const [firstNameUpdate, setFirstNameUpdate] = useState();

    // Fonction update lastname
    const adminUpdateFirstname = () => {
        const promptIdUpdate = prompt("Veuillez tapez l'ID \""+userIdToUpdate+"\"  de l'utilisateur concerné par la modification du prénom", "");
        if (promptIdUpdate === userIdToUpdate) {
            if (!firstNameUpdate) {
                setMsgUpdateFirstName("Veuillez sélectionnez un prénom différent de l'ancien");
            } else {
                let config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : 'Bearer '+token
                    }
                }
                axios.post('http://localhost:8080/api/admin/update/firstname', 
                    {
                        userId: adminId,
                        userIdToUpdate: userIdToUpdate,
                        updateFirstName: firstNameUpdate
                    }, 
                    config
                )
                .then((res) => {
                    setMsgUpdateFirstName(res.data.message);
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        }else{
            alert('ID utilisateur incorrect ou action annulée');
        }
    }

    /* DELETE USER */

    // Fonction delete user
    const adminDeleteUser = () => {
        const promptIdUpdate = prompt("Veuillez tapez l'ID \""+userIdToUpdate+"\"  de l'utilisateur concerné par la suppression de compte", "");
        if (promptIdUpdate === userIdToUpdate) {
                let config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : 'Bearer '+token
                    }
                }
                axios.post('http://localhost:8080/api/admin/update/delete', 
                    {
                        userId: adminId,
                        userIdToUpdate: userIdToUpdate,
                    }, 
                    config
                )
                .then((res) => {
                    setMsgUpdateDelete(res.data.message);
                })
                .catch((err) => {
                    console.log(err);
                });
        }else{
            alert('ID utilisateur incorrect ou action annulée');
        }
    }

    // Après controle, affiche l'espace admin
    useEffect(() => {
        getUser();
    }, [userAdmin],[adminLevel],msgError);

    useEffect(() => {
        getUserInfo();
     }, []);

     useEffect(() => {
     }, [msgUpdateLastName,
        msgUpdateFirstName,
        msgUpdateEmail,
        msgUpdatePassword,
        msgUpdateLevel,
        msgUpdateDelete
    ]);

    return (
        <div className="admin">
            <Header />
            <h1>Espace administrateur</h1>

            {/* Si l'administrateur n'est pas connecté */}
            {(userAdmin === false &&(
            <div className="adminFalse">
                <div className="adminAccess-entete">
                    Connexion administrateur
                </div>
                <div className="adminAccess-corps">
                    <label htmlFor="passAdminAccess">Mot de passe</label>
                    <input id="passAdminAccess" type="password" onChange={ (e) => setAdminPass(e.target.value) } required />
                    <div className="div-error">
                        { (msgError &&(<span className='error'>Erreur : { msgError }</span>)) }
                    </div>
                    <button className="btn-admin-access" onClick={ reqAccess }>Valider</button>
                </div>
            </div>
            ))}

            {/* Si l'administrateur est connecté */}
            {(userAdmin === true &&(
            <div>
                <div className="div-container">
                <h2>Modification de compte utilisateur</h2>
                    <div className="info">
                        Ne pas actualiser ni changer de page, sinon il faudra vous re-connecter à la page d'administration
                    </div>
                    <div className="select-user">
                        <select id="user" onChange={ handleChange } aria-label="Sélection utilisateur">
                        <option value="">Liste des utilisateurs</option>

                            {/* map la liste des users dans le select */}
                            {user.map(data => 
                                <option value={ data.id } key={'optionKey_'+data.id }>{ data.id+' - '+ data.firstname+' '+data.lastname }</option>
                            )}
                        </select>
                    </div>
                </div>
                

                {/* map les info du user sélectionné */}  
                {getuser.map(data =>
                <div className="div-container" key={ 'pKey_'+data.id }>
                    <div>
                        <h3>Utilisateur sélectionné : #{ data.id } { data.lastname } { data.firstname }</h3>
                        <div className="container-update">
                            <div className="label-update">
                                <label htmlFor="updateLastName">Nom : </label>
                            </div>
                            <div>
                                <input id="updateLastName" type="text" defaultValue={ data.lastname } onChange={ (e) => setLastNameUpdate(e.target.value) }/>
                                <button id="btnUpdateLastName" className="btn-valid" aria-label="Modifier le nom" onClick={ adminUpdateLastname }><i className="fas fa-sync-alt" aria-hidden="true" title="Modifier le nom'"></i></button>
                                { (msgUpdateLastName &&(<span className='msgUpdate'>{ msgUpdateLastName }</span>)) }
                            </div>
                        </div>
                        <div className="container-update">
                            <div className="label-update">
                                <label htmlFor="updateFirstName">Prénom : </label>
                            </div>
                            <div className="input-update">
                                <input id="updateFirstName" type="text" defaultValue={ data.firstname } onChange={ (e) => setFirstNameUpdate(e.target.value) }/>
                                <button id="btnUpdateFirstName" className="btn-valid" aria-label="Modifier le prénom" onClick={ adminUpdateFirstname }><i className="fas fa-sync-alt" aria-hidden="true" title="Modifier le prénom'"></i></button>
                                { (msgUpdateFirstName &&(<span className='msgUpdate'>{ msgUpdateFirstName }</span>)) }
                            </div>
                        </div>
                        <div className="container-update">
                            <div className="label-update">
                                <label htmlFor="updateEmail">Email : </label>
                            </div>
                            <div className="input-update">
                                <input className="input-mail" id="updateEmail" type="text" defaultValue={ data.email } onChange={ (e) => setEmailUpdate(e.target.value) }/>
                                <button id="btnUpdateEmail" className="btn-valid" aria-label="Modifier l'email" onClick={ adminUpdateEmail }><i className="fas fa-sync-alt" aria-hidden="true" title="Modifier l'email'"></i></button>
                                { (msgUpdateEmail &&(<span className='msgUpdate'>{ msgUpdateEmail }</span>)) }
                            </div>
                        </div>
                        <div className="container-update">
                            <div className="label-update">
                                <label htmlFor="updatePassword">Mot de passe : </label>
                            </div>
                            <div className="input-update">
                                <input id="updatePassword" type="password" defaultValue="" onChange={ (e) => setPasswordUpdate(e.target.value) }/>
                                <button id="btnUpdatePassword" className="btn-valid" aria-label="Modifier le password" onClick={ adminUpdatePassword }><i className="fas fa-sync-alt" aria-hidden="true" title="Modifier le mot de passe"></i></button>
                                { (msgUpdatePassword &&(<span className='msgUpdate'>{ msgUpdatePassword }</span>)) }
                            </div>
                        </div>

                        {/* Si le niveau de l'administrateur est >= 4, affiche la modif des niveaux */}
                        {(adminLevel >= 4 &&(
                        <div className="container-update">
                            <div className="label-update">
                                <label htmlFor="updateLevel">Niveau : </label>
                            </div>
                            <div className="input-update">
                                <select id="updateLevel" onChange={ (e) => setlevelUpdate(e.target.value) }>

                                    {/* Affiche le niveau actuel du user dans un option */}
                                    {(data.accesslevel === 1 &&(<option value={ data.accesslevel }>Utilisateur</option>))}
                                    {(data.accesslevel === 2 &&(<option value={ data.accesslevel }>Modérateur</option>))}
                                    {(data.accesslevel === 3 &&(<option value={ data.accesslevel }>Adminitrateur</option>))}
                                    {(data.accesslevel === 4 &&(<option value={ data.accesslevel }>Super administrateur</option>))}
                                    <option value="1">Utilisateur</option>
                                    <option value="2">Modérateur</option>
                                    <option value="3">Adminitrateur</option>
                                    <option value="4">Super administrateur</option>
                                </select>
                                <button id="btnUpdateLevel" className="btn-valid" aria-label="Modifier le niveau" onClick={ adminUpdateLevel }><i className="fas fa-sync-alt" aria-hidden="true" title="Modifier le niveau"></i></button>
                                { (msgUpdateLevel &&(<span className='msgUpdate'>{ msgUpdateLevel }</span>)) }
                            </div>
                        </div>
                        ))}
                        <div className="container-update">
                            <div className="label-update">
                                <label>Suppression du compte : </label>
                            </div>
                            <div className="input-delete">
                                <button id="btnDelete" className="btn-valid-delete" aria-label="Supprimer le compte" onClick={ adminDeleteUser }>Supprimer le compte</button>
                                { (msgUpdateDelete &&(<span className='msgUpdate'>{ msgUpdateDelete }</span>)) }
                            </div>
                        </div>
                    </div>
                </div>
                )}
                
            </div>
            ))}


        </div>
    );
};

export default Admin;