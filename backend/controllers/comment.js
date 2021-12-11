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