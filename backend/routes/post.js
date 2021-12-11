// Import
// Appel de Express
const express = require('express');
const auth = require('../middleware/auth');

// Création d'un ROUTER via EXPRESS
const router = express.Router();

// Appel du CONTROLLER "user"
const controller = require('../controllers/post');

// Appel de MULTER pour la gestion de l'upload du fichier image du post initial
const multer = require('../middleware/multer-posts');

// Appel de MULTER pour la gestion de l'upload du fichier image du post update
const updatemulter = require('../middleware/multer-updateposts');

// Appel aux fonctions du CONTROLLER selon route
router.post('/addpost', auth, multer, controller.creatPost);
router.get('/viewallpost', auth, controller.getMessages);
router.get('/viewlastpost', controller.getLastPosts);
router.post('/deleteonepost', auth, controller.deleteonePost);
router.post('/updatepost', auth, updatemulter, controller.updatePost);

// Exportation du ROUTER
module.exports = router;