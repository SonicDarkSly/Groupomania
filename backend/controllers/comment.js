// Import

// Appel de dbConfig pour les info de la BDD
const db = require("../middleware/dbConfig");

 // ---------- ADD COMMENT ----------

exports.addComment = (req, res, next) => {

  const userId = req.body.userId;
  const postId = req.body.postId;
  const userName = req.body.userName;
  const dateComment = req.body.dateComment;
  const contentComment = req.body.contentComment;

    // Ajout à la BDD
    db.query(`INSERT INTO comments VALUES (NULL, '${postId}', '${userId}', '${userName}', '${dateComment}', "${contentComment.replace(/\"/g, "\"\"")}")`, (err, results, fields) => {

        // Si erreur, retourne 400
        if (err) {
            console.log(err);
            return res.status(400).json("erreur");
        }else{

          // Comptage nombre commentaires 
          db.query(`SELECT COUNT (*) AS countComments FROM comments WHERE postid='${postId}'`, (err, result, rows) => {

            // Mise à jour de la table posts avec le nombre de commentaires pour le post
            db.query(`UPDATE posts SET countcomment='${result[0].countComments}' WHERE id='${postId}'`, (errcount, resultscount, rowscount)  => {
              if (errcount) {
                console.log(errcount);
                return res.status(400).json(errcount);
              }else{
                return res.status(201);
              }
            })
          })

          // Si valide, retourne 201
          console.log('Commentaire envoyé avec succes');
          return res.status(201).json({
            message: 'Commentaire envoyé avec succes'
          });
        }
    });
}

 // ---------- READ COMMENTS ----------

//Affichage des derniers messages postés
exports.getComments = (req, res, next) => {
  db.query('SELECT * FROM comments ORDER BY date DESC', (error, result, field) => {
    if (error) {
      return res.status(400).json({ error })
    }
      res.status(200).json(result)
  })
}

// ---------- UPDATE COMMENTS ----------

exports.updateComment = (req, res, next) => {

  // Récupération des données de la requete
  const commentId = req.body.commentId;
  const commentContent = req.body.commentContent;

            // Mise à jour du nouveau nombre de commentaires
            db.query(`UPDATE comments SET content="${commentContent.replace(/\"/g, "\"\"")}" WHERE id='${commentId}'`, (err, result, rows)  => {
  
              // Si erreur retourne 400
              if (err) {
                console.log(err)
                return res.status(400).json(err)
              } else {
  
                // Si valide, retourne 201
                console.log('Commentaire modifier avec succes');
                res.status(201).json({
                  message: 'Commentaire modifier avec succes'
                });
              }
            })
}

// ---------- DELETE COMMENTS ----------

exports.deleteComment = (req, res, next) => {

  // Récupération des données de la requete
  const commentId = req.body.commentId;
  const postId = req.body.postId;

    // Suppression du commentaire selectionné
    db.query(`DELETE FROM comments WHERE id='${commentId}' AND postid='${postId}'`, (err)  => {

      // Si erreur retourne 400
      if (err) {
        console.log(err)
        return res.status(400).json(err)
      } else {
        
        // Recherche l'ancien nombre de commentaires pour le post
        db.query(`SELECT countcomment FROM posts WHERE id='${postId}'`, (errOld, resultOld, rowsOld) => {

          if (errOld) {
            console.log(errOld)
            return res.status(400).json(errOld)
          } else {

            // Déduction de 1 car suppression de 1 commentaire
            let oldCountComments = resultOld[0].countcomment;
            let newCountComments = oldCountComments -1;
  
            // Mise à jour du nouveau nombre de commentaires
            db.query(`UPDATE posts SET countcomment='${newCountComments}' WHERE id='${postId}'`, (errcount, resultscount, rowscount)  => {
  
              // Si erreur retourne 400
              if (errcount) {
                console.log(errcount)
                return res.status(400).json(errcount)
              } else {
  
                // Si valide, retourne 201
                console.log('Commentaire supprimé avec succes');
                res.status(201).json({
                  message: 'Commentaire supprimé avec succes'
                });
              }
            })
          }
        })
      }
    })
}