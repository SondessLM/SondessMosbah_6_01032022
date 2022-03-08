//importer le framework express de node.js (creer des appli web avec node)
const express = require('express');

// analyser les corps de requête entrants dans un middleware ,disponible sous la propriété req.body.
const bodyParser =  require('body-parser');

//Faire appel à la base de donneés (BDD) via mongoose
const mongoose = require('mongoose');

const sauce = require('./models/sauce');
//donner un moyen d’utiliser des répertoires et des chemins d’accès aux fichiers
const path = require('path');

//importer les routes sauce et utilisateur
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// conneter à la base de données (BDD)
mongoose.connect('mongodb+srv://Sondess:<>@cluster0.7ocvn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser:true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//Analyser le corps de requtes avec la fonction express
const app = express();



// Gerer CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Envoyer toutes les demandes entrantes sous forme de Json
app.use(bodyParser.json());

//renvoyer le corps de la requette sous forme de Json
app.use(express.json());

//Gerer les images 
app.use('/images', express.static(path.join(__dirname, 'images')));

// Configurer le routes API
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// exporter le module
module.exports = app;