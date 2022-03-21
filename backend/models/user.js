// utiliser mongoose
const mongoose = require('mongoose');

//demander plugin mongoose pour garantir l'unicité de l'adresse
const uniqueValidator = require('mongoose-unique-validator');

// creer un model user 
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: "L'adresse email existe déja." },
  password: { type: String, required: true}
});

//Interdir la creation d'un deuxième user par la meme adresse mail
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);