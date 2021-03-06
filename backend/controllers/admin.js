// Import
// Appel de bcrypt pour le hashage du mot de passe
const bcrypt = require('bcrypt')

// Appel de jsonwebtoken pour la gestion du TOKEN (creation)
const jwt = require('jsonwebtoken')

// Appel de dbConfig pour les info de la BDD
const db = require("../middleware/dbConfig");

// Appel de FS pour la gestion des avatar user
const fs = require('fs');
const path = require('path');


// ---------- GET ACCESS ADMIN ----------

exports.getAccessAdmin = (req, res, next) => {

    const adminId = req.body.adminId;
    const adminPass = req.body.adminPass;

    // Recherche dans la BDD
    const sql = `SELECT * FROM users WHERE id=${adminId}`;
    db.query(sql, (err, results) => {
                        
        // Si erreur retourne 400
        if (err) {
            console.log(err)
            return res.status(400).json(err)
        } else {
                
            // Verification du MDP
            bcrypt.compare(adminPass, results[0].password)
            .then(valid => {
                    
                // Si MDP invalide erreur
                if (!valid) {
                    console.log('Mot de passe incorrect')
                    return res.status(401).json({
                        message: 'Mot de passe incorrect'
                    });
                        
                // Si MDP valide
                } else {

                    // Si level >=3
                    if (results[0].accesslevel >= 3) {
                        res.status(200).json(results[0].accesslevel)
                    } else {
                        console.log('Pas le niveau nécéssaire')
                        return res.status(403).json({
                            message: 'Pas le niveau nécéssaire'
                        });
                    }
                }
            });
        }
    })
}

// ---------- GET USER ADMIN ----------

exports.getUserAdmin = (req, res, next) => {

    // Recherche dans la BDD
    const sql = `SELECT * FROM users`;
    db.query(sql, (err, results) => {
                        
        // Si erreur retourne 400
        if (err) {
            console.log(err)
            return res.status(400).json(err)
        } else {

            // Envoi vers le frontend
            return res.status(200).json(results)
        }
    })
}

// ---------- GET USERID ADMIN ----------

exports.getUserIdAdmin = (req, res, next) => {

    // Récupère l'userid
    const userid = req.params.userid;

    // Recherche dans la BDD
    const sql = `SELECT * FROM users WHERE id=${userid}`;
    db.query(sql, (err, results) => {
                        
        // Si erreur retourne 400
        if (err) {
            console.log(err)
            return res.status(400).json(err)
        } else {
            // Envoi vers le frontend des info user
            res.status(200).json(results)
        }
    })
}


// ---------- UPDATE LEVEL USER BY ADMIN ----------

exports.adminUpdateUserLevel = (req, res, next) => {

    // Récupère l'userid et le nouveau level de la requete
    const userIdToUpdate = req.body.userIdToUpdate;
    const newLevel = req.body.updateLevel;

    // Mise à jour dans la BDD 
    const sql = `UPDATE users SET accesslevel='${newLevel}' WHERE id=${userIdToUpdate}`;
    db.query(sql, (err)  => {
                        
        // Si erreur retourne 400
        if (err) {
            console.log(err)
            return res.status(400).json(err)
        } else {
                
            // Si erreur retourne 400
            if (err) {
                console.log(err)
                return res.status(400).json(err)
            }
                    
            // Si valide, retourne 201 vers le frontend
            console.log('Niveau modifier avec succes')
            return res.status(201).json({ message: 'Niveau modifier avec succes' })
        }
    })
}

// ---------- UPDATE PASSWORD USER BY ADMIN ----------

