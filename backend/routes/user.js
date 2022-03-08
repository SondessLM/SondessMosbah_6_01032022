// importer le package express
const express = require('express');
// creer des routes individuelles grace router express
const router = express.Router();


//importer le controller
const userCtrl = require('../controllers/user');

// routes pour se connecter
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;