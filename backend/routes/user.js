//Importer le package express.
const express = require('express');

//Créer des routes individuelles grace router express.
const router = express.Router();

//Importer le controller.
const userCtrl = require('../controllers/user');

//Importer les middleware.
const validateEmail = require("../middleware/signup/validate-email");
const validatePassword = require("../middleware/signup/validate-password");

//Routes pour s'inscrire.
router.post('/signup', validateEmail, validatePassword, userCtrl.signup );

//Routes pour se connecter.
router.post('/login', validateEmail, userCtrl.login );

module.exports = router;