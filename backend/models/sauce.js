
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
  // nombre like
  likes: { type: Number, required: true },
  // nombre dislike 
  dislikes: { type: Number, required: true },
  // tableau userId qui ont liké la sauce
  usersLiked: { type: [String], required: true },
  // tableau userId qui ont disliké la sauce
  usersDisliked: { type: [String], required: true },
});

//Export du schema 
module.exports = mongoose.model('Sauce', sauceSchema); 

