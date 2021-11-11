// Import
// Appel de bcrypt pour le hashage du mot de passe
const bcrypt = require('bcrypt')

// Appel de jsonwebtoken pour la gestion du TOKEN (creation)
const jwt = require('jsonwebtoken')

const db = require("../middleware/dbConfig");


// ---------- SIGN UP ----------

// POUR APPEL DU FRONTEND : 
    // URL : /api/auth/signup 
    // METHODE : post

// Pour l'enregistrement d'un nouvel utilisateur
exports.signup = (req, res, next) => {

    // Verification email existante
    db.query(`SELECT * FROM users WHERE email='${req.body.email}'`,
    (err, results, rows) => {
        //Si email deja utilisé
        if (results.length > 0) {
            res.status(401).json({
                message: 'Email déjà existante'
            });

        // Si email non existante
        } else {

            // hashage du mdp
            bcrypt.hash(req.body.password, 10)
            .then(cryptedPassword => {

                //Ajout à la BDD - id, lastname, firstname, password, email, accesslevel
                db.query(`INSERT INTO users VALUES (NULL, '${req.body.lastname}', '${req.body.firstname}', '${cryptedPassword}', '${req.body.email}', 0)`,

                // fonction de mysql : erreur, resulat, retourne objet
                    (err, results, fields) => {
                        if (err) {
                            console.log(err);
                            return res.status(400).json("erreur");
                        }else{
                            return res.status(201).json({
                                message: 'Votre compte a bien été crée !'
                            });
                        }
                    }
                );
            })
            .catch(error => res.status(500).json({ error }))
        }
    });
};



// ---------- LOGIN ----------

exports.login = (req, res, next) => {

    //Recherche de l'utilisateur dans la BDD
    db.query(`SELECT * FROM users WHERE email='${req.body.email}'`,
        (err, results, rows) => {

            //Si utilisateur trouvé : 
            if (results.length > 0) {

                //Verification du MDP
                bcrypt.compare(req.body.password, results[0].password)
                    .then(valid => {

                        //Si MDP invalide erreur
                        if (!valid) {
                            res.status(401).json({
                                message: 'Mot de passe incorrect.'
                            });
                            
                            //Si MDP valide création d'un token
                        } else {
                            res.status(201).json({
                                userId: results[0].id,
                                email: results[0].email,
                                lastname: results[0].lastname,
                                firstname: results[0].firstname,
                                accesslevel: results[0].accesslevel,
                                token: jwt.sign({
                                    userId: results[0].id
                                }, process.env.RND_TOKEN, {
                                   expiresIn: '24h'
                                })
                            });
                        }
                    });
            } else {
                res.status(404).json({
                    message: 'Utilisateur inconnu.'
                });
            }
        }
    );
};
