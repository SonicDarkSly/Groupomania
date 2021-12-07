// Import
// Appel de Express
const express = require('express');
const auth = require('../middleware/auth');


// Création d'un ROUTER via EXPRESS
const router = express.Router();

// Appel du CONTROLLER "user"
const controller = require('../controllers/user');

// Appel de MULTER pour la gestion de l'upload du fichier image de la sauce (nom, extention)
const multer = require('../middleware/multer-user');

// Appel aux fonctions du CONTROLLER selon route
router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/update/profile-picture', auth, multer, controller.updateUserAvatar);
router.post('/update/password', auth, controller.updateUserPassword);
router.post('/update/email', auth, controller.updateUserEmail);
router.post('/update/description', auth, controller.updateUserDescription);
router.post('/delete', auth, controller.deleteUser);
router.post('/getlevel', auth, controller.getLevelUser);
router.get('/profile/:userid', auth, controller.getOneUser);

// Exportation du ROUTER
module.exports = router;