exports.adminUpdateUserPassword = (req, res, next) => {

    // Récupère l'userid et le nouveau password de la requete
    const userIdToUpdate = req.body.userIdToUpdate;
    const newPassword = req.body.updatePassword;

    // hashage du mdp
    bcrypt.hash(newPassword, 10)
    .then(cryptedNewPassword => {

        // Si bon mot de passe, mise à jour dans la BDD 
        const sql = `UPDATE users SET password='${cryptedNewPassword}' WHERE id=${userIdToUpdate}`;
        db.query(sql, (err)  => {
            
            // Si erreur retourne 400
            if (err) {
                console.log(err)
                return res.status(400).json(err)
            } else {
                    
                // Si erreur retourne 400
                if (err) {
                    console.log(err)
                    return res.status(400).json(err)
                }
                    
                // Si valide, retourne 201 vers le frontend
                console.log('Mot de passe modifier avec succes')
                return res.status(201).json({ message: 'Mot de passe modifier avec succes' })
            }
        })
    })
}

// ---------- UPDATE EMAIL USER BY ADMIN ----------

exports.adminUpdateUserEmail = (req, res, next) => {

    // Récupère l'userid et le nouveau email de la requete
    const userIdToUpdate = req.body.userIdToUpdate;
    const newEmail = req.body.updateEmail;

    // Mise à jour dans la BDD 
    const sql = `UPDATE users SET email='${newEmail}' WHERE id=${userIdToUpdate}`;
    db.query(sql, (err)  => {
                        
        // Si erreur retourne 400
        if (err) {
            console.log(err)
            return res.status(400).json(err)
        } else {
                
            // Si erreur retourne 400
            if (err) {
                console.log(err)
                return res.status(400).json(err)
            }
                    
            // Si valide, retourne 201 vers le frontend
            console.log('Email modifier avec succes')
            return res.status(201).json({ message: 'Email modifier avec succes' })
        }
    })
}

// ---------- UPDATE LASTNAME USER BY ADMIN ----------

exports.adminUpdateUserLastName = (req, res, next) => {

    // Récupère l'userid et le nouveau lastname de la requete
    const userIdToUpdate = req.body.userIdToUpdate;
    const newLastName = req.body.updateLastName;

    // Mise à jour dans la BDD 
    const sql = `UPDATE users SET lastname='${newLastName}' WHERE id=${userIdToUpdate}`;
    db.query(sql, (err)  => {
                        
        // Si erreur retourne 400
        if (err) {
            console.log(err)
            return res.status(400).json(err)
        } else {
                
            // Si erreur retourne 400
            if (err) {
                console.log(err)
                return res.status(400).json(err)
            }
                    
            // Si valide, retourne 201 vers le frontend
            console.log('Nom modifier avec succes')
            return res.status(201).json({ message: 'Nom modifier avec succes' })
        }
    })
}

// ---------- UPDATE FIRSTNAME USER BY ADMIN ----------

exports.adminUpdateUserFirstName = (req, res, next) => {

    // Récupère l'userid et le nouveau firstname de la requete
    const userIdToUpdate = req.body.userIdToUpdate;
    const newFirstName = req.body.updateFirstName;

    // Mise à jour dans la BDD 
    const sql = `UPDATE users SET firstname='${newFirstName}' WHERE id=${userIdToUpdate}`;
    db.query(sql, (err)  => {
                        
        // Si erreur retourne 400
        if (err) {
            console.log(err)
            return res.status(400).json(err)
        } else {
                
            // Si erreur retourne 400
            if (err) {
                console.log(err)
                return res.status(400).json(err)
            }
                    
            // Si valide, retourne 201 vers le frontend
            console.log('Prénom modifier avec succes')
            return res.status(201).json({ message: 'Prénom modifier avec succes' })
        }
    })
}

// ---------- DELETE USER BY ADMIN ----------

