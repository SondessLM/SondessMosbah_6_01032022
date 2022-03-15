 require('dotenv').config()          // load environment variables from the .env file into process.env

//importer le framework express de node.js (creer des appli web avec node)
const express = require('express');

// analyser les corps de requête entrants dans un middleware ,disponible sous la propriété req.body.
const bodyParser =  require('body-parser');

//Faire appel à la base de donneés (BDD) via mongoose
const mongoose = require('mongoose');

const sauce = require('./models/sauce');

//donner un moyen d’utiliser des répertoires et des chemins d’accès aux fichiers
const path = require('path');

//limiter les demandes répétées aux API par le package express rate limit 
const rateLimit = require('express-rate-limit');

// configurer de manière appropriée des en-têtes HTTP 
const helmet = require('helmet');


//importer les routes sauce et utilisateur
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

const cors = require('cors');                    // import cors: manage cross-origin resource sharing

//configurer express rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite a 100 les requetes de chaque IP pendant 15 minutes
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// conneter à la base de données (BDD)
mongoose.connect('mongodb+srv://Sondess:Cluster2022@cluster0.7ocvn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
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

// protéger l'application contre certaines vulnérabilités
app.use((req, res, next) => {
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// application du package
app.use(limiter);

// secure HTTP headers
app.use(helmet());

// Envoyer toutes les demandes entrantes sous forme de Json
app.use(bodyParser.json());

//renvoyer le corps de la requette sous forme de Json
 app.use(express.json());

//Gerer les images 
app.use('/images', express.static(path.join(__dirname, 'images')));

// Configurer le routes API
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);


// exporter le module
module.exports = app;