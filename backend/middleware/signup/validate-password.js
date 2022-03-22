const passwordValidator = require('password-validator');

// Creation du schema
const passwordSchema = new passwordValidator();

//Ajout des propriétés
passwordSchema
    .is().min(6)
    .is().max(20)
    .has().uppercase()
    .has().lowercase()
    .has().digits(2)
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123']);

module.exports = (req, res, next) => {
    const pass = req.body.password;

    if(passwordSchema.validate(pass)) {
        next();
    }
    else {
        return res.status(400).json({ message : "Mot de passe trop faible. Veuillez saisir: 1 majuscule, 1 minuscule, 2 chiffres, 6 caractères minimum."});
   // }
        // {res.status(401).json({ message: 'Mot de passe incorrect !' });

    }
}