//
const jwt = require('jsonwebtoken');

require("dotenv").config();

//exporter le lodule token
module.exports = (req, res, next) => {
  try {
    // récuperer le token, le split ensuite le tableau renvoyé
    const token = req.headers.authorization.split(' ')[1];
    //vérifier que le token, correspeond au secret (token) 
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    // récuperer un userId
    const userId = decodedToken.userId;
    req.auth = { userId };  
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    //envoyer erreur d'authentification
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};