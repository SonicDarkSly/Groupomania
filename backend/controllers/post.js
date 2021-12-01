// Import

// Appel de dbConfig pour les info de la BDD
const db = require("../middleware/dbConfig");

// Appel de FS pour la gestion des images upload
const fs = require('fs');


// ---------- ADD POST ----------


exports.creatPost = (req, res, next) => {

    // Controle si un fichier un present dans la requete
    const newPost = req.file
    ? {
        ...req.body,
        imgPost: `${req.protocol}://${req.get('host')}/images/posts/${req.body.userId}/${req.file.filename}`
      }
    : {
        ...req.body,
        imgPost: ''
      };

    // Ajout à la BDD
    db.query(`INSERT INTO posts VALUES (NULL, '${newPost.userId}', '${newPost.contentPost}', '${newPost.imgPost}', '${newPost.date}', '0', '0', '${newPost.userName}', '${newPost.userAvatar}')`, (err, results, fields) => {

        // Si erreur, retourne 400
        if (err) {
            console.log(err);
            return res.status(400).json("erreur");
        }else{

            // Si valide, retourne 201
            console.log('Post envoyé avec succes');
            return res.status(201).json({
                message: 'Post envoyé avec succes'
            });
        }
    });
}


// ---------- DELETE POST ----------


exports.deleteonePost = (req, res, next) => {

  // Recherche l'url de l'image du post
  db.query(`SELECT * FROM posts WHERE id='${req.body.postId}'`, (err, result, rows) => {

    // Si une image existe, on la supprimer du dossier
    if (result[0].imageurl != '') {
      const imagePost = result[0].imageurl
      const imagePostFilename = imagePost.split(`/${req.body.userId}/`)[1];

      fs.unlink(`images/posts/${req.body.userId}/${imagePostFilename}`, (err => {
        if (err) {
            console.log(err);
            return false
        } else {
          console.log("Image du post supprimer avec succes");
          return true
        }
      }));
    }

    // Suppression du posts selectionné et correspandant à l'user
    db.query(`DELETE FROM posts WHERE id='${req.body.postId}' AND userid='${req.body.userId}'`, (errPost, resultsPost, rowsPost)  => {

      // Si erreur retourne 400
      if (errPost) {
        console.log(errPost)
        return res.status(400).json(errPost)
      } else {

        // Si valide, retourne 201
        console.log('Post supprimé avec succes');
        return res.status(201).json({
          message: 'Post supprimé avec succes'
        });
      }
    })
  })
}

// ---------- READ POST ----------

//Affichage des messages posté 
exports.getMessages = (req, res, next) => {
    db.query('SELECT * FROM posts  ORDER BY date DESC', (error, result, field) => {
      if (error) {
        return res.status(400).json({ error })
      }
        res.status(200).json(result)
    })
}

//Affichage des messages posté pour un userid
exports.getMessagesByUser = (req, res, next) => {
  db.query(`SELECT * FROM posts  WHERE userid='${req.params.userid}' ORDER BY date DESC`, (error, result, field) => {
    if (error) {
      return res.status(400).json({ error })
    }
      res.status(200).json(result)
  })
}