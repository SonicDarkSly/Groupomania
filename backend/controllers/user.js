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


// ---------- SIGN UP ----------


exports.signup = (req, res, next) => {

    // Cherche si un user existe dans la BDD
    db.query(`SELECT COUNT (*) AS usrCount FROM users`, (err, resultsc, rows) => {

        // Si aucun user, on enregistre avec un niveau 4 (super admin)
        if (resultsc[0].usrCount === 0) {

            // hashage du mdp
            bcrypt.hash(req.body.password, 10)
            .then(cryptedPassword => {

                // Ajout à la BDD
                db.query(`INSERT INTO users VALUES (NULL, '${req.body.lastname}', '${req.body.firstname}', '${cryptedPassword}', '${req.body.email}', 4, '${req.protocol}://${req.get('host')}/images/avatars/avatar_user_default.jpeg', NULL)`, (err, results, fields) => {

                // Si erreur, retourne 400
                if (err) {
                        console.log(err);
                        return res.status(400).json("erreur");
                    }else{
                    
                        // Recherche les info du user une fois creer pour la creation des dossiers de stockage images
                        db.query(`SELECT * FROM users WHERE email='${req.body.email}'`, (err, results, rows) => {

                            // Creation du dossier pour les images des posts
                            fs.mkdir(path.join(__dirname, `../images/posts/${results[0].id}`), (err) => {
                                if (err) {
                                    return console.error(err);
                                }
                            });
                                    
                            // Creation du dossier pour les images avatar
                            fs.mkdir(path.join(__dirname, `../images/avatars/${results[0].id}`), (err) => {
                                if (err) {
                                    return console.error(err);
                                }
                            });

                            // Si valide, retourne 201
                            console.log('Votre compte a bien été créer !');
                            return res.status(201).json({
                                message: 'Votre compte a bien été créer !'
                            });
                        });
                    }
                });
            })
            .catch(error => res.status(500).json({ error }))

        // Si un user existe deja, on enregistre le nouvel user avec un niveau 1 (utilisateur simple)
        } else {

            // Recherche si l'email existe deja
            db.query(`SELECT * FROM users WHERE email='${req.body.email}'`,
            (err, results, rows) => {
                
                // Si email deja utilisé, erreur 401
                if (results.length > 0) {
                    res.status(401).json({
                        message: 'Email déjà existante'
                    });
                    
                // Si email non existante
                } else {
                    
                    // hashage du mdp
                    bcrypt.hash(req.body.password, 10)
                    .then(cryptedPassword => {


                        // Ajout à la BDD - id, lastname, firstname, password, email, accesslevel, url avatar, description
                        db.query(`INSERT INTO users VALUES (NULL, '${req.body.lastname}', '${req.body.firstname}', '${cryptedPassword}', '${req.body.email}', 1, '${req.protocol}://${req.get('host')}/images/avatars/avatar_user_default.jpeg', NULL)`, (err, results, fields) => {

                            // Si erreur, retourne 400
                            if (err) {
                                console.log(err);
                                return res.status(400).json("erreur");
                            }else{

                                // Recherche les info du user une fois creer pour la creation des dossiers de stockage images
                                db.query(`SELECT * FROM users WHERE email='${req.body.email}'`, (err, results, rows) => {

                                    // Creation du dossier pour les images des posts
                                    fs.mkdir(path.join(__dirname, `../images/posts/${results[0].id}`), (err) => {
                                        if (err) {
                                            return console.error(err);
                                        }
                                    });
                                    
                                    // Creation du dossier pour les images avatar
                                    fs.mkdir(path.join(__dirname, `../images/avatars/${results[0].id}`), (err) => {
                                        if (err) {
                                            return console.error(err);
                                        }
                                    });

                                    // Si valide, retourne 201
                                    console.log('Votre compte a bien été créer !');
                                    return res.status(201).json({
                                        message: 'Votre compte a bien été créer !'
                                    });
                                });
                            }
                        });
                    })
                    // Si erreur de hachage du mdp
                    .catch(error => res.status(500).json({ error }))
                }
            });
        }
    });
};


// ---------- LOGIN ----------


