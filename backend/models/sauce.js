
//importer mongo
const mongoose = require('mongoose');

//créer un  schema de donnée liée à la sauce
const sauceSchema = mongoose.Schema({
//identifier MongoDB de l'utilisateur qui a crée la sauce
  userId: { type: String, required: true },
  //donner le nom de la sauce
  name: { type: String, required: true },
  //donner le fabriquant de la sauce
  manufacturer: { type: String, required: true },
  //faie une description à la sauce
  description: { type: String, required: true },
  //pesenter le principal ingrédient de la sauce
  mainPepper: { type: String, required: true },
  //presnter l'URL del'image téléchargée
  imageUrl: { type: String, required: true },
  //mettre un nombre entre 1 et 10 
  heat: { type: Number, required: true },
  // nombre d'utilisateurs qui like la sauce
  likes: { type: Number, required: true },
  // nombre d'utilisateurs qui dislike la
// sauce
  dislikes: { type: Number, required: true },
  // tableau des identifiants des utilisateurs qui ont aimé la sauce
  usersLiked: { type: [String], required: true },
  // tableau des identifiants des utilisateurs qui n'ont pas aimé la sauce
  usersDisliked: { type: [String], required: true },
});

//Exportation du schema sous forme de modèle
module.exports = mongoose.model('Sauce', sauceSchema); 

