
// importer le package express
const express = require('express');

// creer des routes individuelles grace router express
const router = express.Router();

//creer constante pour l'authentification
const auth = require('../middleware/auth');

//creer constante pour gerer les images
const multer = require('../middleware/multer-config');

// creer constante CRUD (create, Read, Update, Delete)
const sauceCtrl = require('../controllers/sauce');

//Route pour recupèrer toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauces);

//Routes pour créer une sauce
router.post('/', auth, multer, sauceCtrl.createSauce);

//Route pour recupèrer une sauce avec son ID
router.get('/:id', auth, sauceCtrl.getOneSauce);

//route pour permettre de modifier une sauce
router.put('/:id', auth, mutler, sauceCtrl.modifySauce);

//route pour permettre de suprrimer une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;