exports.login = (req, res, next) => {

    // Recherche de l'utilisateur dans la BDD
    db.query(`SELECT * FROM users WHERE email='${req.body.email}'`, (err, results, rows) => {

            // Si utilisateur trouvé : 
            if (results.length > 0) {

                // Verification du MDP
                bcrypt.compare(req.body.password, results[0].password)
                    .then(valid => {

                        // Si MDP invalide erreur
                        if (!valid) {
                            res.status(401).json({
                                message: 'Mot de passe incorrect.'
                            });
                            
                        // Si MDP valide création d'un token
                        } else {

                            // Création du token (userId + token) avec durée de vie de 24h
                            const newToken = jwt.sign(
                                { userId: results[0].id }, 
                                `${process.env.RND_TOKEN}`, 
                                { expiresIn: '24h' }
                            )

                            // Envoi de l'entête Authorization avec le token
                            res.setHeader('Authorization', 'Bearer '+newToken);

                            // Envoi vers le frontend des info user + token
                            res.status(201).json({
                                passCrypted: results[0].password,
                                avatarurl: results[0].avatarurl,
                                token: newToken
                            });
                        }
                    });
            } else {

                // Si l'adresse mail n'est pas dans la BDD, retourne 404
                res.status(404).json({
                    message: 'Utilisateur inconnu.'
                });
            }
        }
    );
};


// ---------- DELETE PROFILE ----------

/**
 * Remove directory recursively
 * @param {string} dir_path
 * @see https://stackoverflow.com/a/42505874/3027390
 */
 function rimraf(dir_path) {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(function(entry) {
            var entry_path = path.join(dir_path, entry);
            if (fs.lstatSync(entry_path).isDirectory()) {
                rimraf(entry_path);
            } else {
                fs.unlinkSync(entry_path);
            }
        });
        fs.rmdirSync(dir_path);
    }
}