exports.adminDeleteUser = (req, res, next) => {

    // Récupère l'userid
    const userIdToUpdate = req.body.userIdToUpdate;

    const sqlSearchUser = `SELECT * FROM users WHERE id='${userIdToUpdate}'`;
    db.query(sqlSearchUser, (err, resultAvatar) => {

        // Récupération de l'avatar
        const useravatar = resultAvatar[0].avatarurl;
        const avatarfilename = useravatar.split(`/${userIdToUpdate}/`)[1];

        // suppression de l'avatar
        if (avatarfilename !== 'avatar_user_default.jpeg') {
            fs.unlink(`images/avatars/${userIdToUpdate}/${avatarfilename}`, (err => {
                if (err) {
                    console.log('Aucun fichier trouvé');
                    return false
                } else {
                    console.log('Avatar du user '+userIdToUpdate+' supprimer avec succes');
                    return true
                }
            }));

            // Dossier du user contenant son avatar
            const dirAvatar = `images/avatars/${userIdToUpdate}`;
                            
            // Suppression du dossier user
            fs.rm(dirAvatar, { recursive: true, force: true }, (err) => {
                if (err) {
                    throw err;
                }
                console.log(`dossier ${dirAvatar} supprimer avec succes`);
            });
        }

        // Recherche des images postées par le user
        const sqlSearchPost = `SELECT * FROM posts WHERE userid='${userIdToUpdate}'`;
        db.query(sqlSearchPost, (err, resultImgPost) => {

            // boucle map
            resultImgPost.map(data => {
                const userImgPost = data.imageurl;
                const imgPostfilename = userImgPost.split(`/${data.userid}/`)[1];

                // suppression des images
                    fs.unlink(`images/posts/${data.userid}/${imgPostfilename}`, (err => {
                        if (err) {
                            console.log('Aucun fichier trouvé');
                            return false
                        } else {
                            console.log('images de posts du user '+data.userid+' supprimer avec succes');
                            return true
                        }
                    }));
            });
            
            // dossier du user contenant les images des post
            const dir = `images/posts/${userIdToUpdate}`;
                            
            // Suppression du dossier user
            fs.rm(dir, { recursive: true, force: true }, (err) => {
                if (err) {
                    throw err;
                }
                console.log(`dossier ${dir} supprimer avec succes`);
            });

            
            // Suppression des posts de l'user
            const sqlDeletePost = `DELETE FROM posts WHERE userid='${userIdToUpdate}'`;
            db.query(sqlDeletePost, (err)  => {

                // Si erreur retourne 400
                if (err) {
                    console.log(err)
                    return res.status(400).json(err)
                } else {
                
                    // Si valide retourne 200
                    console.log('Les posts du user '+userIdToUpdate+' ont bien été supprimés')

                    // Suppression des likes / dislikes de l'user
                    const sqlDeleteOpinion = `DELETE FROM opinions WHERE userid='${userIdToUpdate}'`;
                    db.query(sqlDeleteOpinion, (err)  => {
                        
                        // Si erreur retourne 400
                        if (err) {
                            console.log(err)
                            return res.status(400).json(err)
                        } else {
                    
                            // Si valide retourne 200
                            console.log('Les likes / dislikes du user '+userIdToUpdate+' ont bien été supprimés')
                    
                            // Suppression des commentaires de l'user
                            const sqlDeleteComment = `DELETE FROM comments WHERE userid='${userIdToUpdate}'`;
                            db.query(sqlDeleteComment, (err)  => {

                                // Si erreur retourne 400
                                if (err) {
                                    console.log(err)
                                    return res.status(400).json(err)
                                } else {
                    
                                    // Si valide retourne 200
                                    console.log('Les commentaires '+userIdToUpdate+' ont bien été supprimés')
                                
                                    // Suppression des commentaires de l'user
                                    const sqlDeleteUser = `DELETE FROM users WHERE id='${userIdToUpdate}'`;
                                    db.query(sqlDeleteUser, (err)  => {

                                        // Si erreur retourne 400
                                        if (err) {
                                            console.log(err)
                                            return res.status(400).json(err)
                                        } else {
                                        
                                            // Si valide retourne 200
                                            console.log('Compte '+userIdToUpdate+' et toutes ses données supprimés avec succes')
                                            return res.status(200).json({ message: 'Compte '+userIdToUpdate+' et toutes ses données supprimés avec succes' })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        })
    })
}
