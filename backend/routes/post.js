// Import
// Appel de Express
const express = require('express');
const auth = require('../middleware/auth');

// Création d'un ROUTER via EXPRESS
const router = express.Router();

// Appel du CONTROLLER "user"
const controller = require('../controllers/post');

// Appel de MULTER pour la gestion de l'upload du fichier image de la sauce (nom, extention)
const multer = require('../middleware/multer-config');

// Appel aux fonctions du CONTROLLER selon route
router.post('/addpost',auth, multer, controller.creatPost);

// Exportation du ROUTER
module.exports = router;