// Import
// Appel de Express
const express = require('express');
const auth = require('../middleware/auth');

// Création d'un ROUTER via EXPRESS
const router = express.Router();

// Appel du CONTROLLER "user"
const controller = require('../controllers/opinion');

// Appel aux fonctions du CONTROLLER selon route
router.post('/opinionpost',auth, controller.opinionPost);

// Exportation du ROUTER
module.exports = router;