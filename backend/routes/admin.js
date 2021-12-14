// Import
// Appel de Express
const express = require('express');
const auth = require('../middleware/auth');

// Création d'un ROUTER via EXPRESS
const router = express.Router();

// Appel du CONTROLLER "user"
const controller = require('../controllers/admin');

// Appel de MULTER pour la gestion de l'upload du fichier image de la sauce (nom, extention)
const multer = require('../middleware/multer-user');

// Appel aux fonctions du CONTROLLER selon route
router.post('/access', auth, controller.getAccessAdmin);
router.get('/get/allusers', auth, controller.getUserAdmin);
router.get('/get/:userid', auth, controller.getUserIdAdmin);
router.post('/update/level', auth, controller.adminUpdateUserLevel);
router.post('/update/password', auth, controller.adminUpdateUserPassword);
router.post('/update/email', auth, controller.adminUpdateUserEmail);
router.post('/update/lastname', auth, controller.adminUpdateUserLastName);
router.post('/update/firstname', auth, controller.adminUpdateUserFirstName);
router.post('/update/delete', auth, controller.adminDeleteUser);

// Exportation du ROUTER
module.exports = router;