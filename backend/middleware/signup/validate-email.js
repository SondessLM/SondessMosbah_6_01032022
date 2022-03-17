const emailValidator = require("email-validator");

module.exports = (req, res, next) => {
    try {
        const emailValidate = (email) => {
            if (!emailValidator.validate(email)) {
                throw "Email invalide";
            }else {
                next();
            }
        }
        emailValidate(req.body.email)
    } catch {
        res.status(401).json({
            message: "Votre mail n'est pas valide !"
        });
    }
};
