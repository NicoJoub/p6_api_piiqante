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


//modification d'une sauce 
exports.modifySauce = (req, res, next) => {
    // Champ file présent ou non 
    const sauceObject = req.file ? {
        // si cest le cas on récupère notre objet  en parsant la chaine de caractère
        ...JSON.parse(req.body.sauce),
        // on recree l'url de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        // si pas d'objet on le récupère directement dans le corps de la requete 
    } : { ...req.body };
    // on va supprimer l'user id de la requete pour eviter de changer le proprio
    delete sauceObject._userId;
    // on va chercher l objet dans la base de donnée pour la recup pour vérifier que la sauce appartient bien a l utilisateur 
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'Non autorisé' });
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                //suppression de l'image de la sauce car elle va être remplacer par la nouvelle image de sauce
                // suppression via la méthode unlike de FS avec le chemin pour trouver le fichier 
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
                        .catch(error => res.status(401).json({ error }));
                })
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// suppression d'une sauce 
exports.deleteSauce = (req, res, next) => {
    //On utilise l'ID que l'on reçoit comme paramètre pour acceder a la sauce correspondant à la base de donnée 
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // onb vérifie que l'utilisateur qui a crée la suace est bien le bon 
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'Non autorisée' });
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                // suppression via la méthode unlike de FS avec le chemin pour trouver le fichier 
                fs.unlink(`images/${filename}`, () => {
                    //nous supprimons la sauce de la base de donnée 
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(res.status(200).json({ message: "Sauce supprimée" }))
                        .catch((error) => res.status(400).json({ error }));
                });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};


exports.likeSauce = (req, res, next) => {
    const id = req.params.id;
    const userId = req.body.userId;
    const like = req.body.like;
    //ajout du like
    Sauce.findById({ _id: id })
        .then((sauce) => {
            //si le client veut like
            if (like == 1) {
                // Ajout d'un "like"
                Sauce.findByIdAndUpdate(
                    { _id: id },
                    { $addToSet: { usersLiked: userId }, $inc: { likes: 1 } }
                )
                    .then(res.status(200).json({ message: 'Like ajouté' }))
                    .catch((err) => res.status(500).json(err));
            }
            //si le client veut dislike
            else if (like == -1) {

                // Ajout d'un "dislike"
                Sauce.findByIdAndUpdate(
                    { _id: id },
                    { $addToSet: { usersDisliked: userId }, $inc: { dislikes: 1 } }
                )
                    .then(res.status(200).json({ message: 'Dislike ajouté' }))
                    .catch((err) => res.status(500).json(err));
            }
            //si le client veut supprimer son like ou dislike
            else {
                if (sauce.usersLiked.includes(userId)) {

                    //retire le like
                    Sauce.findByIdAndUpdate(
                        { _id: id },
                        { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
                    )
                        .then(res.status(200).json({ message: 'Like retiré' }))
                        .catch((err) => res.status(500).json(err));
                }
                if (sauce.usersDisliked.includes(userId)) {
                    //retire le dislike
                    Sauce.findByIdAndUpdate(
                        { _id: id },
                        { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
                    )
                        .then(res.status(200).json({ message: 'Dislike retiré' }))
                        .catch((err) => res.status(500).json(err));
                }
            }
        })
        .catch((err) => {
            console.warn(err);
            res.status(500).json(err);
        });
};
