// Import
// Appel de Express
const express = require('express');

// Création d'un ROUTER via EXPRESS
const router = express.Router();

// Appel du CONTROLLER "user"
const controller = require('../controllers/user');

// Appel aux fonctions du CONTROLLER selon route
router.post('/signup', controller.signup);
router.post('/login', controller.login);

// Exportation du ROUTER
module.exports = router;