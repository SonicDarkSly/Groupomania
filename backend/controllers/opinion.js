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
    const sqlControle = `SELECT COUNT (*) AS opnCount FROM opinions WHERE postid=${postId} AND userid=${userId}`;
    db.query(sqlControle, (err, result) => {

      // Si existe pas
      if (result[0].opnCount === 0) {

        // ajout à la BDD
        const sqlAdd = `INSERT INTO opinions VALUES (NULL, '${postId}', "${userId}", '${like}', '${dislike}')`;
        db.query(sqlAdd, (err) => {
          
          // Si erreur, retourne 400
          if (err) {
            console.log(err);
            return res.status(400).json("erreur");
          }else{

            // Comptage nombre likes 
            const sqlCount = `SELECT COUNT (likes) AS countLikes FROM opinions WHERE postid=${postId} AND likes='1' AND dislikes='0'`;
            db.query(sqlCount, (err, result) => {

              // Mise à jour de la table posts avec le nombre de likes pour le post
              const sqlUpdate = `UPDATE posts SET countlike=${result[0].countLikes} WHERE id=${postId}`;
              db.query(sqlUpdate, (errcount)  => {
                if (errcount) {
                  console.log(errcount);
                  return res.status(400).json(errcount);
                }else{
                  return res.status(201);
                }
              })
            })

            // Comptage nombre dislikes 
            const sqlCountDislike = `SELECT COUNT (dislikes) AS countDislikes FROM opinions WHERE postid=${postId} AND likes='0' AND dislikes='1'`;
            db.query(sqlCountDislike, (err, result) => {

              // Mise à jour de la table posts avec le nombre de dislikes pour le post
              const sqlUpdateCountPost = `UPDATE posts SET countdislike=${result[0].countDislikes} WHERE id=${postId}`;
              db.query(sqlUpdateCountPost, (errcount)  => {
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

        const sqlOpinions = `SELECT * FROM opinions WHERE postid=${postId} AND userid=${userId}`;
        db.query(sqlOpinions, (errslct, resultslct) => {

          // Si l'opinion est identique à celui deja enregistré, annule et remet à zero
          if ((resultslct[0].likes === 1) && (like === 1)) {
            like = 0
          }
          if ((resultslct[0].dislikes === 1) && (dislike === 1)) {
            dislike = 0
          }

          // Mise à jour
          const sqlUpdateOpinion = `UPDATE opinions SET likes="${like}", dislikes='${dislike}' WHERE postid=${postId} AND userid=${userId}`;
          db.query(sqlUpdateOpinion, (err)  => {
            
            // Si erreur, retourne 400
            if (err) {
              console.log(err);
              return res.status(400).json("erreur");
            }else{

              // Comptage nombre likes 
              const sqlCountLike = `SELECT COUNT (likes) AS countLikes FROM opinions WHERE postid=${postId} AND likes='1' AND dislikes='0'`;
              db.query(sqlCountLike, (err, result) => {

                // Mise à jour de la table posts avec le nombre de likes pour le post
                const sqlUpdatePost = `UPDATE posts SET countlike=${result[0].countLikes} WHERE id=${postId}`;
                db.query(sqlUpdatePost, (errcount)  => {
                  if (errcount) {
                    console.log(errcount);
                    return res.status(400).json(errcount);
                  }else{
                    return res.status(201);
                  }
                })
              })

              // Comptage nombre dislikes 
              const sqlCountDislike = `SELECT COUNT (dislikes) AS countDislikes FROM opinions WHERE postid=${postId} AND likes='0' AND dislikes='1'`;
              db.query(sqlCountDislike, (err, result) => {

                // Mise à jour de la table posts avec le nombre de dislikes pour le post
                const sqlUpdateCount = `UPDATE posts SET countdislike=${result[0].countDislikes} WHERE id=${postId}`;
                db.query(sqlUpdateCount, (errcount)  => {
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