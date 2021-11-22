// Import du package jsonwebtoken pour la gestion du Token
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const TOKEN = process.env.RND_TOKEN;

module.exports = (req, res, next) => {
    try {
        // Récupérer le token de l'entête Authorization
        const token = req.headers.authorization.split(' ')[1];

        // Vérifier et décoder le token stocker dans le fichier .env
        const decodedToken = jwt.verify(token, TOKEN); 

        // Récupérer l'ID de l'utilisateur dans le token
        const userId = decodedToken.userId; 
        
        // Si l'ID de l'utilisateur qui effectue la requête ne correspond pas à l'ID utilisateur du token
        
        if (req.body.userId && req.body.userId !== userId) {

            // Générer une erreur
            throw 'Invalid user ID'; 
        } else {

            // sinon next()
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!'),
            message: 'Invalid request!'
        });
    }
};