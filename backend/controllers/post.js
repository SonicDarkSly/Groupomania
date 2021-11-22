// Import
// Appel de bcrypt pour le hashage du mot de passe
const bcrypt = require('bcrypt')

// Appel de jsonwebtoken pour la gestion du TOKEN (creation)
const jwt = require('jsonwebtoken')

// Appel de dbConfig pour les info de la BDD
const db = require("../middleware/dbConfig");

// Appel de FS pour la gestion des avatar user
const fs = require('fs');


// ---------- ADD POST ----------


exports.creatPost = (req, res, next) => {

    // Récupère l'userid et le nouveau email de la requete
    const userid = req.body.userId;
    const contentpost = req.body.contentPost;
    const imageurl = `${req.protocol}://${req.get('host')}/images/posts/user_${userid}/${req.file.filename}`;
    const datepost = req.body.datePost;
    const likepost = req.body.likePost;
    const dislikepost = req.body.dislikePost;

                // Ajout à la BDD
                db.query(`INSERT INTO posts VALUES (NULL, '${userid}', '${contentpost}', '${imageurl}', '${datepost}', '${likepost}', '${dislikepost}')`, (err, results, fields) => {

                // Si erreur, retourne 400
                if (err) {
                        console.log(err);
                        return res.status(400).json("erreur");
                    }else{

                        // Si valide, retourne 201
                        return res.status(201).json({
                            message: 'Post envoyé avec succes'
                        });
                    }
                });
}

