const Sauce = require('../models/Sauce');

const fs = require('fs');

// export des sauces 
exports.getAllSauces = (req, res, next) => {
    Sauce.find({})
        // renvoi la liste des sauces au clients
        .then(sauces => res.status(200).json(sauces))
        // sinon renvoi une erreur 
        .catch(error => res.status(500).json({ error }));
};

// récuperation d'une seule sauce 
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// creation de sauces : 
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject.id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce sauvegardée' }) })
        .catch(error => { res.satus(400).json({ error }) })
};

