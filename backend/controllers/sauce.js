const sauce= require('../models/sauce');

// Injecter le module FyleSystem qui permet de modifier, ajouter, suprimer des fichiers
const fs = require('fs');


const Sauce = require('../models/sauce');

// Creer une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'la sauce est enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

/// Retrouver une sauce par son id et l'affichée
exports.getOneSauce = (req, res, next) => {
  sauce.findOne({
    _id: req.params.id
  })  
    .then(sauce => res.status(200).json(sauce))     
    .catch(error => res.status(404).json({
      error: error,
    }));
};

//Modifier une sauce
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      const oldUrl = sauce.imageUrl;
      if (!sauce) {
        return res.status(404).json({
          error: new Error('Pas de sauces!')
        });
      }
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({
          error: new Error('Réquete non authorisée!')
        });
      }
      if (req.file) {
        fs.unlink(`images/${filename}`, () => {
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
              }`,
          }
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({
              message: 'Sauce est mis à jour!'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        })
      } else {
        const newSauce = req.body;
        newSauce.imageUrl = oldUrl;
        Sauce.updateOne({ _id: req.params.id }, { ...newSauce, _id: req.params.id })
          .then(() => res.status(200).json({
            message: 'Sauce est mis à jour! !'
          }))
          .catch((error) => res.status(400).json({
            error
          }))
      }
    })
    .catch((error) => res.status(500).json({
      error
    }))
}


// Supprimer Une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({
          error: new Error('Pas de sauces!')
        });
      }
      if (sauce.userId !== req.auth.userId) {
        console.log(sauce.userId);
        console.log(req.auth.userId);
        return res.status(403).json({
          error: new Error('Requete non authorisée!')
        });
      }
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch(error => res.status(400).json({ error }));
      })
    }).catch(error => res.status(500).json({ error }));
};


//Affichage de toutes les sauces

exports.getAllSauces = (req, res, next) => {
  sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// like et dislike des sauces
exports.likeSauce = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;


  if (like == 1) {
     Sauce.findOne({ _id: req.params.id })
      .then((sauce) => { 
        // Liké la sauce si l'utilisateur n'est pas enregistré dans les Likes
        if (sauce.usersLiked.indexOf(userId) == -1 && sauce.usersDisliked.indexOf(userId) == -1) {
            Sauce.updateOne({ _id: sauceId }, {
            $push: { usersLiked: userId }, $inc: { likes: +1 },
          })
            .then(() => res.status(200).json({ 
              message: 'Like ajouté !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        } else {
          //Ajouter un message si l'utilisateur a déjà liké
         return res.status(403).json({ message: 'Vous avez déjà liké ou disliké la sauce !' })
        }
      }).catch((error) => res.status(400).json({
        error
      }))
  } 

  if (like == 0) {
  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      // Liké la sauce si l'utilisateur n'est pas enregistré dans les Likes
      if (sauce.usersDisliked.indexOf(req.body.userId) != -1) {
        Sauce.updateOne(
          { _id: req.params.id },
          // retrait de l'utilisateur du tableau usersDisliked + décrémentation du dislike
          {
            $pull: { usersDisliked: req.body.userId },
            $inc: { dislikes: -1 },
          }
        )
          .then(() => res.status(200).json({ message: "aucun avis" }))
          .catch((error) => res.status(400).json({ error }));
      }
      // si l'utilisateur est présent dans le tableau des likes
      if (sauce.usersLiked.indexOf(req.body.userId) != -1) {
        Sauce.updateOne(
          { _id: req.params.id },
          // Retirer de l'utilisateur du tableau usersliked et suprrimer le like
          { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
        )
          .then(() => res.status(200).json({ message: "aucun avis" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));}



  if (like === -1) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersDisliked.indexOf(userId) == -1 && sauce.usersLiked.indexOf(userId) == -1) {
          Sauce.updateOne({ _id: sauceId }, {
            $push: { usersDisliked: userId }, $inc: { dislikes: +1 },
          })
            .then(() => res.status(200).json({
              message: 'Dislike ajouté !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        } else {
          return res.status(403).json({ message: 'Vous avez déjà liké ou disliké la sauce !' })
        }
      }).catch((error) => res.status(400).json({
        error
      }))
  }

} 
