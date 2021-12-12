// Import
// Appel de Express
const express = require('express');
const auth = require('../middleware/auth');

// Création d'un ROUTER via EXPRESS
const router = express.Router();

// Appel du CONTROLLER "user"
const controller = require('../controllers/comment');

// Appel aux fonctions du CONTROLLER selon route
router.post('/addcomment',auth, controller.addComment);
router.get('/viewcomment',auth, controller.getComments);
router.post('/updatecomment',auth, controller.updateComment);
router.post('/deletecomment',auth, controller.deleteComment);

// Exportation du ROUTER
module.exports = router;