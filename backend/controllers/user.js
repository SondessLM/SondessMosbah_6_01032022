// npm: Crypter les informations (hasher mot de pass)
const bcrypt = require('bcrypt');

//importer shema model user
const User = require ('../models/User');

// securiser la connexion au compte: token user 
const jwt = require('jsonwebtoken');

//importer variable d'environnement
require('dotenv').config();

// fonction d'encodage qui servira à l'email

function masked(sentence) {
  if (typeof sentence === "string") {
    let headMail = sentence.slice(0,1);
    let bodyMail = sentence.slice(1, sentence.length-4);
    let bottomMail = sentence.slice(sentence.length-4, sentence.length);
    let final = [];
    var masked = bodyMail.split('');
    var maskedMail = [];
    for(let i in masked) {
      masked[i] = '*';
      maskedMail += masked[i];  
    }
    final += headMail + maskedMail + bottomMail
    return final;
  }
  console.log(sentence + " is not a mail");
  return false
}



// inscription d'un utilisateur

// inscription nouvel utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };exports.signup = (req, res, next) => {
    //hasher 10 fois le mot de passe
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        //ceer un nouvel utilisateur
        const user = new User({
          // recuperer le corp de la requete 
          email: masked(req.body.email),
          // hasher le mot de passe lors de sacréation
          password: hash
        });
        //enregistrement du nouvel utilisateur dans la BDD
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

// login pour utilisateur déja enregistré
  exports.login = (req, res, next) => {
    // verifier si l'email existe dans la BDD
    User.findOne({ email: masked(req.body.email) })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        // comparer les entrées et les données
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            //entrée != donnée
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              // entrée = donnée
              userId: user._id,
              token: jwt.sign(
                // donneés encodées danc le token
                { userId: user._id },
                // clé secrète valise 24h
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };