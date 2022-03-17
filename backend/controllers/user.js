// npm: Crypter les informations (hasher mot de pass)
const bcrypt = require('bcrypt');

//Importer shema model user.
const User = require('../models/User');

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
        .catch(error => res.status(400).json({ message : error.errors.email.message }));
    })
    .catch(error => res.status(500).json({ error }));
};



/**
 *  login pour utilisateur déja enregistré.
 * 
 * @param {*} req
 * @param {*} res 
 * @param {*} next 
 */
exports.login = (req, res, next) => {
  //on trouve l'utilisateur de la base de donnée
  User.findOne({ email: req.body.email })
    .then(user => {
      //si on ne trouve pas l'utilisateur
      if (!user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé !' });
      }
      //si l'utilisateur a été trouvé on compare les mot de passes
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          //si elle n'est pas valable 
          if (!valid) {
            return res.status(401).json({ message: 'Mot de passe incorrect !' });
          }
          //si elle est valable on envoie un objet json avec le userId et token
          res.status(200).json({
              userId: user._id,
              //on appel la fonction sign de jwt pour encoder un nouveau token
              token: jwt.sign(
                //on y ajoute l'id de l'utilisateur
                { userId: user._id },
                //on ajoute une chaine secrète de développement temporaire
                'RANDOM_TOKEN_SECRET',
                //nous définissons ensuite la fin de validité du token à 24H
                { expiresIn: '24h' }
              )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// // login pour utilisateur déja enregistré
// exports.login = (req, res, next) => {
//   // verifier si l'email existe dans la BDD
//   User.findOne({ email: masked(req.body.email) })
//     .then(user => {
//       if (!user) {
//         return res.status(401).json({ message: 'Utilisateur non trouvé !' });
//       }
//       // comparer les entrées et les données
//       bcrypt.compare(req.body.password, user.password)
//         .then(valid => {
//           //entrée non valable
//           if (!valid) {
//             return res.status(401).json({ message: 'Mot de passe incorrect !' });
//           }
//           // Envoyr un objet Json avec le userId et token si elle est valable
//           res.status(200).json({          
//             userId: user._id,
//             token: jwt.sign(
//               // donneés encodées danc le token
//               { userId: user._id },
//               // clé secrète valise 24h
//               'RANDOM_TOKEN_SECRET',
//               { expiresIn: '24h' }
//             )
//           });
//         })
//         .catch(error => res.status(500).json({ error }));
//     })
//     .catch(error => res.status(500).json({ error }));
// };