exports.deleteUser = (req, res, next) => {

    // Recherche dans la BDD les info du user selon son userid
    db.query(`SELECT * FROM users WHERE id='${req.body.userId}'`, (err, results, rows) => {

        // Récupération de l'avatar
        const oldavatar = results[0].avatarurl
        const oldfilename = oldavatar.split(`/${req.body.userId}/`)[1];

        // Controle le mon de passe
        bcrypt.compare(req.body.userPass, results[0].password)

        .then(valid => {

            // Si mauvais mot de passe
            if (!valid) {
                console.log('Mot de passe incorrect.');
                return res.status(401).json({
                    message: 'Mot de passe incorrect.'
                });
            
            // Si bon mot de passe
            } else {

                // suppression de l'avatar
                if (oldfilename !== 'avatar_user_default.jpeg') {
                    fs.unlink(`images/avatars/${req.body.userId}/${oldfilename}`, (err => {
                        if (err) {
                            console.log('Aucun fichier trouvé');
                            return false
                        } else {
                            console.log("Avatar supprimer avec succes");
                            return true
                        }
                    }));

                    // Dossier du user contenant son avatar
                    const dirAvatar = `images/avatars/${req.body.userId}`;
                            
                    // Suppression du dossier user
                    fs.rm(dirAvatar, { recursive: true, force: true }, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log(`${dirAvatar} supprimer avec succes`);
                    });
                }

                // Recherche des images postées par le user
                db.query(`SELECT * FROM posts WHERE userid='${req.body.userId}'`, (err, resultImgPost, rows) => {

                    // boucle map
                    resultImgPost.map(data => {
                        const userImgPost = data.imageurl;
                        const imgPostfilename = userImgPost.split(`/${data.userid}/`)[1];
        
                        // suppression des images
                        fs.unlink(`images/posts/${data.userid}/${imgPostfilename}`, (err => {
                            if (err) {
                                console.log(err);
                                return false
                            } else {
                                console.log('Images de posts du user '+data.userid+' supprimer avec succes');
                                return true
                            }
                        }));

                        // Suppression du dossier user
                        // dossier du user contenant les images des post
                        const dir = `images/posts/${data.userid}`;
                            
                        // Suppression du dossier user
                        fs.rm(dir, { recursive: true, force: true }, (err) => {
                            if (err) {
                                throw err;
                            }
                            console.log(`${dir} supprimer avec succes`);
                        });
                    });
                })

                // Suppression des posts de l'user
                db.query(`DELETE FROM posts WHERE userid='${req.body.userId}'`, (err, results, rows)  => {

                    // Si erreur retourne 400
                    if (err) {
                      console.log(err)
                      return res.status(400).json(err)
                    } else {

                        // Si valide retourne 200
                        console.log('Les posts ont bien été supprimés')
                        return res.status(200).json({ message: 'Les posts ont bien été supprimés' })
                    }
                })

                // Suppression des likes / dislikes de l'user
                db.query(`DELETE FROM opinions WHERE userid='${req.body.userId}'`, (errPost)  => {

                    // Si erreur retourne 400
                    if (errPost) {
                      console.log(errPost)
                      return res.status(400).json(errPost)
                    } else {

                        // Si valide retourne 200
                        console.log('Les likes / dislikes ont bien été supprimés')
                        return res.status(200).json({ message: 'Les likes / dislikes ont bien été supprimés' })
                    }
                })

                // Suppression des commentaires de l'user
                db.query(`DELETE FROM comments WHERE userid='${req.body.userId}'`, (errPost)  => {

                    // Si erreur retourne 400
                    if (errPost) {
                        console.log(errPost)
                        return res.status(400).json(errPost)
                    } else {
                
                        // Si valide retourne 200
                        console.log('Les commentaires ont bien été supprimés')
                        return res.status(200).json({ message: 'Les commentaires ont bien été supprimés' })
                    }
                })

                // Suppression du user
                db.query(`DELETE FROM users WHERE id='${req.body.userId}'`, (err, results, rows)  => {

                    // Si erreur retourne 400
                    if (err) {
                      console.log(err)
                      return res.status(400).json(err)
                    } else {

                        // Si valide retourne 200
                        console.log('Le compte a bien été supprimé !')
                        return res.status(200).json({ message: 'Le compte a bien été supprimé !' })
                    }
                })
            }
        })
        .catch(error => res.status(500).json({ error }))
    })
}


  // ---------- UPDATE AVATAR PROFILE ----------


  exports.updateUserAvatar = (req, res, next) => {

    // Récupère l'userid et le nom du fichier image de la requete
    const userid = req.body.userId
    const urlnewavatar = `${req.protocol}://${req.get('host')}/images/avatars/${userid}/${req.file.filename}`;

    // Recherche dans la BDD selon userid
    db.query(`SELECT * FROM users WHERE id=${userid}`, (err, result, rows) => {

        // Ancien fichier de l'ancien avatar
        const oldavatar = result[0].avatarurl
        const oldfilename = oldavatar.split(`/${userid}/`)[1];

        // suppression de l'ancien fichier image
        if (oldfilename !== 'avatar_user_default.jpeg') {
            fs.unlink(`images/avatars/${userid}/${oldfilename}`, (err => {
                if (err) {
                    console.log(err);
                    return false
                } else {
                  console.log("Ancien avatar supprimer avec succes");
                  return true
                }
            }));
        }

        // Mise à jour dans la BDD 
        db.query(`UPDATE users SET avatarurl='${urlnewavatar}' WHERE id=${userid}`, 
        (err, results, rows)  => {

            // Si erreur retourne 400
            if (err) {
                console.log(err)
                return res.status(400).json(err)
            }else{

                // Si valide, recherche dans la BDD l'url du nouvel avatar
                db.query(`SELECT avatarurl FROM users WHERE id=${userid}`, (err, results, rows) => {

                    // Si erreur retourne 400
                    if (err) {
                        console.log(err)
                        return res.status(400).json(err)
                    }

                    // Si valide, retourne 201 vers le frontend
                    res.status(201).json({
                        avatarurl: results[0].avatarurl
                    });
                })
            }
        })

        // Modification de l'avatar dans les posts de l'user
        db.query(`UPDATE posts SET useravatar='${urlnewavatar}' WHERE userid=${userid}`, (err, results, rows)  => {

            // Si erreur retourne 400
            if (err) {
                console.log(err)
                return res.status(400).json(err)
            }
        })
    })

    console.log('Avatar modifier avec succes')
  }


  // ---------- UPDATE PASSWORD PROFILE ----------


  exports.updateUserPassword = (req, res, next) => {

    // Récupère l'userid, l'ancien password et nouveau password de la requete
    const userid = req.body.userId;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    // Recherche dans la BDD selon userid
    db.query(`SELECT * FROM users WHERE id=${userid}`, (err, result, rows) => {

        // Controle le mon de passe
        bcrypt.compare(oldPassword, result[0].password)

        .then(valid => {

            // Si mauvais mot de passe
            if (!valid) {
                console.log('Ancien mot de passe incorrect.');
                return res.status(401).json({
                    message: 'Ancien mot de passe incorrect.'
                });
            } else {

                // hashage du mdp
                bcrypt.hash(newPassword, 10)
                .then(cryptedNewPassword => {

                    // Si bon mot de passe, mise à jour dans la BDD 
                    db.query(`UPDATE users SET password='${cryptedNewPassword}' WHERE id=${userid}`, (err, results, rows)  => {
                        
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
        })
        .catch(error => res.status(500).json({ error }))
    })
}


// ---------- UPDATE EMAIL PROFILE ----------


exports.updateUserEmail = (req, res, next) => {

    // Récupère l'userid et le nouveau email de la requete
    const userid = req.body.userId;
    const newEmail = req.body.newEmail;

    // Recherche dans la BDD selon userid
    db.query(`SELECT * FROM users WHERE id=${userid}`, (err, result, rows) => {

        // Mise à jour dans la BDD 
        db.query(`UPDATE users SET email='${newEmail}' WHERE id=${userid}`, (err, results, rows)  => {
                        
            // Si erreur retourne 400
            if (err) {
                console.log(err)
                return res.status(400).json(err)
            } else {
                
                // Si erreur retourne 400
                if (err) {
                    console.log(err)
                    return res.status(400).json({ message: 'Adresse email non modifié' })  
                }
                    
                // Si valide, retourne 201 vers le frontend
                console.log('Adresse email modifier avec succes')
                return res.status(201).json({ message: 'Adresse email modifié avec succes' })  
            }
        })
    })
}

// ---------- UPDATE DESCRIPTION PROFILE ----------

exports.updateUserDescription = (req, res, next) => {

    // Récupère l'userid et la nouvelle description de la requete
    let newDescription
    if (req.body.newDescription === '') {
        newDescription = '';
    }else{
        newDescription = req.body.newDescription;
    }

    const userid = req.body.userId;
    


    // Recherche dans la BDD selon userid
    db.query(`SELECT * FROM users WHERE id=${userid}`, (err, result, rows) => {

        // Mise à jour dans la BDD 
        db.query(`UPDATE users SET description='${newDescription}' WHERE id=${userid}`, (err, results, rows)  => {
                        
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
                console.log('Description modifié avec succes')
                return res.status(201).json({ message: 'Description modifié avec succes' })
            }
        })
    })
}

// ---------- GET PROFILE ONE USER ----------

exports.getOneUser = (req, res, next) => {

    // Récupère l'userid
    const userid = req.params.userid;

    // Recherche dans la BDD selon userid
    db.query(`SELECT * FROM users WHERE id=${userid}`, (err, results, rows) => {
                        
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

// ---------- GET USERID ----------

exports.getUserId = (req, res, next) => {

    // Récupère le password crypté
    const userPassCrypted = req.body.userPassCrypted;

    // Recherche dans la BDD selon userid
    db.query(`SELECT * FROM users WHERE password="${userPassCrypted}"`, (err, results, rows) => {
                        
        // Si erreur retourne 400
        if (err) {
            console.log(err)
            return res.status(400).json(err)
        } else {

            // Envoi vers le frontend
            return res.status(200).json(results[0])
        }
    })
}

// ---------- GET LEVEL USER ----------

exports.getLevelUser = (req, res, next) => {

    // Récupère l'userid
    const userid = req.body.userId;

    // Recherche dans la BDD selon userid
    db.query(`SELECT accesslevel FROM users WHERE id=${userid}`, (err, results, rows) => {
                        
        // Si erreur retourne 400
        if (err) {
            console.log(err)
            return res.status(400).json(err)
        } else {

            // Envoi vers le frontend
            return res.status(200).json(results[0].accesslevel)
        }
    })
}

// ---------- GET LAST USER ----------

exports.getLastUser= (req, res, next) => {
    db.query('SELECT * FROM users ORDER BY id DESC LIMIT 1', (error, result, field) => {
      if (error) {
        return res.status(400).json({ error })
      }
        res.status(200).json(result)
    })
  }