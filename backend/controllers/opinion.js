// Import

// Appel de dbConfig pour les info de la BDD
const db = require("../middleware/dbConfig");

 // ---------- LIKE, DISLIKE OU PAS D'OPINION D'UN POST ----------

exports.opinionPost = (req, res, next) => {

  const userId = req.body.userId;
  const postId = req.body.postId;

  let like
  let dislike
  if (req.body.opinion === 'like') {
    like = 1
  }else{
    like = 0
  }
  if (req.body.opinion === 'dislike') {
    dislike = 1
  }else{
    dislike = 0
  }

    // Controle si une opinion pour un post de la part d'un user existe dans la BDD
    db.query(`SELECT COUNT (*) AS opnCount FROM opinions WHERE postid=${postId} AND userid=${userId}`, (err, result, rows) => {

      // Si existe pas
      if (result[0].opnCount === 0) {

        // ajout à la BDD
        db.query(`INSERT INTO opinions VALUES (NULL, '${postId}', "${userId}", '${like}', '${dislike}')`, (err, results, fields) => {
          
          // Si erreur, retourne 400
          if (err) {
            console.log(err);
            return res.status(400).json("erreur");
          }else{

            // Comptage nombre likes 
            db.query(`SELECT COUNT (likes) AS countLikes FROM opinions WHERE postid=${postId} AND likes='1' AND dislikes='0'`, (err, result, rows) => {

              // Mise à jour de la table posts avec le nombre de likes pour le post
              db.query(`UPDATE posts SET countlike=${result[0].countLikes} WHERE id=${postId}`, (errcount, resultscount, rowscount)  => {
                if (errcount) {
                  console.log(errcount);
                  return res.status(400).json(errcount);
                }else{
                  return res.status(201);
                }
              })
            })

            // Comptage nombre dislikes 
            db.query(`SELECT COUNT (dislikes) AS countDislikes FROM opinions WHERE postid=${postId} AND likes='0' AND dislikes='1'`, (err, result, rows) => {

              // Mise à jour de la table posts avec le nombre de dislikes pour le post
              db.query(`UPDATE posts SET countdislike=${result[0].countDislikes} WHERE id=${postId}`, (errcount, resultscount, rowscount)  => {
                if (errcount) {
                  console.log(errcount);
                  return res.status(400).json(errcount);
                }else{
                  return res.status(201);
                }
              })
            })

            // Si valide, retourne 201
            console.log('Opinion envoyé avec succes');
            return res.status(201).json({
              message: 'Opinion envoyé avec succes'
            });
          }
        })

      // Si existe
      } else {

        db.query(`SELECT * FROM opinions WHERE postid=${postId} AND userid=${userId}`, (errslct, resultslct, rowsslct) => {

          // Si l'opinion est identique à celui deja enregistré, annule et remet à zero
          if ((resultslct[0].likes === 1) && (like === 1)) {
            like = 0
          }
          if ((resultslct[0].dislikes === 1) && (dislike === 1)) {
            dislike = 0
          }

          // Mise à jour
          db.query(`UPDATE opinions SET likes="${like}", dislikes='${dislike}' WHERE postid=${postId} AND userid=${userId}`, (err, results, rows)  => {
            
            // Si erreur, retourne 400
            if (err) {
              console.log(err);
              return res.status(400).json("erreur");
            }else{

              // Comptage nombre likes 
              db.query(`SELECT COUNT (likes) AS countLikes FROM opinions WHERE postid=${postId} AND likes='1' AND dislikes='0'`, (err, result, rows) => {

                // Mise à jour de la table posts avec le nombre de likes pour le post
                db.query(`UPDATE posts SET countlike=${result[0].countLikes} WHERE id=${postId}`, (errcount, resultscount, rowscount)  => {
                  if (errcount) {
                    console.log(errcount);
                    return res.status(400).json(errcount);
                  }else{
                    return res.status(201);
                  }
                })
              })

              // Comptage nombre dislikes 
              db.query(`SELECT COUNT (dislikes) AS countDislikes FROM opinions WHERE postid=${postId} AND likes='0' AND dislikes='1'`, (err, result, rows) => {

                // Mise à jour de la table posts avec le nombre de dislikes pour le post
                db.query(`UPDATE posts SET countdislike=${result[0].countDislikes} WHERE id=${postId}`, (errcount, resultscount, rowscount)  => {
                  if (errcount) {
                    console.log(errcount);
                    return res.status(400).json(errcount);
                  }else{
                    return res.status(201);
                  }
                })
              })

              // Si valide, retourne 201
              console.log('Opinion modifié avec succes');
              return res.status(201).json({
                message: 'Opinion modifié avec succes'
              });
            }
          })
        })
      }
    })
}