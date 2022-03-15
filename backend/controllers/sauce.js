const sauce= require('../models/sauce');

// Injecter le module FyleSystem qui permet de modifier, ajouter, suprimer des fichiers
const fs = require('fs');

// Creer une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
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
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    sauce.updateOne({_id: req.params.id}, sauce).then(
    () => {
      res.status(201).json({
        message: 'Sauce est mis à jour!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    });
  };

// Supprimer Une sauce
  exports.deleteSauce = (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'La sauce a été supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
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