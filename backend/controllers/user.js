// npm: Crypter les informations (hasher mot de pass)
const bcrypt = require('bcrypt');

//Importer shema model user.
const User = require('../models/user');

//Sécuriser la connexion au compte: token user.
const jwt = require('jsonwebtoken');

//Importer variable d'environnement.
require('dotenv').config();

/**
 * Inscription d'un utilisateur.
 * 
 * @param {*} req
 * @param {*} res 
 * @param {*} next 
 */
exports.signup = (req, res, next) => {
  //Hasher 10 fois le mot de passe.
  bcrypt.hash(req.body.password, 10)
    .then(hash => {

      //Créer un nouvel utilisateur.
      const user = new User({
        //Récuperer le corps de la requete.
        email: req.body.email,
        //Hasher le mot de passe lors de sa création.
        password: hash
      });

      //Enregistrement du nouvel utilisateur dans la BDD.
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};



// login pour utilisateur déja enregistré.

exports.login = (req, res, next) => {
  //chercher l'utilisateur dans BDD
  User.findOne({ email: req.body.email })
    .then((user) => {
      console.log("user", user);
      //Utilisateur non trouvé
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      //Comparer les mot de passes
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          console.log("validation", valid);
          //mot de passe non valable 
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          //Envoie un objet json avec le userId et token
          res.status(200).json({
              userId: user._id,
              // encoder un nouveau token la fonction sign de jwt 
              token: jwt.sign(
                //ajoute user id 
                { userId: user._id },
                //Ajouter une chaine secrète de développement temporaire
                'RANDOM_TOKEN_SECRET',
                //Fin de validité du token à 24H
                { expiresIn: '24h' }
              )
            });
        })
        .catch(error => res.status(500).json({error }));
    })
    .catch(error => res.status(500).json({ error }));
};

