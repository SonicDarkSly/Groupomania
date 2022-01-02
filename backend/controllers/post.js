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
    const sql = `INSERT INTO posts VALUES (NULL, '${newPost.userId}', "${newPost.contentPost.replace(/\"/g, "\"\"")}", '${newPost.imgPost}', '${newPost.date}', '0', '0', '${newPost.userName}', '${newPost.userAvatar}','0', NOW())`;
    db.query(sql, (err) => {

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
  const sqlDeleteImage = `SELECT * FROM posts WHERE id='${req.body.postId}'`;
  db.query(sqlDeleteImage, (err, result) => {

    // Si une image existe, on la supprime du dossier
    if (result[0].imageurl != '') {
      const imagePost = result[0].imageurl
      const imagePostFilename = imagePost.split(`/${req.body.postUserId}/`)[1];

      fs.unlink(`images/posts/${req.body.postUserId}/${imagePostFilename}`, (err => {
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
    const sqlDeletePost = `DELETE FROM posts WHERE id='${req.body.postId}' AND userid='${req.body.postUserId}'`;
    db.query(sqlDeletePost, (errPost)  => {

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

    // Suppression des likes / dislikes dans la table opinions
    const sqlDeleteOpinion = `DELETE FROM opinions WHERE postid='${req.body.postId}'`;
    db.query(sqlDeleteOpinion, (errPost)  => {

      // Si erreur retourne 400
      if (errPost) {
        console.log(errPost)
        return res.status(400).json(errPost)
      } else {
    
        // Si valide, retourne 201
        console.log('Likes/Dislikes supprimés avec succes');
        return res.status(201);
      }
    })

    // Suppression des commentaires dans la table comments
    const sqlDeleteComment = `DELETE FROM comments WHERE postid='${req.body.postId}'`;
    db.query(sqlDeleteComment, (errPost)  => {

      // Si erreur retourne 400
      if (errPost) {
        console.log(errPost)
        return res.status(400).json(errPost)
      } else {
        
        // Si valide, retourne 201
        console.log('Commentaires supprimés avec succes');
        return res.status(201);
      }
    })
  })
}


// ---------- READ POST ----------


//Affichage des messages postés 
exports.getMessages = (req, res, next) => {
  const sql = 'SELECT * FROM posts ORDER BY createdate DESC';
  db.query(sql, (error, result) => {
    if (error) {
      return res.status(400).json({ error })
    }
    res.status(200).json(result)
  })
}

//Affichage des derniers messages postés
exports.getLastPosts= (req, res, next) => {
  const sql = 'SELECT * FROM posts ORDER BY createdate DESC LIMIT 1';
  db.query(sql, (error, result) => {
    if (error) {
      return res.status(400).json({ error })
    }
      res.status(200).json(result)
  })
}

 // ---------- UPDATE POST ----------


 exports.updatePost = (req, res, next) => {

  // Recherche dans la BDD selon postId
  const sqlPost = `SELECT * FROM posts WHERE id=${req.body.postId}`;
  db.query(sqlPost, (err, result) => {

      // Ancien fichier image du post
      const oldimg = result[0].imageurl
      const oldfilename = oldimg.split(`/${req.body.postUserId}/`)[1];

      // Controle si un fichier un present dans la requete
      const updatePost = req.file
      ? {
        ...req.body,
        imgPost: `${req.protocol}://${req.get('host')}/images/posts/${req.body.postUserId}/${req.file.filename}`
      }
      : {
        ...req.body,
        imgPost: `${oldimg}`
      };

      // suppression de l'ancien fichier image
      if (req.file) {
        if (req.file.filename !== oldfilename) {
          fs.unlink(`images/posts/${req.body.postUserId}/${oldfilename}`, (err => {
            if (err) {
              console.log(err);
              return false
            } else {
              console.log("Ancienne image supprimer avec succes");
              return true
            }
          }));
        }
      }

      // Mise à jour dans la BDD 
      const sqlUpdate = `UPDATE posts SET content="${updatePost.contentPost.replace(/\"/g, "\"\"")}", imageurl='${updatePost.imgPost}' WHERE id=${updatePost.postId}`;
      db.query(sqlUpdate, (err)  => {

          // Si erreur retourne 400
          if (err) {
              console.log(err)
              return res.status(400).json(err)
          }else{
            return res.status(200).json(result)
          }
      })

      console.log('Post #'+updatePost.postId+' modifier avec succes')
  })
}
