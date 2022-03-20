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

const  mongoSanitize  =  require ( 'express-mongo-sanitize' ) ;


//importer les routes sauce et utilisateur
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

//const cors = require('cors');                    // import cors: manage cross-origin resource sharing

//configurer express rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limiter a 100 les requetes de chaque IP pendant 15 minutes
  standardHeaders: true, // Retourner rate limit info à `RateLimit-*` headers
  legacyHeaders: false, 
});

// conneter à la base de données (BDD)
mongoose.connect('mongodb+srv://Sondess:Cluster2022@cluster0.7ocvn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser:true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//Analyser le corps de requtes avec la fonction express
const app = express();
//app.use(express);



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

app.use(mongoSanitize());

// secure HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
// Envoyer toutes les demandes entrantes sous forme de Json
app.use(bodyParser.json());

//renvoyer le corps de la requette sous forme de Json
app.use(express.urlencoded({ extended: false }));

//Gerer les images 
app.use('/images', express.static(path.join(__dirname, 'images')));

// Configurer le routes API
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

// exporter le module
module.exports = app;



// exports = function(changeEvent) {
 

//    // Access the _id of the changed document:
//     const docId = changeEvent.documentKey._id;

//    // Access the latest version of the changed document
//    // (with Full Document enabled for Insert, Update, and Replace operations):
//     const fullDocument = changeEvent.fullDocument;

//     const updateDescription = changeEvent.updateDescription;

//     //See which fields were changed (if any):
//     if (updateDescription) {
//       const updatedFields = updateDescription.updatedFields; // A document containing updated fields
//     }

//    // See which fields were removed (if any):
//     if (updateDescription) {
//       const removedFields = updateDescription.removedFields; // An array of removed fields
//     }

//     //Functions run by Triggers are run as System users and have full access to Services, Functions, and MongoDB Data.

//     //Access a mongodb service:
//     const collection = context.services.get(<SERVICE_NAME>).db("db_name").collection("coll_name");
   
//     //SERVICE_NAMEAccess the default http client and execute a GET request:
//     const response = context.http.get({ url: <URL> })

//     }