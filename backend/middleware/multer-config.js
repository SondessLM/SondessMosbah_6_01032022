//importer package multer pour gérer les images
const multer = require('multer');

// accepter la listes des formats d'images
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// enregistrer les images téléchargées
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // envoyer le nom et la destination 
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

//exporter mutler (fichier image) en appelant le module storage
module.exports = multer({storage: storage}).single('image');