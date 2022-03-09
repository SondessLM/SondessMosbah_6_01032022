// importer le package express
const express = require('express');

// analyser les corps de requête entrants dans un middleware ,disponible sous la propriété req.body.
const bodyParser =  require('body-parser');

// creer des routes individuelles grace router express
const router = express.Router();

//importer le controller
const userCtrl = require('../controllers/user');

// importer le package express-validator
const {body, validationResult} = require('express-validator');  

// cette fonction servira à express-validator
const sanitize = (req, res, next) => {

    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(400).json({error})  // code 400: bad request
    }
    next();      // si on ne trouve pas d'erreur par rapport à ce qu'on a demandé, on passe à la suite.
};

// routes pour se connecter
router.post('/signup', [
    body('email').isEmail(),                
    body('password').isLength({min: 8})
    ], sanitize,                            
    userCtrl.signup);   

router.post('/login', [
    body('email').isEmail(),
    body('password').isLength({min: 5})
    ], sanitize, 
    userCtrl.login);
    
module.exports = router;